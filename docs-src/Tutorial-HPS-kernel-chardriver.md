# Char device driver

Agora iremos criar um driver do tipo char, este módulo irá aparecer como um dispositivo no `/dev/`, suportando que um programa no userspace interaja com ele.

## Syscall

Lembre que no linux tudo é um arquivo, inclusive um driver. Para ele se comportar como um arquivo devemos implementar no mínimo as as seguintes chamadas de sistema: `open`, `close/release`, `read` e `write`. Com isso, um programa no userspace poderá interagir com o nosso driver.

!!! info "chamada de sistemas"
    Um módulo do tipo char pode implementar outras chamadas de sistema, como definido no arquivo
    `fs.h` no repositório do kernel:

    ```c
    struct file_operations {
	struct module *owner;
	loff_t (*llseek) (struct file *, loff_t, int);
	ssize_t (*read) (struct file *, char __user *, size_t, loff_t *);
	ssize_t (*write) (struct file *, const char __user *, size_t, loff_t *);
	ssize_t (*read_iter) (struct kiocb *, struct iov_iter *);
	ssize_t (*write_iter) (struct kiocb *, struct iov_iter *);
	int (*iterate) (struct file *, struct dir_context *);
	unsigned int (*poll) (struct file *, struct poll_table_struct *);
	long (*unlocked_ioctl) (struct file *, unsigned int, unsigned long);
	long (*compat_ioctl) (struct file *, unsigned int, unsigned long);
	int (*mmap) (struct file *, struct vm_area_struct *);
	int (*open) (struct inode *, struct file *);
	int (*flush) (struct file *, fl_owner_t id);
	int (*release) (struct inode *, struct file *);
	int (*fsync) (struct file *, loff_t, loff_t, int datasync);
	int (*aio_fsync) (struct kiocb *, int datasync);
	int (*fasync) (int, struct file *, int);
	int (*lock) (struct file *, int, struct file_lock *);
	ssize_t (*sendpage) (struct file *, struct page *, int, size_t, loff_t *, int);
	unsigned long (*get_unmapped_area)(struct file *, unsigned long, unsigned long, unsigned long, unsigned long);
	int (*check_flags)(int);
	int (*flock) (struct file *, int, struct file_lock *);
	ssize_t (*splice_write)(struct pipe_inode_info *, struct file *, loff_t *, size_t, unsigned int);
	ssize_t (*splice_read)(struct file *, loff_t *, struct pipe_inode_info *, size_t, unsigned int);
	int (*setlease)(struct file *, long, struct file_lock **, void **);
	long (*fallocate)(struct file *file, int mode, loff_t offset,
			  loff_t len);
	void (*show_fdinfo)(struct seq_file *m, struct file *f);
    #ifndef CONFIG_MMU
        unsigned (*mmap_capabilities)(struct file *);
    #endif
    };
    ```

## ebbchar

O código a seguir implementa um driver muito simples do tipo char, esse driver possui as operações listadas no struct `fops`.

Esse driver faz o seguinte: Ele imprime no log do sistema tudo o que for escrito nele e retornar para leitura a mesma string que foi escrito, isso é feito salvando a mensagem na região de memória chamada de `message` (criada no init do módulo com `kmalloc`). Toda vez que o driver for aberto por um programa ele incrementa um contador global e imprime no log do sistema esse valor.

```

        +-------+
 <------|       |----------------<
 |      |       |                 | 
 |      +-------+  test.c         |  
 |                                |            users space
-v--------------------------------^----------------------
 |                                |            kernel space
 |                                |
 |      +------------------+      |  
 | write|   kmalloc        |read  |
 |----->-\     -------    /-->----
        | \   |       |  / | 
        |  \->|message|->  |
        |      ---|---     |
        +---------|--------+ 
                  |    ebbchar.c
                  v
                   demesg
```

!!! tip
    Não copie apenas, leia e entenda. Os códigos fornecidos estão são bem comentandos.


Crie e inicialize com os códigos a seguir, resultando em três arquivos: `ebbchar.c`, `test.c` e `Makefile`

=== "Makefile"
    ```c
    obj-m+=ebbchar.o

    all:
        make -C /lib/modules/$(shell uname -r)/build/ M=$(PWD)  modules
        $(CC) test.c -o test
    clean:
        make -C /lib/modules/$(shell uname -r)/build/ M=$(PWD) clean
        rm test
    ```

=== "ebbchar.c"

    ```c
    /*
    * @file   ebbchar.c
    * @author Derek Molloy
    * @date   7 April 2015
    * @version 0.1
    * @brief   An introductory character driver to support the second article of my series on
    * Linux loadable kernel module (LKM) development. This module maps to /dev/ebbchar and
    * comes with a helper C program that can be run in Linux user space to communicate with
    * this the LKM.
    * @see http://www.derekmolloy.ie/ for a full description and follow-up descriptions.
    *
    * Corsi 20b: Modifiquei para usar kmalloc no lugar de de alocacao estática.
    *
    */

    #include <linux/init.h>           // Macros used to mark up functions e.g. __init __exit
    #include <linux/module.h>         // Core header for loading LKMs into the kernel
    #include <linux/device.h>         // Header to support the kernel Driver Model
    #include <linux/kernel.h>         // Contains types, macros, functions for the kernel
    #include <linux/fs.h>             // Header for the Linux file system support
    #include <linux/uaccess.h>          // Required for the copy to user function
    #include <linux/slab.h>

    #define  DEVICE_NAME "ebbchar"    ///< The device will appear at /dev/ebbchar using this value
    #define  CLASS_NAME  "ebb"        ///< The device class -- this is a character device driver

    MODULE_LICENSE("GPL");            ///< The license type -- this affects available functionality
    MODULE_AUTHOR("Derek Molloy");    ///< The author -- visible when you use modinfo
    MODULE_DESCRIPTION("A simple Linux char driver for the BBB");  ///< The description -- see modinfo
    MODULE_VERSION("0.1");            ///< A version number to inform users

    static int    majorNumber;                  ///< Stores the device number -- determined automatically
    static char   *message;                     ///< Memory for the string that is passed from userspace
    static short  size_of_message;              ///< Used to remember the size of the string stored
    static int    numberOpens = 0;              ///< Counts the number of times the device is opened
    static struct class*  ebbcharClass  = NULL; ///< The device-driver class struct pointer
    static struct device* ebbcharDevice = NULL; ///< The device-driver device struct pointer

    // The prototype functions for the character driver -- must come before the struct definition
    static int     dev_open(struct inode *, struct file *);
    static int     dev_release(struct inode *, struct file *);
    static ssize_t dev_read(struct file *, char *, size_t, loff_t *);
    static ssize_t dev_write(struct file *, const char *, size_t, loff_t *);

    /** @brief Devices are represented as file structure in the kernel. The file_operations structure from
    *  /linux/fs.h lists the callback functions that you wish to associated with your file operations
    *  using a C99 syntax structure. char devices usually implement open, read, write and release calls
    */
    static struct file_operations fops =
    {
    .open = dev_open,
    .read = dev_read,
    .write = dev_write,
    .release = dev_release,
    };

    /** @brief The LKM initialization function
    *  The static keyword restricts the visibility of the function to within this C file. The __init
    *  macro means that for a built-in driver (not a LKM) the function is only used at initialization
    *  time and that it can be discarded and its memory freed up after that point.
    *  @return returns 0 if successful
    */
    static int __init ebbchar_init(void){
    printk(KERN_INFO "EBBChar: Initializing the EBBChar LKM\n");

    // Try to dynamically allocate a major number for the device -- more difficult but worth it
    majorNumber = register_chrdev(0, DEVICE_NAME, &fops);
    if (majorNumber<0){
        printk(KERN_ALERT "EBBChar failed to register a major number\n");
        return majorNumber;
    }
    printk(KERN_INFO "EBBChar: registered correctly with major number %d\n", majorNumber);

    // Register the device class
    ebbcharClass = class_create(THIS_MODULE, CLASS_NAME);
    if (IS_ERR(ebbcharClass)){                // Check for error and clean up if there is
        unregister_chrdev(majorNumber, DEVICE_NAME);
        printk(KERN_ALERT "Failed to register device class\n");
        return PTR_ERR(ebbcharClass);          // Correct way to return an error on a pointer
    }
    printk(KERN_INFO "EBBChar: device class registered correctly\n");

    // Register the device driver
    ebbcharDevice = device_create(ebbcharClass, NULL, MKDEV(majorNumber, 0), NULL, DEVICE_NAME);
    if (IS_ERR(ebbcharDevice)){               // Clean up if there is an error
        class_destroy(ebbcharClass);           // Repeated code but the alternative is goto statements
        unregister_chrdev(majorNumber, DEVICE_NAME);
        printk(KERN_ALERT "Failed to create the device\n");
        return PTR_ERR(ebbcharDevice);
    }

    // alocate mem
    message = kmalloc(32, GFP_KERNEL);
    if (IS_ERR(message)){
        printk(KERN_INFO "Failed to allocate mem \n");
        return PTR_ERR(message);
    }

    printk(KERN_INFO "EBBChar: device class created correctly\n"); // Made it! device was initialized
    return 0;
    }

    /** @brief The LKM cleanup function
    *  Similar to the initialization function, it is static. The __exit macro notifies that if this
    *  code is used for a built-in driver (not a LKM) that this function is not required.
    */
    static void __exit ebbchar_exit(void){
    device_destroy(ebbcharClass, MKDEV(majorNumber, 0));     // remove the device
    class_unregister(ebbcharClass);                          // unregister the device class
    class_destroy(ebbcharClass);                             // remove the device class
    unregister_chrdev(majorNumber, DEVICE_NAME);             // unregister the major number
    kfree(message);                                          // release memmory
    printk(KERN_INFO "EBBChar: Goodbye from the LKM!\n");
    }

    /** @brief The device open function that is called each time the device is opened
    *  This will only increment the numberOpens counter in this case.
    *  @param inodep A pointer to an inode object (defined in linux/fs.h)
    *  @param filep A pointer to a file object (defined in linux/fs.h)
    */
    static int dev_open(struct inode *inodep, struct file *filep){
    numberOpens++;
    printk(KERN_INFO "EBBChar: Device has been opened %d time(s)\n", numberOpens);
    return 0;
    }

    /** @brief This function is called whenever device is being read from user space i.e. data is
    *  being sent from the device to the user. In this case is uses the copy_to_user() function to
    *  send the buffer string to the user and captures any errors.
    *  @param filep A pointer to a file object (defined in linux/fs.h)
    *  @param buffer The pointer to the buffer to which this function writes the data
    *  @param len The length of the b
    *  @param offset The offset if required
    */
    static ssize_t dev_read(struct file *filep, char *buffer, size_t len, loff_t *offset){
    int error_count = 0;
    // copy_to_user has the format ( * to, *from, size) and returns 0 on success
    error_count = copy_to_user(buffer, message, size_of_message);

    if (error_count==0){            // if true then have success
        printk(KERN_INFO "EBBChar: Sent %d characters to the user\n", size_of_message);
        return (size_of_message=0);  // clear the position to the start and return 0
    }
    else {
        printk(KERN_INFO "EBBChar: Failed to send %d characters to the user\n", error_count);
        return -EFAULT;              // Failed -- return a bad address message (i.e. -14)
    }
    }

    /** @brief This function is called whenever the device is being written to from user space i.e.
    *  data is sent to the device from the user. The data is copied to the message[] array in this
    *  LKM using the sprintf() function along with the length of the string.
    *  @param filep A pointer to a file object
    *  @param buffer The buffer to that contains the string to write to the device
    * aaaaaaa @param len The length of the array of data that is being passed in the const char buffer
    *  @param offset The offset if required
    */
    static ssize_t dev_write(struct file *filep, const char *buffer, size_t len, loff_t *offset){
    copy_from_user(message, buffer, len);
    size_of_message = len;                 // store the length of the stored message
    printk(KERN_INFO "EBBChar: Received %zu characters from the user\n", len);
    return len;
    }

    /** @brieaf The device release function that is called whenever the device is closed/released by
    *  the userspace program
    *  @param inodep A pointer to an inode object (defined in linux/fs.h)
    *  @param filep A pointer to a file object (defined in linux/fs.h)
    */
    static int dev_release(struct inode *inodep, struct file *filep){
    printk(KERN_INFO "EBBChar: Device successfully closed\n");
    return 0;
    }

    /** @brief A module must use the module_init() module_exit() macros from linux/init.h, which
    *  identify the initialization function at insertion time and the cleanup function (as
    *  listed above)
    */
    module_init(ebbchar_init);
    module_exit(ebbchar_exit);
    ```

=== "test.c"

    ```c
    /**
    * @file   testebbchar.c
    * @author Derek Molloy
    * @date   7 April 2015
    * @version 0.1
    * @brief  A Linux user space program that communicates with the ebbchar.c LKM. It passes a
    * string to the LKM and reads the response from the LKM. For this example to work the device
    * must be called /dev/ebbchar.
    * @see http://www.derekmolloy.ie/ for a full description and follow-up descriptions.
    */
    #include<stdio.h>
    #include<stdlib.h>
    #include<errno.h>
    #include<fcntl.h>
    #include<string.h>
    #include<unistd.h>

    #define BUFFER_LENGTH 256               ///< The buffer length (crude but fine)
    static char receive[BUFFER_LENGTH];     ///< The receive buffer from the LKM

    int main(){
    int ret, fd;
    char stringToSend[BUFFER_LENGTH];
    printf("Starting device test code example...\n");
    fd = open("/dev/ebbchar", O_RDWR);             // Open the device with read/write access
    if (fd < 0){
        perror("Failed to open the device...");
        return errno;
    }

    while(1){
        printf("Type in a short string to send to the kernel module:\n");
        scanf("%[^\n]%*c", stringToSend);                // Read in a string (with spaces)
        printf("Writing message to the device [%s].\n", stringToSend);
        ret = write(fd, stringToSend, strlen(stringToSend)); // Send the string to the LKM
        if (ret < 0){
            perror("Failed to write the message to the device.");
            return errno;
        }

        //printf("Press ENTER to read back from the device...\n");
        //getchar();

        printf("Reading from the device...\n");
        ret = read(fd, receive, BUFFER_LENGTH);        // Read the response from the LKM
        if (ret < 0){
            perror("Failed to read the message fm the device.");
            return errno;
        }
        printf("The received message is: [%s]\n", receive);
    }

    printf("End of the program\n");
    close(fd);
    return 0;
    }
    ```

Vamos analisar algumas partes desse código:

- `ebbchar_iniat`: é chamado sempre que o driver for inserido no kernel (`insmod`) e faz o registro do módulo coamo device no `/dev/eebchar`. Nessa etapa o driver aloca uma memória para uso interno pelo comando [`kmalloc`](https://www.kernel.org/doc/htmldocs/kernel-hacking/routines-kmalloc.html)

``` c
   // alocate mem
   message = kmalloc(32, GFP_KERNEL);
   if (IS_ERR(message)){
      printk(KERN_INFO "Failed to allocate mem \n");
      return PTR_ERR(message);
   }
```

- `ebbchar_exit`: é chamada quando o driver for removido do kernel (`rmmod`), e remove o device do `/dev/ebbchar`, libera a memória que foi alocada anteriormente (`kfree`).

- A função `dev_open` é chamada sempre que um programa abrir o device como um arquivo, sempre que isso  acontece uma variável global (`numberOpens`) é incrementada e um log `KERN_INFO` gerado.

- `dev_write`: é chamado sempre que acontece uma escrita no driver, quando isso acontece a mensagem que foi passada no comando de write no programa do userspace é copiada para a região de memória `message`:

```c
static ssize_t dev_write(struct file *filep, const char *buffer,
                         size_t len, loff_t *offset){
   copy_from_user(message, buffer, len);
   ...
```

- `dev_read`: é chamada quando acontece uma operação de leitura no driver, o módulo retorna a mensagem salva no buffer `message`:

```c
static ssize_t dev_read(struct file *filep, char *buffer,
                        size_t len, loff_t *offset){
   int error_count = 0;
   // copy_to_user has the format ( * to, *from, size) and returns 0 on success
   error_count = copy_to_user(buffer, message, size_of_message);
   ...
```

### Testando

Para testar basta compilar o módulo e o programa de teste com o comando `make`, uma vez compilado você deve carregar o módulo  (verificar se ele inicializou corretamente) e então executar o programa de teste.

1. Em um terminal execute o comando `dmesg -wH`.
1. Em outro terminal execute: `make`
1. `sudo insmod ebbchar.ko`
1. Você deve obter o log a seguir no terminal do dmesg:
    ```
    [12944.610531] EBBChar: Initializing the EBBChar LKM
    [12944.610537] EBBChar: registered correctly with major number 236
    [12944.610577] EBBChar: device class registered correctly
    [12944.613972] EBBChar: device class created correctly
    ```
1. verificando se device foi inserido corretamente: `ls /dev/ebbchar` (deve ter esse arquivo)
1. agora vamos inicializar o programa `sudo ./test`
1. note que o dmesg indicou que alguém abriu o nosso driver:
   ```
  [nov 3 13:07] EBBChar: Device has been opened 1 time(s)
   ```
1. agora no terminal que executou o programa test, escreva alguma coisa, você irá notar que a mesma informação será imprimida de volta:

    ```
    Type in a short string to send to the kernel module:
    123
    Writing message to the device [123].
    Reading from the device...
    The received message is: [123]
    ```
1. No dmesg aparece a informação de quantos bytes o usuário digitou.

!!! info 
    1. Experimente você escrever uma mensagem grande no terminal do programa test, o que acontece?
    1. Porque isso acontece?
    
Pronto! acabamos de criar nosso primeiro device driver, ele ainda não controla nenhum hardware, mas já implementamos a interface com o sistema operacional. Agora vem a parte que mais dominamos, controlar hardware (criar ponteiro, configurar e escrever).

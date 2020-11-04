# Kernel module

Nesse tutorial iremos trabalhar com o básico do desenvolvimento de módulos para o kernel do linux.

## Simple module

!!! tip
    Antes de começar instale:
    
    ```
    apt-get install build-essential linux-headers-`uname -r`
    ```

!!! note
    Trabalhe dentro de uma pasta chamada `simple_module`.

Crie um arquivo `simple.c` e inicialize com o código a seguir:

```c
// simple.c
// https://tldp.org/LDP/lkmpg/2.6/html/x121.html
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/module.h>

MODULE_DESCRIPTION("My kernel module");
MODULE_AUTHOR("Me");
MODULE_LICENSE("GPL");

static int simple_init(void) {
        printk(KERN_INFO "HELLO, WORLD \n");
        return 0;
}

static void simple_exit(void) {
        printk(KERN_INFO "GOODBYE, WORLD \n");
}

module_init(simple_init);
module_exit(simple_exit);
```

Pronto! Este é um módulo que pode ser lincado no kernel do Linux em tempo de execução e altera o seu funcionamento (na verdade não faz nada). Vamos entender algumas coisas:

- Todo módulo deve ter uma função de inicialização e saída, essas funções podem ter qualquer nome, mas devem ser informadas ao kernel pelas macros `module_init()` e `module_exit()`.

!!! info "kernel doc"
    `__initcall()/module_init() include/linux/init.h`

    Many parts of the kernel are well served as a module (dynamically-loadable parts of the kernel). Using the `module_init()` and `module_exit()` macros it is easy to write code without `#ifdefs` which can operate both as a module or built into the kernel.

    The `module_init()` macro defines which function is to be called at module insertion time (if the file is compiled as a module), or at boot time: if the file is not compiled as a module the `module_init()` macro becomes equivalent to `__initcall()`, which through linker magic ensures that the function is called on boot.

    The function can return a negative error number to cause module loading to fail (unfortunately, this has no effect if the module is compiled into the kernel). This function is called in user context with interrupts enabled, so it can sleep. 

    > ref: https://www.kernel.org/doc/htmldocs/kernel-hacking/routines-init-again.html

- `printk`: É uma das funções mais conhecidas no kernel do Linux, usada para criar logs e rastrear bugs. A saída desse print não é no terminal como o printf, mas sim no `demesg`.

!!! info "kernel doc"
    Para mais informações acesse: 
    
    - https://www.kernel.org/doc/html/latest/core-api/printk-basics.html

Agora precisamos compilar esse módulo para um `.ko`, para isso crie um arquivo `Makefile`:

```make
// Makefile
obj-m += simple.o

all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
```

### compilando e testando

Agora você pode compilar o módulo com o comando `make`, uma vez feito isso o arquivo `simple.ko` deve ter sido gerado na pasta do projeto. Esse arquivo é o módulo compilado e que iremos linkar no kernel do linux usando o comando:

```bash
$ sudo insmod simple.ko
```

Isso fará com que o módulo faça parte do kernel, para verificarmos se funcionou podemos listar os módulos em execução com o comando `lsmod`:

```bash
$ lsmod | grep simple
```

Para termos acesso ao log (mensagem de HELLO), basta acessarmos o `dmesg`:

```bash
$ dmesg | tail
```

Para remover o módulo usamos o comando `rmmod`:

```bash
$ sudo rmmod simple
```

Então devemos ver a mensagem de Goodbye no `demesg`:

```bash
$ dmesg | tail
```

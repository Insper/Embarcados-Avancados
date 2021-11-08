# Linux Device Driver

- Aluno: Bruno Toranja
- Curso: Engenharia da Computação
- Semestre: 7
- Contato: 
- Link tutorial oficial: https://github.com/brunoartc/virtual_com_driver
- Ano: 2019

!!! example "Hardware utilizado no tutorial"
    - ?
    
## Introdução

Um driver de linux é um programa que facilita a comunicação dos programas com a parte fisica do nosso dispositivo 

### 1. Kernel space e user space

Para entendermos como isso funciona primeiro temos que entender o que significam os programas e o kernel

Os programas rodam em uma parte especial da nossa memoria chamada de espaço de usuario, como por exemplo o python ou ate mesmo um bash, esses programas normalmente não precisam acessar itens de mais baixo nivel como por exemplo acesso direto a memoria ou portas UBS por exemplo.

Essas tarefas sao executadas pelo kernel space que sabe lidar com o nosso hardware de uma maneira eficiente disponibilizando um tipo "API" para o user space lidar isso , e esse é o trabalho dos drivers, a parte da tradução dos comandos de usuario para que o kernel execute.

### 2. Como o driver conversa com o computador

Os programas localizados no user space tem um momento especifico para pedir coisas para o kernel sobre o hardware como eh o caso de exploradores de arquivos e comunicação serial, caso algum desses programas queira se comunicar com um acessorio que não tenha seu proprio driver, temos um problema pois esse não conseguira ser comunicado

Entao temos outra opção para isso, desenvolver nosso proprio driver, para ser compilado juntamente com o kernel e vir juntamente com ele, ou um simples modulo que é compilado a parte e depois carregado no linux a partir do user space que ensinaremos nesse tutorial

## 3. criação do modulo basico

O nosso modulo precisa ser criado em alguma linguagem que o kernel do linux entenda, por isso utilizaremos o C

### a. Estruturação de um modulo  

Primeiramente precisamo incluir a biblioteca de modulos do linux, para faremos um novo arquivo chamado de tcom.c

```sh
touch tcom.c
```

precisamos adicionar os headers no nosso arquivo tambem

```sh
nano tcom.c
```

dentro do arquivo temos que adicionar as duas linhas de bibliotecas para que possamos usar as funções que conversam com o kernel alem de poder usar seus macros

```C
#include <linux/init.h>
#include <linux/module.h>
```

Com as bibliotecas importadas podemos começar o nosso codigo como por exemplo fazer dizer o que nosso driver fará ao ser carregado e descarregado.

Essas funções tem um padrão para se seguir em que a função de inicialização retorna um inteiro e o exit nao retorna nada como mostrado acima [referencia no linux](https://github.com/torvalds/linux/tree/f1f2f614d535564992f32e720739cb53cf03489f/include/linux/module.h#L72-L74)


```C
static int init_com(void)
{
    return  0;
}
   
static void finish_com(void)
{
    return;
}

module_init(init_com);
module_exit(finish_com);

```

essas duas funcoes podem ser chamadas pelas macros module_init e module_exit, que vao ser chamados no momento de inicio do modulo e saida do modulo [referencia no linux](https://github.com/torvalds/linux/blob/f1f2f614d535564992f32e720739cb53cf03489f/include/linux/module.h#L76-L107)



tem tambem muitas outra opções para definir o autor do módulo e ate mesmo a licensa dele, mas nao entraremos em muitos detalhes

#### b. Funcionalidades do modulo 


Podemos por exemplo fazer um driver que simplesmente mande um Hello World para o kernel quando ele é inicializado para isso semelhante a um programa em C utilizaremos uma função print

precisamos importar mais uma biblioteca para que essa função fique disponivel

```C
#include <linux/kernel.h>
```

com essa funcão importada temos acesso ao printk uma função que printa ao log do kernel


Ate agora temos um programa assim

```C
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/module.h>

static int init_com(void)
{
    printk("\nHello World\n");
    return  0;
}
   
static void finish_com(void)
{
    return;
}

module_init(init_com);
module_exit(finish_com);
```

#### c. Compilando o modulo


podemos entao compilar o nosso programa usando uma Makefile contendo 


```Makefile
obj-m := tcom.o
```


usamos tambem por padrao o lib modules do nosso sistema que esta localizado em ```/lib/modules/$(uname -r)/build``` 
> se for testar no seu linux deixe /lib/modules/$(uname -r)/build
ou podemos gerar nosso proprio com um kernel do linux 

```bash
make modules_install INSTALL_MOD_PATH=/some/root/folder
```

ou simplesmente dentro da sua pasta do linux

```bash
make modules
```

usando

```bash
make -C /path/para/source/linux M=`pwd` modules

```

para compilar ~~ou use Makefile no repo~~


#### d. Carregando o modulo e verificando

com isso teremos um arquivo .ko que para todos os fins é o nosso driver, este pode ser carregado e descarregado usando insmod e rmmod respectivamente

como uma simples demosntração podemos abrir um terminal e observar os logs do linux

```bash
tail -f /var/log/kern.log
```

enquanto em outro terminal compilamos o modulo e carregamos ele

```bash
make -C /path/para/source/linux M=`pwd` modules
sudo insmod ./tcom.ko
sudo rmmod ./tcom.ko

```

depois de executar esses comandos no linux voltamos ao nosso terminal que esta acompanhando o log do kernel e vemos que com sucesso obtivemos a mensagem

```log
kernel: [666.1337] Hello World
```

Com isso temos a nossa primeira implementacao de um driver que simplesmesnte sobe uma mensagem para o kernel

#### 4. criação do modulo com funcionalidade (comunicação char)

#### a. Adicionar novas funcionalidades


Agora precisamos dar alguma funcionalidade para o nosso driver, como por exemplo interfacear com o hardware para simplesmente receber mensagens

Como tudo no linux precisamos abrir um arquivo para fazer a comunicacao com o kernel space e este fazer a comunicacao com o hardware, para isso precisamos importar mais algumas bibliotecas 

```C

/* para os codigos de erros que serão utilizados daqui para a frente */
#include <linux/errno.h> 

/* controlar o sistema de arquivos */

#include <linux/fs.h>
#include <linux/proc_fs.h>


/* alocar memoria no kernel space */
#include <linux/slab.h> 

/* medir o tamanho das variaveis usado no kmalloc */
#include <linux/types.h> 


#include <linux/fcntl.h> /* O_ACCMODE */

/* acessar o user space */
#include <asm/uaccess.h> 


```

com esses includes novos podemos trabalhar com algumas funcoes mais avancadas da criacao de drivers e dar mais um passo ao nosso vriver que interpreta mensagens do hardware fisico mas ainda preisamos fazer as funcoes que permitem que nosso driver funcione, no caso para excrever e ler apenas um char.

#### b. Adicionar a relação do driver com o hardware

comecaremos declarando qual a regiao de memoria que iremos acessar com o numero de identificação do driver para ele acessar os perifericos que utilizam desse driver

```C

/* o numero da versao do nosso driver */
int memory_major = 60;

/* onde nossa memoria vai ser salva*/

char *memory_buffer;

```

#### c. Funções de inicialização de memoria

temos tambem que mudar nossa função de inicialização para que quando o driver se inicialize ele aloque um espaço de memoria que será usado, assim como um programa em C, sua liberação tambem deve ser criada, nossa função de inicialização e saida deve ser mais ou menos assim

```C
int memory_init(void) {

  int result;



  /* Registrar o nosso driver para os hardwares certos */

  result = register_chrdev(memory_major, "memory", &memory_fops);


    /* Alocar o espaço de memoria para o programa*/
  memory_buffer = kmalloc(1, GFP_KERNEL); 

  if (!memory_buffer) { 

    result = -ENOMEM;

    memory_exit(); 

    return result;

  } 

  memset(memory_buffer, 0, 1);



  printk("<1>Driver simples de memoria inicializado\n"); 

  return 0;


    

}


void memory_exit(void) {

  /* Liberando o numero de registro no sistema*/

  unregister_chrdev(memory_major, "memory");



  /* Liberando o espaço de memoria */

  if (memory_buffer) {

    kfree(memory_buffer);

  }



  printk("<1>Liberando memorias e descarregando modulo\n");



}

```


#### d. Funções para manipulação de memoria



temos agora uma parte do nosso programa para iniciar e liberar espaços de memoria que podemos trabalhar, mas nosso driver ainda nao executa nenhuma função 

para isso faremos uma funcao que abre o nosso "arquivo" e uma que deixa nosso arquivo disponivel para outros programas apos a execução da primeira

```C
int memory_open(struct inode *inode, struct file *filp) {



  /* Success */

  return 0;

}
int memory_release(struct inode *inode, struct file *filp) {

 

  /* Success */

  return 0;

}
```


agora tambem precisamos que apos abrir o local de memoria do nosso driver nos possamos ler e escrever nele podemos fazer isso com uma função que copia do buffer para a nossa memoria e vice-versa

```C
ssize_t memory_read(struct file *filp, const char *buf, 

                    size_t count, loff_t *f_pos) { 

 

  /* Transfering data to user space */ 

  copy_to_user(buf,memory_buffer,1);



  /* Changing reading position as best suits */ 

  if (*f_pos == 0) { 

    *f_pos+=1; 

    return 1; 

  } else { 

    return 0; 

  }

}
ssize_t memory_write( struct file *filp, char *buf,

                      size_t count, loff_t *f_pos) {



  char *tmp;



  tmp=buf+count-1;

  copy_from_user(memory_buffer,tmp,1);

  return 1;

}

```


ate agora fizemos um modulo para o nosso proprio linux mas podemos tambem fazer a compilação de um modulo para um dispositivo ARM embarcado simplesmente mudando algumas linhas do nosso Makefile 

```Makefile
export CROSS_COMPILE=
export ARCH=x86_64
```

por

```Makefile
export CROSS_COMPILE=gcc-arm-linux-gnueabi-
export ARCH=arm
```

agora que temos um driver simples que consegue compreender o que escrevemos e passar para um hardware virtual nosso podemos passar para coisas um pouco mais uteis e complexas como por exemplo controlar um led da placa, e é isso que faremos nessa sessão


### 5. driver que controla GPIO do raspberry

primeiramente utilizaremos o outro codigo de esqueleto ele tem que estar mais ou menos assim 

```C
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/module.h>
/* para os codigos de erros que serão utilizados daqui para a frente */
#include <linux/errno.h> 
/* controlar o sistema de arquivos */
#include <linux/fs.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
/* alocar memoria no kernel space */
#include <linux/slab.h> 
/* medir o tamanho das variaveis usado no kmalloc */
#include <linux/types.h> 
#include <linux/fcntl.h> /* O_ACCMODE */
int memory_major = 60;
/* Buffer para guardar os dados */
char *memory_buffer;
static void finish_com(void)
{
    /* liberando o numero de versao */
  unregister_chrdev(memory_major, "memory");
  /* liberando a memoria para outro programa */
  if (memory_buffer) {
    kfree(memory_buffer);
  }
  printk("<1>Removing memory module\n");
}



int memory_open(struct inode *inode, struct file *filp) {
  /* Success */
  return 0;
}
int memory_release(struct inode *inode, struct file *filp) {
  /* Success */
  return 0;
}
static ssize_t memory_read(struct file *filp, char *buf, 

                    size_t count, loff_t *f_pos) { 
  /* Copia para o user space */ 
  raw_copy_to_user(buf,memory_buffer,1);
  /* Changing reading position as best suits */ 
  if (*f_pos == 0) { 
    *f_pos+=1; 
    return 1; 
  } else { 
    return 0; 
  }
}

static ssize_t memory_write( struct file *filp, const char *buf,
                      size_t count, loff_t *f_pos) {
  char *tmp;
  tmp=buf+count-1;
  raw_copy_from_user(memory_buffer,tmp,1);
  return 1;
}


static struct file_operations tcom_fops = 
{
    .owner   = THIS_MODULE,
    .read    = memory_read,
    .write   = memory_write,
    .open    = memory_open,
    .release = memory_release
};


static int init_com(void)
{
    int result;
  /* registrando o driver */
 register_chrdev(memory_major, "memory", &tcom_fops); //TODO FIX NULL with pointer to file_operands
  /* alocar a memoria para o driver */
  memory_buffer = kmalloc(1, GFP_KERNEL); 
  if (!memory_buffer) { 
    result = -ENOMEM;
    finish_com();
    return result;
  } 
  memset(memory_buffer, 0, 1);
  return 0;
}
MODULE_LICENSE("Dual BSD/GPL");
module_init(init_com);
module_exit(finish_com);

```

com esse codigo que fizemos na sessao anterior temos apensar que criar uma função que receba de input os nossos enderecos de memorias do pino e definir como os bits que precisam estar ligados como por exemplo vamos usar como base um raspbery e seus GPIOs (https://www.raspberrypi.org/app/uploads/2012/02/BCM2835-ARM-Peripherals.pdf)

definimos primeiro a estrutura de um GPIO da rapberry como o exmplo abaixo

```
struct GpioRegisters
{
    uint32_t GPFSEL[6];
    uint32_t Reserved1;
    uint32_t GPSET[2];
    uint32_t Reserved2;
    uint32_t GPCLR[2];
};

struct GpioRegisters *s_pGpioRegisters;
```

então precisamos agora definir as funcoes para podermos fazer alguma coisa  quando tivermos os registradores do raspberry para isso podemos utilizar das seguintes funcoes

```C
static void definirFuncaoDoGPIO(int GPIO, int functionCode)
{
    int IndexRegistrador = GPIO / 10;
    int bit = (GPIO % 10) * 3;
 
    unsigned oldValue = s_pGpioRegisters-> GPFSEL[IndexRegistrador];
    unsigned mask = 0b111 << bit;
 
    s_pGpioRegisters-> GPFSEL[IndexRegistrador] = 
        (oldValue & ~mask) | ((functionCode << bit) & mask);
}
 
static void SetGPIOOutputValue(int GPIO, bool outputValue)
{
    if (outputValue)
        s_pGpioRegisters->GPSET[GPIO / 32] = (1 << (GPIO % 32));
    else
        s_pGpioRegisters->GPCLR[GPIO / 32] = (1 << (GPIO % 32));
}
```

com essas funcoes para a manipulação das GPIOs do nosso raspberry podemos criar um timer que aciona elas em momentos distintos para deixar o pino escolhido como alto ou baixo e verificar com o nosso led 

Poderiamos usar timer mas por questoes de tempo so deixaremos um pino no estado alto e veremos o seu efeito e logo em seguida ao descarregarmos o driver ele voltara ao seu estado normal de input 
caso alguem queria tentera depois com a biblioteca de timers tambem deixo o codigo fonte da biblioteca para ser estudado [aqui](https://github.com/torvalds/linux/blob/master/include/linux/timer.h)



```C

static int __init LedBlinkModule_init(void)
{
    int result;
 
    s_pGpioRegisters = 
        (struct GpioRegisters *)__io_address(GPIO_BASE);
    SetGPIOFunction( LedGpioPin, 0b001); //Output
 
    SetGPIOOutputValue(LedGpioPin, 1)
}
 
static void __exit LedBlinkModule_exit(void)
{
    SetGPIOFunction( LedGpioPin, 0); //Configure the pin as input
    del_timer(&s_BlinkTimer);
}

```


podedmos passar para algo mais avançado como é o caso das interrupções, como ja temos um conhecimento geral de como sao feitos os drivers de linux podemos pular as etapas sobre a inicialização e saida dos drivers bem como o Makefile e suas dependencias


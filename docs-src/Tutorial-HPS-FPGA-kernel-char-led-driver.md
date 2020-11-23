# Char LED device driver

Agora iremos misturar o tutorial do char-device-driver com o tutorial do `Tutorial - HPS + FPGA - Blink LED`, onde iremos desenvolver um driver no linux capaz de controlar os LEDs da FPGA.

!!! info
    Para seguir nesse tutorial você deve ter feito o do ==HPS + FPGA - Blik LED== e ter o SDCARD configurado com a imagem da FPGA que possui o PD com os PIO que controla os LEDs.
    
## Extraindo do PD 

Para controlarmos os LEDs da FPGA é necessário que saibamos os endereços dos periféricos no barramento do platform designer (AVALON), para não termos que ficar dependentes de números mágicos no nosso driver, iremos usar uma ferramenta do PD que gera um arquivo `.h` com as informações necessárias para podermos controlar os periféricos.

Na pasta do projeto (hardware) execute:

```
$ embedded_command_shell.sh
$ sopc-create-header-files --single hps_0.h --module hps_0
```

Esse comando irá gerar um arquivo `hps_0.h` que contém as informações de endereço de memória que podemos usar para acessar os periféricos na FPGA:

```c
/*
 * Macros for device 'led_pio', class 'altera_avalon_pio'
 * The macros are prefixed with 'LED_PIO_'.
 * The prefix is the slave descriptor.
 */
#define LED_PIO_COMPONENT_TYPE altera_avalon_pio
#define LED_PIO_COMPONENT_NAME led_pio
#define LED_PIO_BASE 0x3000
#define LED_PIO_SPAN 16
#define LED_PIO_END 0x300f
#define LED_PIO_BIT_CLEARING_EDGE_REGISTER 0
#define LED_PIO_BIT_MODIFYING_OUTPUT_REGISTER 0
```

## Configurando driver

Primeiro iremos realizar uma cópia da pasta do driver: `ebbchar` para `ebbchar-led`.

### `hps_0.h`

Copie o arquivo `hps_0.h` para dentro da pasta do driver.

### Makefile

Vamos ter que editar o Makefile para suportar:

1. Cross-compilação
1. Arquivos e funções do Embedded do Quartus

Use o arquivo a seguir no lugar do Makefile original:

```Make
# https://stackoverflow.com/questions/3467850/cross-compiling-a-kernel-module
ARCH=arm
COMPILER=arm-linux-gnueabihf-

ALT_DEVICE_FAMILY ?= soc_cv_av
SOCEDS_ROOT ?= $(SOCEDS_DEST_ROOT)
HWLIBS_ROOT = $(SOCEDS_ROOT)/ip/altera/hps/altera_hps/hwlib

#EXTRA_CFLAGS = -D$(ALT_DEVICE_FAMILY) -I$(HWLIBS_ROOT)/include/$(ALT_DEVICE_FAMILY) -I$(HWLIBS_ROOT)/include/

obj-m := ebbchar.o
KERNELDIR := /home/corsi/work/Embarcados-Avancados/Corsi/linux
PWD := $(shell pwd)

IP = 169.254.0.13
DEST = /root/driver/
PASS = 1234

all: ebbchar.ko, test

ebbchar.ko: ebbchar.c
	$(MAKE) -C $(KERNELDIR) M=$(PWD) ARCH=$(ARCH) CROSS_COMPILE=$(COMPILER) modules

test:
	$(COMPILER)gcc testebbchar.c -o test

deploy: ebbchar.ko test
	sshpass -p $(PASS) scp test root@$(IP):$(DEST)
	sshpass -p $(PASS) scp ebbchar.ko root@$(IP):$(DEST)

clean:
	$(MAKE) -C $(KERNELDIR) M=$(PWD) ARCH=$(ARCH) clean
	rm test
```

!!! info
    Você deve editar a variável `KERNELDIR := ` para o caminho do kernel que você compilou.

### Acessando hardware

No kernel do Linux são várias as funções disponíveis para manipular hardware/ endereço de memória física. Iremos usar apenas a função: 

```c
    void iowrite32(u32 value, void __iomem *addr);
```

!!! info
    - https://lwn.net/Articles/102232/

Essa função escreve um valor `value` a um endereço de memória física `addr`. Para isso funcionar devemos criar um ponteiro que aponta para o periférico PIO na FPGA:

```c
   p_led = ioremap_nocache(ALT_LWFPGASLVS_OFST + LED_PIO_BASE, LED_PIO_SPAN);
```

!!! info
    Estamos falando para o kernel criar um ponteiro e que todo acesso a esse endereço deve ser efetivado no hardware, e não pode ficar no cache. 

Onde `p_led` é uma variável global e estática do módulo:

```c
static int *p_led = NULL;
```

Com isso, podemos agora usar a função `iowrite32` e escrever no periférico PIO do LED, iremos fazer essa escrita dentro da função 
`dev_write`, com o objetivo de escrevermos nos LEDs os valores passados pelo comando de write.

A função deve ficar como:

```
static ssize_t dev_write(struct file *filep, const char *buffer, size_t len, loff_t *offset){
   copy_from_user(message, buffer, len);
   size_of_message = len;                 // store the length of the stored message
   printk(KERN_INFO "EBBChar: Received %zu characters from the user\n", len);
   // escreve no hardware!
   iowrite32(message[0], p_led);  // corsi: write to LED
   return len;
}
```

Agora, toda vez que um programa no userspace escrever nesse driver, o mesmo irá pegar o primeiro byte e transferir para o PIO na FPGA.

## Testando

Para testa:

1. Compile o módulo e o programa de teste
1. Passe para o SoC
1. Carregue o módulo e teste.






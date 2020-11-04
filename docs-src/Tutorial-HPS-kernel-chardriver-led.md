# Device driver - LED

Vamos modificar o exemplo anterior `ebbchar.c` para que ele controle os LEDs do nosso kit de desenvolvimento, similar como fizemos na entrega 5 (com o exemplo do blinkLed). Para isso iremos ter que:

1. editar o Makefile para crosscompilar
1. editar o ebbchar para acessar um periférico
1. testar

## Acessando FPGA

Ainda não vimos, mas é possível acessar a FPGA a partir do ARM,

## Makefile

Modifique o `Makefile` do tutorial anterior para:

!!! note
    1. Você tem que editar a variável `KERNELDIR` para o path do kernel que você compilou.
    1. para usar o deploy será necessário instalar: `sudo apt install sshpass`


```MAKE
# https://stackoverflow.com/questions/3467850/cross-compiling-a-kernel-module

##############################
# EDITAR COM SEU PATH       #
##############################
KERNELDIR := /home/corsi/work/Embarcados-Avancados/Corsi/linux

IP = 169.254.0.13
DEST = /root/driver/
PASS = 1234
#############################

ARCH=arm
COMPILER=arm-linux-gnueabihf-

ALT_DEVICE_FAMILY ?= soc_cv_av
SOCEDS_ROOT ?= $(SOCEDS_DEST_ROOT)
HWLIBS_ROOT = $(SOCEDS_ROOT)/ip/altera/hps/altera_hps/hwlib

EXTRA_CFLAGS = -D$(ALT_DEVICE_FAMILY) -I$(HWLIBS_ROOT)/include/$(ALT_DEVICE_FAMILY) -I$(HWLIBS_ROOT)/include/

obj-m := ebbchar.o

PWD := $(shell pwd)
all: ebbchar.ko, test

ebbchar.ko: ebbchar.c
	$(MAKE) -C $(KERNELDIR) M=$(PWD) ARCH=$(ARCH) CROSS_COMPILE=$(COMPILER) modules

test:
	$(COMPILER)gcc test.c -o test

deploy: ebbchar.ko test
	sshpass -p $(PASS) scp test root@$(IP):$(DEST)1
	sshpass -p $(PASS) scp ebbchar.ko root@$(IP):$(DEST)

clean:
	$(MAKE) -C $(KERNELDIR) M=$(PWD) ARCH=$(ARCH) clean
	rm test
```

## Implementando acesso ao hardware

Agora com a cross compilação configurada iremos ver que acessar endereço de memória físico no kernelspace é muito mais fácil que no userspace (que tem que usar o mmap). Iremos realizar os passos a seguir:

1. Incluir 

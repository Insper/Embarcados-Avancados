# Tip

To control the FPGA LEDs, we need to know the addresses of the peripherals on the platform designer bus (AVALON). To avoid being dependent on magic numbers in our driver, we will use a PD tool that generates a `.h` file with the necessary information to control the peripherals.

In the project folder (hardware), execute:

```
$ embedded_command_shell.sh
$ sopc-create-header-files --single hps_0.h --module hps_0
```

This command will generate a file `hps_0.h` that contains the memory address information that we can use to access the peripherals on the FPGA:

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

## Configuring the driver

We will work with the `ebbchar` example driver.

!!! exercise
    Make a copy of the folde `ebbchar` to `ebbchar-led`.

!!! exercise
    Copy the file `hps_0.h` into the driver folder.

We will need to edit the Makefile to support:

1. Cross-compilation
1. Quartus Embedded files and functions

Use the following file instead of the original Makefile:

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

!!! exercise
    1. Edite the Makefile
    1. You should edit the variable `KERNELDIR := ` to the path of the kernel you compiled.
    1. Edite the IP address
    
### Understanding 

In the Linux kernel, there are many functions available to manipulate hardware/physical memory addresses. We will only use the function: 

```c
void iowrite32(u32 value, void __iomem *addr);
```

!!! info
    - https://lwn.net/Articles/102232/

This function writes a `value` to a physical memory address `addr`. To make this work, we must create a pointer that points to the PIO peripheral in the FPGA:

```c
p_led = ioremap_nocache(ALT_LWFPGASLVS_OFST + LED_PIO_BASE, LED_PIO_SPAN);
```

!!! info
    We are telling the kernel to create a pointer and that every access to this address must be enforced on the hardware, and cannot be cached.

Where `p_led` is a global and static variable of the module:

```c
static int *p_led = NULL;
```

With this, we can now use the `iowrite32` function and write to the LED PIO peripheral, we will make this writing inside the `dev_write` function, aiming to write the values passed by the write command to the LEDs.

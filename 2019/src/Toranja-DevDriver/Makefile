export CROSS_COMPILE=
export ARCH=x86_64

TARGET_MODULE:=sample-module

# If we are running by kernel building system
ifneq ($(KERNELRELEASE),)
	$(TARGET_MODULE)-objs := tcom.o
	obj-m := $(TARGET_MODULE).o
# If we running without kernel build system
else
	MY_BUILDSYSTEM_DIR:=/lib/modules/$(shell uname -r)/build
	BUILDSYSTEM_DIR:=/lib/modules/$(shell uname -r)/build
	#BUILDSYSTEM_DIR:=$(LINUXSOURCE)
	PWD:=$(shell pwd)
	WHOAMI:=$(shell whoami)
all : 
# run kernel build system to make module
	$(MAKE) -C $(BUILDSYSTEM_DIR) M=$(PWD) modules
clean:
# run kernel build system to cleanup in current directory
	$(MAKE) -C $(BUILDSYSTEM_DIR) M=$(PWD) clean
load:
	sudo insmod ./$(TARGET_MODULE).ko

unload:
	sudo rmmod ./$(TARGET_MODULE).ko

test:
ifeq ($(WHOAMI),root)
	$(MAKE) -C $(MY_BUILDSYSTEM_DIR) M=$(PWD) modules
	insmod ./$(TARGET_MODULE).ko
	rmmod ./$(TARGET_MODULE).ko
	$(MAKE) -C $(BUILDSYSTEM_DIR) M=$(PWD) clean
else
	@echo 'Run as root'
endif
	
endif


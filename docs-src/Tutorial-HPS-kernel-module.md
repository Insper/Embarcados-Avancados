# Kernel Module

In this tutorial, we will work with the basics of developing modules for the Linux kernel. We will develop a kernel driver for our computer, since its easy and fast to develop and test. 

## Simple Module

!!! exercise
    Before starting, install:
    
    ```
    apt-get install build-essential linux-headers-`uname -r`
    ```

We will create a very simple driver that print "HELLO, WORLD" when initialized and "GOODBYE, WORLD" when removed from the kernel. The fallowing `.c` code does this: 

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

!!! exercise
    Create the file `simple_module/simple.c` with the previous content.

There you have it! This is a module that can be linked into the Linux kernel at runtime and alters its operation (actually does nothing). Let's understand a few things:

- Every module should have an initialization and exit function, these functions can have any name, but must be informed to the kernel by the `module_init()` and `module_exit()` macros.

!!! info "kernel doc"
    `__initcall()/module_init() include/linux/init.h`

    Many parts of the kernel are well served as a module (dynamically-loadable parts of the kernel). Using the `module_init()` and `module_exit()` macros it is easy to write code without `#ifdefs` which can operate both as a module or built into the kernel.

    The `module_init()` macro defines which function is to be called at module insertion time (if the file is compiled as a module), or at boot time: if the file is not compiled as a module the `module_init()` macro becomes equivalent to `__initcall()`, which through linker magic ensures that the function is called on boot.

    The function can return a negative error number to cause module loading to fail (unfortunately, this has no effect if the module is compiled into the kernel). This function is called in user context with interrupts enabled, so it can sleep. 

    > ref: https://www.kernel.org/doc/htmldocs/kernel-hacking/routines-init-again.html

- `printk`: It is one of the most well-known functions in the Linux kernel, used to create logs and track bugs. The output of this print is not on the terminal like printf, but in `dmesg`.

!!! info "kernel doc"
    For more information, visit: 
    
    - https://www.kernel.org/doc/html/latest/core-api/printk-basics.html

Now we need to compile this module into a `.ko`, to do this we will use this `Makefile`:

```make
// Makefile
obj-m += simple.o

all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
```

!!! exercise
    Create a `Makefile` with the previous content.

### Compiling and Testing

Now you can compile the module with the `make` command, once done, the `simple.ko` file should have been generated in the project folder. This file is the compiled module and we will link into the Linux kernel with `insmd`.

!!! exercise 
    1. Compile with: `make`
    2. Insert in kernel: `sudo insmod simple.ko`
    
This will make the module part of the kernel, to verify if it worked we can list the running modules with the `lsmod` command:

```bash
$ lsmod | grep simple
```

To access the log (HELLO message), just access `dmesg`:

```bash
$ dmesg | tail
```

To remove the module we use the `rmmod` command:

```bash
$ sudo rmmod simple
```

Then we should see the Goodbye message in `dmesg`:

```bash
$ dmesg | tail
```

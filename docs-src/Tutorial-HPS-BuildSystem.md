# Configuring Infrastructure

We will install the tools (compilers) that will be used to compile the kernel and the filesystem. We will need to install `soceds` and `linaro-gcc`.

## Intel SOCEDS

For this step, we will need the `Intel® SoC FPGA Embedded Development Suite Standard Edition Software Version 18.1 for Linux`, which can be downloaded from:

- https://www.intel.com/content/www/us/en/software-kit/665456/intel-soc-fpga-embedded-development-suite-standard-edition-software-version-18-1-for-linux.html

!!! info 
    We will use an older version of Quartus. The latest version is 21.1, but we will work with version 18.01. The reason for this is compatibility with the examples provided by the manufacturer.

!!! exercise "Install SOCEDS"
    1. Download the SocEDS
    1. Install:
        ```
        chmod +x SoCEDSSetup-18.1.0.625-linux.run 
        ./SoCEDSSetup-18.1.0.625-linux.run
        ```
    1. Test: 
        ```
        ~/intelFPGA/18.1/embedded/embedded_command_shell.sh 
        ```

!!! warning "DS-5 install not detected..."     
    If DS-5 was not detected, you should follow the next step:
    
    - Install DS-5 manually:
    
    ```bash
    cd ~/intelFPGA/18.1/embedded/ds-5_installer/
    ./install.sh
    ```
    
    - Accept the terms and also the item about the verification of requirements.
    - When defining the installation location, you should select `~/intelFPGA/18.1/embedded/ds-5/`
    This will create the folder and install there.
    - Proceed to the end of the installation.

    Test again:
    ```
        ~/intelFPGA/18.1/embedded/embedded_command_shell.sh 
    ```    

We will need to insert into the bash path a reference for a series of softwares to be used. Modify your `.bashrc` by inserting: 

``` bash
export ALTERAPATH=~/intelFPGA/18.1/

export PATH=$PATH:${ALTERAPATH}/embedded/
export PATH=$PATH:${ALTERAPATH}/embedded/host_tools/altera/preloadergen/

export SOCEDS_DEST_ROOT=${ALTERAPATH}/embedded
export SOCEDS_HWLIB=${ALTERAPATH}/embedded/ip/altera/hps/altera_hps/hwlib/
```

!!! note
    - Remember to verify if the **ALTERAPATH** in this example is the correct path for the Quartus installation.
    - If you are using another bash (zsh/ fish) you will need to edit the corresponding configuration file.
    
## GCC toolchain

We will use the GCC cross compile provided by Linaro. This same GCC will be used to compile the Kernel, generate the file system, and compile the programs that will run on Linux. 

!!! note "Linaro Wikipedia"
    *Linaro is an engineering organization that works on free and open-source software such as the Linux kernel, the GNU Compiler Collection, power management, graphics and multimedia interfaces for the ARM family of instruction sets and implementations thereof as well as for the Heterogeneous System Architecture.*

    - https://en.wikipedia.org/wiki/Linaro

!!! note "gcc"
    On the Linaro website, there are several different `GCC` each with a different configuration. What we are going to use is `arm-linux-gnueabihf` which means:
    
    - `linux`: to compile programs that will run on linux (could be baremetal)
    - `eabi`: [Embedded Application Binary Interface](https://processors.wiki.ti.com/index.php/EABI) to be used by the operating system.
    - `hf`: uses hardware floating-point multiplication

From the [Linaro binaries site](https://releases.linaro.org/components/toolchain/binaries/7.4-2019.02/arm-linux-gnueabihf/) download the `gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf.tar.xz` version and extract it to some folder on your Linux.

!!! note "Want to download via terminal?"
     My projects are all within the folder: `/home/corsi/work/`, so I extracted there. You can choose another location.
     
    ``` bash
    $ cd ~/work
    $ tar xvf gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf.tar.xz
    ```

Take a look at the recently extracted folder: 

```
$ cd gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf 
$ tree -L 1
...
+ arm-linux-gnueabihf
+ bin
 + arm-linux-gnueabihf-addr2line
 + arm-linux-gnueabihf-ar
 + ...
 + arm-linux-gnueabihf-c++
 + arm-linux-gnueabihf-g++
 + arm-linux-gnueabihf-gcc
+ include
+ lib
+ libexec
+ share
```

We have all the necessary tools to compile and link C and C++ codes for ARM. Note that in the gcc path we have the prefix: **gnueabihf**. 

!!! exericse short "Research"
    What is the difference between `eabi` and `hf`

### Creating a shortcut in bash

Let's create a shortcut to this folder in bash. Edit the `~/.bashrc` file to include the `~/work/gcc-linaro.../bin/` folder in the system variable: **GCC_Linaro**.

```diff
+ # GCC Linaro on path
+ export GCC_Linaro=/home/corsi/work/gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf/bin
+ export PATH=$PATH:${GCC_Linaro}
```

!!! note
    Edit the command to the correct folder where Linaro was extracted: `/home/...`

Now we have a shortcut to the `gcc-arm`, let's test:

```bash
$ $GCC_Linaro/arm-linux-gnueabihf-gcc -v
...
Using built-in specs.
COLLECT_GCC=/home/corsi/work/gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc
COLLECT_LTO_WRAPPER=/home/corsi/work/gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf/bin/../libexec/gcc/arm-linux-gnueabihf/7.4.1/lto-wrapper
```

And it should also be on the path, as `arm-linux-*`:

![](figs/Tutorial-HLS-BuildSystem-armgcc.png)

!!! note
    It's possible to install `arm-linux` via `apt install`, but we won't do that because we want to have control over the version of the compiler we are using.

!!! note "bashrc at the end"
     I don't modify my `bashrc`. What I do is use the program [direnv](https://direnv.net/) which allows me to control my settings according to the project I am working on. This includes environment variables and Python virtual environments.
     
     To use this program, first you must install it via the package manager (`apt install direnv`) and then create a `.direnv` file in the root of the folder where you intend to work (project submissions, labs, ...) with the environment configuration:
     
     ```
     echo "INTEL FPGA QUARTUS 18.1"
  
     export ARCH=arm
     export ALTERAPATH=/home/corsi/opt/intelFPGA/18.1
     export PATH=$PATH:${ALTERAPATH}/embedded/
     export PATH=$PATH:${ALTERAPATH}/embedded/host_tools/altera/preloadergen/

     
     export SOCEDS_DEST_ROOT=${ALTERAPATH}/embedded
     export SOCEDS_HWLIB=${ALTERAPATH}/embedded/ip/altera/hps/altera_hps/hwlib/

     export GCC_Linaro=/home/corsi/work/gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf/bin
     export PATH=$PATH:${GCC_Linaro}
     ```
     
     Upon entering the repository, the configuration is automatic. A great advantage of this is that programs like VSCODE, EMACS recognize the .direnv and use the configuration automatically.

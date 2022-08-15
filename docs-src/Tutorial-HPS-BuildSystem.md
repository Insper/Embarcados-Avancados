# Configurando infra

Vamos instalar o ferramental (compiladores) que será utilizado para compilar o kernel e o filesystem. Deveremos instalar o `soceds` e o `linaro-gcc` .

## Intel SOCDES

Para essa etapa iremos precisar do  `Intel® SoC FPGA Embedded Development Suite Standard Edition Software Version 18.1 for Linux`, o download pode ser feito em:

- https://www.intel.com/content/www/us/en/software-kit/665456/intel-soc-fpga-embedded-development-suite-standard-edition-software-version-18-1-for-linux.html

!!! info 
    Iremos usar uma versão antiga do Quartus, a versãomais atual é a 21.1, mas iremos trabalhar com a 18.01, o motivo disso é compatibilidade com os exemplos fornecidos pelo fabricante.

!!! note "Task"
    - Fazer o download do SocEDS
    - Instalar:
    
        ```
        chmod +x SoCEDSSetup-18.1.0.625-linux.run 
        ./SoCEDSSetup-18.1.0.625-linux.run
        ```
    - Testar: 
    
        ```
        ~/intelFPGA/18.1/embedded/embedded_command_shell.sh 
        ```

Vamos precisar inserir no path do bash referência para uma série de softwares a serem usados, modifique seu `.bashrc` inserindo: 

``` bash
export ALTERAPATH=~/intelFPGA/18.1/

export PATH=$PATH:${ALTERAPATH}/embedded/
export PATH=$PATH:${ALTERAPATH}/embedded/host_tools/altera/preloadergen/

export SOCEDS_DEST_ROOT=${ALTERAPATH}/embedded
export SOCEDS_HWLIB=${ALTERAPATH}/embedded/ip/altera/hps/altera_hps/hwlib/
```

!!! note
    Lembre de verificar se o **ALTERAPATH** desse exemplo é o caminho correto da instalação do Quartus

!!! warning "outros bashs"
    Se estiver usando outro bash (zsh/ fish) será necessário editar o arquivo de configuração referente.
    
# GCC toolchain

Iremos utilizar o GCC cross compile fornecido pelo Linaro, esse mesmo GCC será utilizado para compilar o Kernel, gerar o file system e compilar os programas que executarão no Linux. 

!!! note "Wikipidia Linaro"
    *Linaro is an engineering organization that works on free and open-source software such as the Linux kernel, the GNU Compiler Collection, power management, graphics and multimedia interfaces for the ARM family of instruction sets and implementations thereof as well as for the Heterogeneous System Architecture.*

    - https://en.wikipedia.org/wiki/Linaro

!!! note "gcc"
    No site do linaro existem vários `GCC` diferentes, cada um com uma configuração diferente. O que vamos usar é `arm-linux-gnueabihf` isso significa:
    
    - `linux`: para compilar programas que executarão no linux (poderia ser baremetal)
    - `eabi`: [Embedded Application Binary Interface](https://processors.wiki.ti.com/index.php/EABI) para ser usado pelo sistema operacional.
    - `hf`: usa multiplicação de ponto flutuante de hardware
    

Do site de [binários do Linaro](https://releases.linaro.org/components/toolchain/binaries/latest-7/arm-linux-gnueabihf/) abaixe a versão `gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf.tar.xz` e extraía para alguma pasta no seu Linux.

!!! note "Quer baixar via terminal?"
     Meus projetos ficam todos dentro da pasta: `/home/corsi/work/`, por isso eu extraí para lá. Você pode escolher outro local.
     
    ``` bash
    $ cd ~/work
    $ wget https://releases.linaro.org/components/toolchain/binaries/latest-7/arm-linux-gnueabihf/gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf.tar.xz
    $ tar xvf gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf.tar.xz
    ```

De uma olhada na pasta recém extraída: 

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

Temos todas as ferramentas necessárias para compilar e linkar códigos em C e C++ para o ARM.

Note que no path do gcc temos o prefixo : **gnueabihf**. 

!!! example "Pesquisa"
    Qual a diferença entre `eabi` e `hf`

### Criando um atalho no bash

Vamos criar um atalho para essa pasta no bash. Edite o arquivo `~/.bashrc` para incluir a pasta `~/work/gcc-linaro.../bin/` na variável do sistema: **GCC_Linaro**.

```diff
+ # GCC Linaro on path
+ export GCC_Linaro=/home/corsi/work/gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf/bin
+ export PATH=$PATH:${GCC_Linaro}
```

!!! note
    Edite o comando para a pasta correta de onde Linaro foi extraído: `/home/...`

Agora temos um atalho para o `gcc-arm`, vamos testar :

```bash
$ $GCC_Linaro/arm-linux-gnueabihf-gcc -v
...
Using built-in specs.
COLLECT_GCC=/home/corsi/work/gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc
COLLECT_LTO_WRAPPER=/home/corsi/work/gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf/bin/../libexec/gcc/arm-linux-gnueabihf/7.4.1/lto-wrapper
```

E ele também deve estar no path, como `arm-linux-*`:

![](figs/Tutorial-HLS-BuildSystem-armgcc.png)

!!! note
    É possível instalar o `arm-linux` via `apt install`, mas não vamos fazer isso pois queremos ter controle da versão do compilador que estamos utilizando.

!!! note "bashrc ao final"
     Eu não modifico meu `bashrc`, o que eu faço é usar o programa [direnv](https://direnv.net/) que possibilita eu controlar as minhas configurações de conforme o projeto que eu estou trabalhado, e isso inclui as variáveis de ambiente e ambientes virtuais do python.
     
     Para usar esse programa, primeiro você deve instalar via gerenciador de pacotes (`apt install direnv`) e depois criar um arquivo `.direnv` na raiz da pasta que você pretende trabalhar (entrega de projetos, labs, ...) com a configuracão do ambiente:
     
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
     
     Ao entrar no repositório a configuração é automática, uma grande vantagem disso é que programas como VSCODE, EMACS reconhecem o .direnv e fazem uso da configuração automaticamente.

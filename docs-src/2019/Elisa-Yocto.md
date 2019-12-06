# Elisa Malzoni - Yocto 

- Aluna: Elisa Monteiro
- Curso: Engenharia da Computação
- Semestre: 9
- Contato: 
- Link tutorial oficial: https://github.com/elisamalzoni/Embarcados-Avancados
- Ano: 2019

!!! example "Hardware utilizado no tutorial"
    - DE10-Standard
    - Raspberry 3

## O que é o Yocto Project

Projeto open source para criação de sistemas customizados baseados em Linux, para embarcados, independentemente da arquiterura do hardware.

### Layer Model

São repositórios que contém os conjuntos de instruções que são mandadas para o OpenEmbedded build system. Você pode modificar, compartilhar e reusar as *layers*.

Essas *layers* podem conter mudanças nas instruções ou configurações anteriores ou novas intruções e configurações.

Separar as camadas dependendo das suas informações pode aumentar a personalizaçãoe facilitar a reutilização das camadas. ex.: camadas de BSP, GUI, configuração da distro, middleware ou até a camada da aplicação.

*Layers* geralmente tem nomes que começam com `meta-`.

### BitBake

Derivado do OpenEmbedded build system, é utilizado para gerar as imagens.

### Poky

É a distribuição referência do Yocto e será também utilizada na demonstração.
Já vem com um conjunto de metadados, para começar a contrução da sua própria distro.

Poky é a combinação dos repositórios do BitBake, OpenEmbedded-Core (dentro do `meta`), `meta-poky`, `meta-yocto-bsp`, também a documentação.

![poky-reference-distribution.png](imgs/Elisa/poky-reference-distribution.png)

* **BitBake** agenda e executa as tarefas. Principal componente do OpenEmbedded build system.


* **`meta-poky`** metadados específicos do poky.


* **`meta-yocto-bsp`** Board Support Packages (BSPs).

* **OpenEmbedded-Core (OE-Core) metadata** metadados de configurações compartilhadas, definição de variáveis globais, classes compartilhadas, pacotes, e *recipes*. Classes definem o encapsulamento e as heranças da lógica de build. *Recipes* são as unidades lógicas de software e de imagens para buildar.

* **Documentação** contém o código fonte utilizado para gerar os manuais de usuário do Yocto Project.

Uma *Recipe* é uma coleção de metadados não executáveis usada pelo BitBake para definir varáveis ou tarefas no tempo de build.

Uma *Recipe* pode conter:

* Descrição da recipe
* versão
* licença do pacote
* repositório de origem 
* indicar os processos de build
* adição de tarefas ou prerequisitos das tarefas 


### Buildroot vs Yocto
Tanto Yocto quanto Buildroot no final terão:

* root filesystem, para seu sitema embarcado
* kernel
* bootloader
* e uma toolchain compatível

O buildroot foca em simplicidade. Seu núcleo é mantido o quão simples e pequeno for possível, fazendo com que seja fácil seu uso e compreensão. Enquanto o Yocto tenta ser versátil e suporta uma grande variedade de sistemas embarcados.

O Buildroot gera somente a imagem do sistema de arquivos. Assim quando um sistema precisar se atualizado a imagem inteira deve ser gerada novamente.
Já a saída do Yocto é uma distribuição, onde pode exitir um sistema de gerenciamento de pacotes no qual pacotes podem ser atualizados individualmente, ou até mesmo serem removidas.

No Yocto é mais fácil gerar alterações com mequenas mudanças e sua escalabilidade também é maior. Enquanto o Buildroot tenta se manter simples a curva de aprendizado do Yocto é um pouco mais desafiadora e sua terminologia é masi complicada.

O conjunto de pacotes suportados pelo Buildroot é menor. Também não possui mecanismo para detectar mudanças entre builds.


## Compilando uma iso

!!! warning 
    Mesmo seguindo os tutoriais do Yocto e guias da altera, não consegui compilar para a placa usada no curso, assim utilizarei um Raspberry Pi 3 Model B.

### Links uteis 

[Reference Manual](https://www.yoctoproject.org/docs/3.0.1/ref-manual/ref-manual.html)

[Yocto Overview manual](https://www.yoctoproject.org/docs/3.0.1/overview-manual/overview-manual.html)

[Deciding between Buildroot & Yocto](https://lwn.net/Articles/682540/) 

[Yocto e Raspberry Pi 3](https://www.embarcados.com.br/linux-para-a-raspberry-pi-3-usando-yocto/)


### Preparação do host

Você deve ter:

* 20 gbytes livres no disco
* Usar uma das versões recentes dos seguintes sistemas: Fedora, openSUSE, CentOS, Debian ou Ubuntu
* git 1.8.3.1 ou maior
* tar 1.27 ou maior
* python 3.4 ou maior

Para instalar os pacotes essenciais no host rode o comando abaixo, se você usar uma distribuição ubuntu.
```
$ sudo apt-get install gawk wget git-core diffstat unzip texinfo gcc-multilib build-essential chrpath socat libsdl1.2-dev xterm
```
Clone o Yocto
```
$ git clone -b thud http://git.yoctoproject.org/git/poky yocto
$ git clone -b thud git://git.openembedded.org/meta-openembedded yocto/meta-openembedded
```
Clone a *layer* do Angstrom
```
$ git clone -b angstrom-v2018.12-thud git://github.com/Angstrom-distribution/meta-angstrom.git yocto/meta-angstrom
```
Clone a *layer* do Raspberry Pi
```
$ git clone -b thud git://git.yoctoproject.org/meta-raspberrypi yocto/meta-raspberrypi
```
Clone a *layer* do Qt 5
```
$ git clone -b thud https://github.com/meta-qt5/meta-qt5.git yocto/meta-qt5
```
Iniciando o sistema de desenvolvimento. Isso precisa ser feito sempre que abrir um novo terminal
```
$ cd yocto
$ source oe-init-build-env
```
Precisamos agora incluir as *layers* clonadas acima. Modifique o arquivo `/yocto/build/conf/bblayers.conf` para isso:

```config
# POKY_BBLAYERS_CONF_VERSION is increased each time build/conf/bblayers.conf
# changes incompatibly
POKY_BBLAYERS_CONF_VERSION = "2"
 
BBPATH = "${TOPDIR}"
BBFILES ?= ""
 
BBLAYERS ?= " \
  ${TOPDIR}/../meta \
  ${TOPDIR}/../meta-angstrom \
  ${TOPDIR}/../meta-poky \
  ${TOPDIR}/../meta-yocto-bsp \
  ${TOPDIR}/../meta-raspberrypi \
  ${TOPDIR}/../meta-qt5 \
  ${TOPDIR}/../meta-openembedded/meta-multimedia \
  ${TOPDIR}/../meta-openembedded/meta-networking \
  ${TOPDIR}/../meta-openembedded/meta-oe \
  ${TOPDIR}/../meta-openembedded/meta-python \
  ${TOPDIR}/../meta-openembedded/meta-webserver \
  "
```

No arquivo `yocto/build/conf/local.conf`
adicione as seguintes linhas:
```
MACHINE ??= "raspberrypi3"
DISTRO ?= "angstrom"
RPI_USE_U_BOOT = "1"
```
## Compilando
```
$ bitbake core-image-base
```
Você deverá ter a seguinte saída:
```
Build Configuration:
BB_VERSION           = "1.40.0"
BUILD_SYS            = "x86_64-linux"
NATIVELSBSTRING      = "ubuntu-18.04"
TARGET_SYS           = "arm-angstrom-linux-gnueabi"
MACHINE              = "raspberrypi3"
DISTRO               = "angstrom"
DISTRO_VERSION       = "v2018.12"
TUNE_FEATURES        = "arm armv7a vfp thumb neon callconvention-hard"
TARGET_FPU           = "hard"
meta                 = "thud:8cd3ee6e1a50ad9f40466bcadb236c619c42ef19"
meta-angstrom        = "angstrom-v2018.12-thud:fdf4ca41ba6d455a906465a4d2f0d71dbb70224c"
meta-poky            
meta-yocto-bsp       = "thud:8cd3ee6e1a50ad9f40466bcadb236c619c42ef19"
meta-raspberrypi     = "thud:4e5be97d75668804694412f9b86e9291edb38b9d"
meta-qt5             = "thud:1520d5b2b2beec5e1c3209d3178219e93ef08bca"
meta-multimedia      
meta-networking      
meta-oe              
meta-python          
meta-webserver       = "thud:446bd615fd7cb9bc7a159fe5c2019ed08d1a7a93"

```

Depois de compilado procure um desses arquivos e transfira a imagem para o arquivo. Eu utilizei o etcher para isso.


```
/yocto/build/tmp-glibc/deploy/images/raspberrypi3/Angstrom-core-image-base-glibc-ipk-v2018.12-raspberrypi3.rootfs.rpi-sdimg
```

```
/yocto/deploy/images/raspberrypi3/Angstrom-core-image-base-glibc-ipk-v2018.12-raspberrypi3.rootfs.rpi-sdimg
```


![booting.png](imgs/Elisa/booting.png)
![login.png](imgs/Elisa/login.png)


## Até onde cheguei com a cyclone5?

Clone o repositório do Poky

```
$ git clone git://git.yoctoproject.org/poky
```

### Criação da Imagem

Primeiro precisamos inicializar o ambiente de desenvolvimento:

```
$ cd poky
$ source oe-init-build-env
```
Clone a layer da altera da seguinte maneira:
```
$ cd poky
$ git clone https://github.com/kraj/meta-altera.git
```

Mude a variável `MACHINE` para "cyclone5" no arquivo de configuração `local.conf`

Adicione uma *layer* ao arquivo de configuração de layers:
```
$ cd ~/poky/build
$ bitbake-layers add-layer ../meta-altera
```
Mas nao consegui nem compilar usando BitBake.


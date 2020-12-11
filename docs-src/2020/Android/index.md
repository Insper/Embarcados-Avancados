# Android para Raspbery Pi 3 

- **Alunes:** Emanuelle Moço / Leonardo Mendes / Lucas Leal
- **Curso:** Engenharia da Computação
- **Semestre:** 6
- **Contato:** corsiferrao@gmail.com, emanuellesm@al.insper.edu.br, leonardomm4@al.insper.edu.br, lucaslv1@al.insper.edu.br
- **Ano:** 2020

## Começando

Para seguir esse tutorial é necessário:

- **Hardware** 
    - Raspberry Pi 3 
    - Micro SD Card de 8 GB ou maior
    - Monitor com entrada   
    - Mouse 
    - Adaptador Micro SD para USB 
    - Cabo Micro USB
    - Computador com pelo menos 150GB de armazenamento disponível   
- **Softwares** 
    - Ubuntu 18.04
- **Referências:** [device_brcm_rpi3](https://github.com/android-rpi/device_brcm_rpi3), [Build Android for Raspberry Pi3](https://github.com/tab-pi/platform_manifest), [Building Android for Raspberry Pi](https://github.com/csimmonds/a4rpi-local-manifest/)
    

## Motivação  
A motivação inicial era compilar Android em uma FPGA e o tema foi escolhido pois o grupo tinha o desejo de compilar um software de alto nível em uma placa de desenvolvimento. Entretanto, por dificuldades técnicas, foi decidido migrar para uma Raspberry Pi, que por ser mais barata e acessível ao público, existe uma quantidade significativa de referências, viabilizando a criação de aplicações.


----------------------------------------------
## Contexto 

O sistema operacional Android é extremamente popular e muito presente em dispositivos mobile, presente em cerca de 70% de celulares no mundo. Este tutorial consiste em embarcar o Android utilizando LineageOS, uma distribuição open source de Android, numa Raspberry Pi 3 B+. 


### Android

Android é um sistema operacional baseado no kernel do linux no qual é possível compilar o seu próprio sistema para utilizar em um celular ou placas de desenvolvimento.  


### Raspberry Pi 

Raspberry Pi é um _microcomputador_ do estilo _System On a Chip_ que permite fazer tudo que um computador faz com baixo custo.
O modelo utilizado neste roteiro é o Raspberry Pi 3 B+, a qual possui um processador 64-bit quad-core de 1.4GHz, dual-band wireless e bluetooth. Ou seja, adequada para aplicações de automação e IOT.

<center>![Raspberry PI3](https://uploads.filipeflop.com/2017/07/DRA01_01.jpg){width=300}</center>


----------------------------------------------

## Instalação

!!! warning
    Alguns dos passos exigem alto poder computacional, caso você não tenha uma máquina com o armazenamento mínimo necessário ou com um bom processador, sugerimos a utilização de uma máquina na nuvem.
    
    !!! example "Sugestão"
        Para esse tutorial, utilizamos uma instância da AWS t2.2xlarge.


### Configurando o ambiente
Uma vez no Ubuntu 18.04, será necessário a instalação de alguns pacotes essênciais, para saber mais, entre na página disponibilizada pelo [Andoid](https://source.android.com/setup/build/initializing).
```sh
$ sudo apt-get install git-core gnupg flex bison build-essential zip curl zlib1g-dev gcc-multilib g++-multilib libc6-dev-i386 lib32ncurses5-dev x11proto-core-dev libx11-dev lib32z1-dev libgl1-mesa-dev libxml2-utils xsltproc unzip fontconfig openjdk-8-jdk gcc-arm-linux-gnueabihf libssl-dev python-mako
```
Instale também o [repo](https://source.android.com/setup/develop#installing-repo) e rode o comando:
```
$ repo init --depth=1 -u https://android.googlesource.com/platform/manifest -b android-10.0.0_r25
```

Clone o repositório com as configurações da Raspberry para Android:

```
$ git clone https://github.com/csimmonds/a4rpi-local-manifest .repo/local_manifests -b android10
```

!!! Tip

     Para aumentar a velocidade de instalação use o argumento -c (branch atual) e -j```threadcount``` 
```
$ repo sync -c j8
```

!!! warning
    Pausa para café, esta etapa demora cerca de 1-      2 horas.

### Configurando o U-boot

U-boot é um bootloader Opens Source utilizado em sistemas de linux embarcados. Os comandos abaixo criam a nossa imagem _boot_ que será utilizada para carregar o Android.
```
$ cd $ANDROID_BUILD_TOP/u-boot
$ PATH=$HOME/gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf/bin:$PATH
$ export ARCH=arm
$ export CROSS_COMPILE=arm-linux-gnueabihf-
$ cp $ANDROID_BUILD_TOP/device/rpiorg/rpi3/u-boot/rpi_3_32b_android_defconfig configs
$ make rpi_3_32b_android_defconfig
$ make

```

### Compilando o kernel

É necessário compilar o Kernel que será responsável pela criação do Android. Também é criada a partição DTBS, _device tree blob source_, que é responsável por disponibilizar a estrutura do hardware. Como Android pode ser utilizado em dispositivos diferentes, Device Tree Overlays (DTOs) são necessários para mapear o hardware para o sistema.  


Rode os comandos: 
``` 
$ PATH=$HOME/gcc-linaro-7.4.1-2019.02-x86_64_arm-linux-gnueabihf/bin:$PATH
$ export ARCH=arm
$ export CROSS_COMPILE=arm-linux-gnueabihf-
$ cd $ANDROID_BUILD_TOP/kernel/rpi
$ scripts/kconfig/merge_config.sh arch/arm/configs/bcm2709_defconfig \
kernel/configs/android-base.config kernel/configs/android-recommended.config
$ make -j $(nproc) zImage
$ cp arch/arm/boot/zImage $ANDROID_BUILD_TOP/device/rpiorg/rpi3
$ make dtbs
$ croot
```

### Compilando o Android

Com as imagens criadas anteriormente (zImage, boot e dtbs), agora temos tudo pronto para compilar o Android em si. Para isso, é necessário configurar as variáveis de ambiente e fazer a montagem.  

```
$ source build/envsetup.sh
$ lunch aosp_rpi3-eng
$ m
```

!!! warning
    Esta etapa pode demorar em torno de 2 horas.

A explicação dos comandos utilizadas pode ser encontrada [aqui](https://source.android.com/setup/build/building).   
É criado as imagens _VendorImage_, _SystemImage_ e _UserData_ que posteriormente serão escritas no cartão de memória. 


### SD Card 

A última etapa é  criar as partições e passar as imagens criadas no passo anterior para partições no SD card, que são elas:

- Vendor:  Drivers que conectam hardware e software;
- System: Sistema Android;
- UserData: Usado para resetar as configurações;
- Boot: Arquivos de inicialização, como os DTOs e configurações do Uboot.



!!! warning
    Caso você tenha feito as etapas anteriores em uma instância virtual, siga os passos abaixo, caso contrário, siga para a etapa **_Instalando Android localmente_**.


### Instalando Android na nuvem 

Como não é possível conectar um cartão SD diretamente em uma instância na nuvem, deve ser criado uma partição virtual para simular um cartão SD.     
Primeiro, é necessário criar uma imagem vazia com o tamanho disponível do seu cartão SD.

```sh
$ dd if=/dev/zero of=zero.img bs=4M count=1536
```

Com isso, criaremos a partição virtual a partir dessa imagem:   

```sh
$ sudo losetup -P -f --show zero.img
```
Ao término do comando, a sua saída será o nome da sua partição virtual. No nosso caso, obtivemos **_loop6_**.  

Dentro da pasta do Android, modifique o arquivo /scripts/write-sdcard-rpi3.sh, alterando **_mmcblk0_** para o nome da sua partição virtual.

```bash
...

# Unmount any partitions that have been automounted
if [ $DRIVE == "loop6" ]; then
        sudo umount /dev/${DRIVE}*
        BOOT_PART=/dev/${DRIVE}p1
        SYSTEM_PART=/dev/${DRIVE}p3
        VENDOR_PART=/dev/${DRIVE}p4
        USER_PART=/dev/${DRIVE}p5
else
        sudo umount /dev/${DRIVE}[1-9]
        BOOT_PART=/dev/${DRIVE}1
        SYSTEM_PART=/dev/${DRIVE}3
        VENDOR_PART=/dev/${DRIVE}4
        USER_PART=/dev/${DRIVE}5
fi

...
```


Faça um _dd_ para transformar o Android instalado na partição virtual em uma imagem. 
```sh
$ dd if=/dev/loop6 of=android.img bs=4M
```


!!! Tip
    Mais uma vez, troque **_loop6_** pelo nome de sua partição virtual.

Existem várias maneiras para transferir arquivos de uma instância virtual para outra máquina, indicamos utilizar Secure Copy Protocol (SCP).  
Na sua máquina, de posse da key utilizada na instância, basta rodar o comando abaixo:


```sh
$ scp -i <chave_de_acesso> ubuntu@<ip_maquina>:/home/ubuntu/android.img .

```

!!! Tip
    Note que _/home/ubuntu/android.img_ é o nosso _path_ da imagem criada pelo _dd_, mude para o seu _path_ correspondente.

!!! warning
    Essa etapa pode demorar em torno de 10 minutos dependendo da sua conexão.


O último passo é transferir o arquivo _android.img_, que foi copiado para a sua máquina, para o SD card. Para isso, insira o cartão de memória e utilize o comando _lsblk_  para saber o nome do seu dispositivo e rode:

```sh
$ dd if=android.img of=/dev/<nome_SDcard> bs=4M
```


### Instalando Android localmente

!!! Nota
    Este tópico só deve ser realizado se você está fazendo localmente. 

Insira o SD Card no seu computador e use comando _lsblk_ para saber o nome do dispositivo. 
No exemplo abaixo, o nome do dispositivo é _sdc_.

<center>![](https://media.discordapp.net/attachments/727592935054639194/786344627417382912/unknown.png){width=500}</center>


Agora, para instalar o Android no SD Card é necessário rodar o comando na pasta _root_ do projeto:
```sh 
$ scripts/write-sdcard-rpi3.sh <nome_SDcard>
```

----------------------------------------------


## Rodando Android na Raspberry
Ao inserir o SD Card na Raspberry e conectá-la à uma fonte de energia via cabo Micro USB, se tudo foi feito corretamente, o Android deve inicializar, podendo ser observado ao conectar uma da saída de vídeo (HDMI), como visto abaixo:


<center>![](https://media.discordapp.net/attachments/727592935054639194/786364456643985440/IMG_5310.jpg?width=625&height=469){width=600}   
![](https://media.discordapp.net/attachments/727592935054639194/786364450633678888/IMG_5312.jpg?width=625&height=469){width=600}   
![](https://media.discordapp.net/attachments/727592935054639194/786364441004474378/IMG_5313.jpg?width=625&height=469){width=600} </center>

Pronto! Você tem um Andoid rodando em uma Raspberry Pi. Para utilização completa dos recursos disponibilizados pelo Android, o usuário pode optar por utilizar um mouse com entrada USB ou até mesmo uma tela touch, ambos conectados diretamente na Raspberry. 


---

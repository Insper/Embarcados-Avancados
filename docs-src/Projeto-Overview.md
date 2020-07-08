# Overview

O projeto final da disciplina deve ser um tutorial que tenha relação com ao menos um objetivo de aprendizagem da matéria:

- Formular soluções que satisfazem requisitos de hardware e software de projetos com FPGA-SoC (System-on-a-chip)
- Integrar em um protótipo solução para um sistema embarcado com requisitos de processamento e/ou tempo real via FPGA-SoC
- Interfacear diferentes módulos em um sistema embarcado (processadores, firmware e sistema operacional)

## Áreas

Alguns exemplos de áreas que podem ser exploradas:

1. Aceleração/ implementação de algum algorítimo em hardware
    - processamento de dados, FFT, compressão, criptografia, ...
    - HLD/ HLS/ OpenCL/ FPGA Amazon
1. Comparação de performance entre diferentes tecnologias  
    - SoC vs GPU vs FPGA vs uC
1. Sistema operacional 
    - Escalonador real time kernel linux, Android, RTOS embarcado

## Tecnologias/ Ferramentas

A seguir uma lista de tecnologias que podem ser estudadas no tutorial: 

- HDL (VHDL/Verilog)
  - [Adicionar uma instrução customizada ao NIOS](https://www.intel.com/content/dam/www/programmable/us/en/pdfs/literature/ug/ug_nios2_custom_instruction.pdf)
  - Platform designer 
     - Criar um sistema para controlar um dos robôs de robótica 
  - Criar um periférico para interfacear com o mundo externo (ler teclado/ motor/ fita de Led/ ...)
- [High Level Synthesis (HLS)](https://www.intel.com/content/www/us/en/software/programmable/quartus-prime/hls-compiler.html)
  - Criar um periférico que acelera uma função ([example](https://www.intel.com/content/dam/www/programmable/us/en/pdfs/literature/wp/wp-01274-intel-hls-compiler-fast-design-coding-and-hardware.pdf))
-  [OpenCL](https://www.intel.com/content/www/us/en/software/programmable/sdk-for-opencl/overview.html)
  - Criar um hardware que acelera uma função [Terasic Manual](https://github.com/Insper/DE10-Standard-v.1.3.0-SystemCD/blob/master/Manual/DE10_Standard_OpenCL.pdf) ([example](https://www.intel.com/content/www/us/en/programmable/products/design-software/embedded-software-developers/opencl/support.html))
- Linux 
  - [real time](https://www.linuxfoundation.org/blog/2013/03/intro-to-real-time-linux-for-embedded-developers/) / otimização energética / 👍 [boot time](https://embexus.com/2017/05/16/embedded-linux-fast-boot-techniques/) / aplicações / 👍 [Android](https://www.youtube.com/watch?v=zHqS_yWiMNI) / openCL ....

## Hardwares 

A seguir, eu tentei resumir os hardwares disponíveis no Insper e as respectivas tecnologias que podem ser utilizados para desenvolver os projetos:

| Kit           | Empresa | Tecnologia | vhdl | HLS | OpenCL | Linux | OpenCV | Cuda |
|---------------|---------|------------|------------|-----|--------|-------|--------|------|
| [Arria 10 SoC](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&CategoryNo=216&No=997) | Intel   | FPGA + ARM | x          | x   | x      | x     | x      |      |
| [DE10-Standard](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&No=1081) | Intel   | FPGA + ARM | x          | x   | x      | x     | x      |      |
| [DE10-nano-soc](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&No=941)     | Intel   | FPGA + ARM | x          | x   | x      | x     | x      |      |
| [Terasic SoC SoM](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&CategoryNo=167&No=1211)   | Intel   | FPGA + ARM | x          | x   | x      | x     | x      |      |
| [DE5a-NET-DDR4](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&CategoryNo=1&No=1108&PartNo=1) | Intel   | FPGA       | x          | x   | x      |       | x      |      |
| [ZedBoard](http://zedboard.org/product/zedboard)      | Xilinx  | FPGA + ARM | x          | x   | x      | x     | x      |      |
| [instância F1](https://aws.amazon.com/ec2/instance-types/f1/)  | AWS     | FPGA       |            |     | x      |       |        |      |
| [Jetson TK2](https://developer.nvidia.com/embedded/jetson-tx2)   | NVIDIa  | ARM + GPU  |            |     |        | x     | x      | x    |
|               |         |            |            |     |        |       |        |      |

## Exemplos de temas/ coisas legais

legenda: ‼ demanda uma dedicação maior
 
- Criando um SoftProcessor e API para controlar um Drone
- [OpenCV acelerado com OpenCL - ZedBoard](https://xilinx-wiki.atlassian.net/wiki/spaces/A/pages/18841665/HLS+Video+Library)
- !! Criar uma aplicação com HLS/OpenCL que acelera uma função na FPGA
    - Processamento de imagem/ compressão de dados/ criptografia/ fft/ ... 
- ‼ [Criar uma aplicação com OpenCL na AWS](https://github.com/aws/aws-fpga)
- [Embarcando ROS no SoC-FPGA](http://wiki.ros.org/hydro/Installation/OpenEmbedded) (primeiro passo para controlarmos os robôs de robótica com a FPGA)
- ‼ Usar o [LCD LT24](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&CategoryNo=68&No=892) com o Linux (Comunicação ARM-FPGA)
- [Real Time kernel](https://www.linuxfoundation.org/blog/2013/03/intro-to-real-time-linux-for-embedded-developers/) é realmente tempo real? Estudo de latência...
- Otimizando o [boot time](https://embexus.com/2017/05/16/embedded-linux-fast-boot-techniques/) do linux
- Executando [Android](https://www.youtube.com/watch?v=zHqS_yWiMNI) na DE10-Standard
- Interface gráficas em sistemas embarcados (exe: criar um totem de pagamento)
- Device driver: Criar um driver no linux [para algum sensor de distância](https://github.com/johannesthoma/linux-hc-sro4)
- ‼ Criar um periférico para controlar a fita de LED RGB e criar um driver para o Linux controlar
- BanchMark entre os diferentes kits de desenvolvimento 
- Usando o [yocto](https://www.yoctoproject.org/) como alternativa ao buildroot para gerar o Linux


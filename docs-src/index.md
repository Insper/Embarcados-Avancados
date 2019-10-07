# Bem vindo a Eletiva - Embarcados Avançados (SoC e Linux Embarcado)!

![](https://camo.githubusercontent.com/31cbef310a2a8d91eeccb737c5d968223a7d1575/68747470733a2f2f7777772e696e737065722e6564752e62722f77702d636f6e74656e742f7468656d65732f696e737065722f646973742f696d6167652f6c6f676f2e706e67)

- **Disciplina:** Eletiva da Engenharia da Computação [Insper](https://www.insper.edu.br/) - 2019-2.
- **Prof.** Rafael Corsi / rafael.corsi@insper.edu.br
- **Repositório:** [http:/github.com/insper/Embarcados-Avancados](http:/github.com/insper/Embarcados-Avancados)
- **Local:** Laboratório de Arquitetura de Computadores
- **© Todos os direitos reservados**

-------------------------

## OBJETIVOS:

1. Formular soluções que satisfazem requisitos de hardware e software de projetos com FPGA-SoC (System-on-a-chip) 
2. Integrar em um protótipo solução para um sistema embarcado com requisitos de processamento e/ou tempo real via FPGA-SoC
3. Interfacear diferentes módulos em um sistema embarcado (processadores, firmware e sistema operacional)

## Motivação

- O que é um [System On Chip (SoC)](https://en.wikipedia.org/wiki/System_on_a_chip)?
- Quem são os principal fabricantes de SoC?
    - [Samsung](https://en.wikipedia.org/wiki/List_of_Samsung_system-on-a-chips) / [Qualcomm](https://en.wikipedia.org/wiki/List_of_Qualcomm_Snapdragon_systems-on-chip#Qualcomm_205,_Snapdragon_208,_210_and_212_(2014-17)) / [Xilinx](https://www.xilinx.com/products/silicon-devices/soc.html) / [Intel FPGA](https://www.intel.com/content/www/us/en/products/programmable.html)
- Áreas / Aplicações:
    - [macbook pro](https://www.redsharknews.com/technology/item/6408-apple-s-mac-pro-afterburner-what-just-happened) / [aws f1](https://aws.amazon.com/ec2/instance-types/f1/) / [Intel 1](https://www.intel.com/content/www/us/en/products/programmable.html) / [Intel 2](http://www.innovatefpga.com) / [xilinx](https://www.xilinx.com/applications.html)
- Qual a diferença entre [Soft-Processor](https://www.intel.com/content/www/us/en/products/programmable/processor/nios-ii.html)
  e um HardProcessor?
- [x86 + FPGA ?](https://www.anandtech.com/show/12773/intel-shows-xeon-scalable-gold-6138p-with-integrated-fpga-shipping-to-vendors)
- Empregos? A qual desses você se aplicaria ?
    - [facebook](https://www.facebook.com/careers/jobs/283243269009556/) / [google](https://www.linkedin.com/jobs/google-fpga-jobs) / [apple](https://www.linkedin.com/jobs/apple-fpga-jobs) / [apple 2](https://jobs.apple.com/en-us/details/200001001/fpga-engineer) / [microsoft](https://www.linkedin.com/jobs/microsoft-fpga-jobs) / [amazon](https://www.linkedin.com/jobs/amazon-fpga-jobs)
- Como usar o hardware a serviço do software?
  [HLS](https://www.intel.com/content/www/us/en/software/programmable/quartus-prime/hls-compiler.html)
  /
  [OpenCL](https://www.intel.com/content/www/us/en/software/programmable/sdk-for-opencl/overview.html)
  
## Avaliação

A avaliação é composta de entregas ao longo do semestre (a cada série de
tutoriais existe uma entrega com nota) e de um tutorial que deve ser criado ao
longo da disciplina e integrado na wiki do curso. O tutorial é de tema livre
dentro dos objetivos da disciplina e possui algumas entregas intermediárias
que irão compor a nota final.

## Infraestrutura

Vamos precisar dos softwares listados
 [aqui](https://github.com/Insper/Embarcados-Avancados/wiki/FPGA-e-Softwares#softwares).
 Iremos ao longo do curso trabalhar com uma FPGA Intel, o kit é o
 [DE10-Standard](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&No=1081).
 
##  Dinâmica

A disciplina é baseada em uma série de tutoriais (com entregas ao final) que começa a partir de um simples hardware na FPGA para controlar LEDs da placa e chega até a execução de um sistema Linux com interface gráfica e co-processamento em um sistema embarcado.

## Bibliografia

- Básica

    - [HALLINAN, 2007] HALLINAN, C. Embedded Linux primer: a practical, real-world approach. Pearson Education India, 2007.
    - [DESCHAMPS, 2012] DESCHAMPS,  J. P.;  SUTTER, G. D.;  CANTÓ E. Guide to FPGA implementation of arithmetic functions. Springer Science & Business Media; 2012, Apr 5.
    - [CHU, 2011] CHU, PONG P. Embedded SoPC design with Nios II processor and VHDL examples. John Wiley & Sons, 2011.
    
- Complementar   

    - [SASS, 2010] SASS, R., SCHMIDT, A.G.; Embedded Systems Design with Platform FPGAs: Principles and Practices. Elsevier, 2010.
    - [BOVET, 2005] Bovet, Daniel P., and Marco Cesati. Understanding the Linux Kernel: from I/O ports to process management. " O'Reilly Media, Inc.", 2005.
    - [SIMPSON, 2015] Simpson, Philip Andrew; FPGA Design: Best Practices for Team-based Reuse 2nd ed. Springer, 2015 Edition.
    - [KOOPMAN, 2010] Koopman, Philip. Better Embedded System Software. Drumnadrochit Education, 2010.
    - [VENKATESWARAN, 2008] Venkateswaran, Sreekrishnan. Essential Linux device drivers. Prentice Hall Press, 2008.
 
## Para começar 

1. Trazer os softwares instalados
1. Criar um repositório no github
1. Pensar um pouco sobre um tema que gostaria de se aprofundar (para o tutorial)
    - :point_right: [Dicas](Projeto-Final)
1. Leitura recomendada:
    - https://www.intel.com/content/www/us/en/products/programmable/fpga/new-to-fpgas/resource-center/overview.html
    - Disponível no lab: [CHU, 2011, cap. 1], [KOOPMAN, 2010, cap. 2] 
1. :bangbang: Nunca mexeu com FPGA? 
     - [VHDL introdução vídeo](https://www.youtube.com/watch?v=zm-RA6BsYmc)
     - [livro fpgas for dummie](https://www.amiq.com/consulting/misc/free_pdf_books/fpgas_for_dummies_ebook.pdf)

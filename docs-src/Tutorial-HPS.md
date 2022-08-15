# Visão geral

A FPGA contida no kit DE10-Standard é um chip SoC que em um único dispositivo possui dois hardwares distintos: uma FPGA e um Hardware Process System (HPS). HPS é o termo utilizado pela Intel-Altera para definir a unidade de processamento, que no caso do nosso chip é um processador ARM A9 (pode ser outro ARM, depende da família da FPGA).
 
![](figs/Tutorial-HPS-SoC.png)

O HPS possui uma unidade de processamento com um ou dois Cores (depende do chip, no nosso caso é **dual core**) e alguns periféricos conectados em seu barramento (DMA, UART, USB, EMACS, ...). Além dos periféricos já contidos no HPS é possível conectarmos novos periféricos sintetizados na FPGA via a interface **HPS FPGA Interfaces**.


!!! exercise
    Dar uma olhada no documento oficial da Intel: [1 Introduction to Cyclone V Hard Processor System (HPS)](https://people.ece.cornell.edu/land/courses/ece5760/DE1_SOC/HPS_INTRO_54001.pdf)

## Família de FPGAs

A Altera possui quatro famílias de [FPGAs-SoC](https://www.intel.com/content/www/us/en/products/programmable/soc.html):

- Stratix 10 SoC: High end, 14nm com ARM-Cortex-A53 de 64bits quad-core
- Arria 10 SoC: 20nm, Cortex A9 duas core com grande capacidade na FPGA
    - Temos um kit no lab
- Arria V SoC: 28nm, Cortex A9 com foco em telecomunicações 
- **Cyclone V SoC**: Família low end com valor mais baixo e mais low power.

## Cortex A9

O Cortex A9 existente no HPS da Cyclone V possui as características a seguir (extraído do [datasheet](https://www.intel.com/content/dam/www/programmable/us/en/pdfs/literature/hb/cyclone-v/cv_5v2.pdf)):

- ARM Cortex-A9 MPCore
   - One or two ARM Cortex-A9 processors in a cluster
   - [NEON SIMD coprocessor](https://en.wikipedia.org/wiki/ARM_architecture#Advanced_SIMD_(NEON)) and [VFPv3](https://en.wikipedia.org/wiki/ARM_architecture#Floating-point_(VFP)) per processor 
   - [Snoop Control Unit (SCU)](http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.ddi0434c/CJHBABIC.html) to ensure coherency within the cluster
   - Accelerator coherency port (ACP) that accepts coherency memory access requests
   - Interrupt controller
   - One general-purpose timer and one watchdog timer per processor •
   - Debug and trace features
   - 32 KB instruction and 32 KB data level 1 (L1) caches per processor
   - Memory management unit (MMU) per processor
- ARM L2-310 level 2 (L2) cache
   - Shared 512 KB L2 cache

A seguir um diagrama detalhado do HPS: 

![](figs/Tutorial-HPS-SoC-detalhado.png)

## Conexão entre HPS e FPGA

Note que existe no diagrama anterior algumas interfaces definidas no "FPGA Portion", essas interfaces permitem a ponte entre o *Fabric* da FPGA e o ARM hard core do chip. As interfaces são, resumidamente:

- FPGA to HPS: Barramento na qual um **Master** na FPGA (Platform Designer) acessa o ARM
- HPS to FPGA: Barramento pelo qual o ARM acessa um periférico (slave) na FPGA
- Lightweight HPS to FPGA: Barramento de menor banda que conecta o ARM em um periférico na FPGA (slave)
- 1-6 Masters SDRAM Controller: Permite a FPGA ler e escrever da memória SDRAM externa ao chip
 
### AXI

Os barramentos são todos do tipo [AXI](https://en.wikipedia.org/wiki/Advanced_Microcontroller_Bus_Architecture), um padrão definido pela própria ARM e usada em seus microcontroladores. 

!!! note "AXI - AVALON"
    Via Platform Designer podemos conectar periféricos com o barramento Avalon (mm) no barramento AXI do ARM, isso é possível por uma "mágica" que a PD faz convertendo um barramento no outro de forma transparente ao usuário.

### SDRAM

A SDRAM deve ser usada com muita cautela, pois ela será compartilhada com o Linux que estará em execução no ARM, caso um periférico da FPGA acesse "aleatoriamente" a memória SDRAM ele pode sobrescrever dados importantes do kernel e pode causar falhar em todo sistema. Essa alocação deve ser realizada no boot do Linux onde iremos dizer qual região de memória o kernel pode utilizar. 

!!! note 
    Essa memória que é acessível tanto pelo Linux quanto pela FPGA é uma boa maneira de compartilhamento de dados a serem processados.  

## Aplicações

Agora é possível unir o melhor dos dois mundos: flexibilidade e paralelismo da FPGA com o melhor dos processadores embarcados: o ARM. 

Vamos fazer um exercício mental e imaginar uma aplicação que irá processar uma imagem em um sistema embarcada, com o SoC podemos fazer que a imagem seja processada pela FPGA de modo a aumentar o throughtput do sistema. Essa imagem seria lida, por exemplo, por uma câmera USB conectada no HPS (ARM), como geralmente o HPS executa um Linux, temos facilidade de acesso ao driver desse dispositivo.

A imagem será então lida via o driver e alocada na memória SDRAM, o endereço da memória assim como as propriedades do processamento serão transferidas para um periférico customizado no Fabric da FPGA via a interface LT-AXI. O periférico que está em modo wait, após ser configurado, começa a ler a imagem na memória SDRAM, processar e salvar o resultado na própria memória. Ao final da conversão uma interrupção é gerada e o Linux irá tratar o dado.

Enquanto o periférico processa a imagem, a aplicação pode de forma concorrente, ler uma nova imagem e já alocar em um novo endereço de memória, pois o processamento e a aquisição agora funcionam de forma simultânea. Isso é chamado de *buffer ping-pong*.

## Próximos passos

Vamos agora executar um Linux no ARM, iremos nesse momento trabalhar com uma imagem já pronta e fornecida pelo fabricante do kit. Siga para o próximo tutorial, onde iremos configurar nossa infra para podermos gerar códigos para o ARM.

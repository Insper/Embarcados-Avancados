# SoC and Embedded Linux

- **Course:** Elective for Computer Engineering
- **Track:** Solutions Architecture
- **Prof.:** Rafael Corsi / rafael.corsi@insper.edu.br
- **Repository:** [http:/github.com/insper/Embarcados-Avancados](http:/github.com/insper/Embarcados-Avancados)
- **Location:** Computer Architecture Laboratory 

**© All rights reserved**

---

## OBJECTIVES:

1. Formulate solutions that meet hardware and software requirements for projects with FPGA-SoC (System-on-a-chip)
2. Integrate a prototype solution for an embedded system with processing and/or real-time requirements via FPGA-SoC
3. Interface different modules in an embedded system (processors, firmware, and operating systems)

## Methodology

The course is based on tutorials where theoretical and practical concepts are presented. The student must follow the material as presented (in sequence) as it was designed incrementally. Each tutorial (or series of tutorials) has an assignment (APS) to be done, and the tutorial is the entry point for the assignment, but it also goes beyond in understanding and concepts.

## Evaluation

The evaluation consists of assignments throughout the semester (each series of tutorials has an assignment with a grade) and a tutorial that must be created throughout the course and integrated into the course page. The tutorial is a free theme within the objectives of the course and has some intermediate assignments that will compose the final grade.

## Motivation

- What is a [System On Chip (SoC)](https://en.wikipedia.org/wiki/System_on_a_chip)?
- Who are the main SoC manufacturers?
  - [Samsung](https://en.wikipedia.org/wiki/List_of_Samsung_system-on-a-chips) / [Qualcomm](<https://en.wikipedia.org/wiki/List_of_Qualcomm_Snapdragon_systems-on-chip#Qualcomm_205,_Snapdragon_208,_210_and_212_(2014-17)>) / [Xilinx](https://www.xilinx.com/products/silicon-devices/soc.html) / [Intel FPGA](https://www.intel.com/content/www/us/en/products/programmable.html)
- Areas / Applications:
  - [Macbook Pro](https://www.redsharknews.com/technology/item/6408-apple-s-mac-pro-afterburner-what-just-happened)/ [aws f1](https://aws.amazon.com/ec2/instance-types/f1/) / [Intel 1](https://www.intel.com/content/www/us/en/products/programmable.html) / [Intel 2](http://www.innovatefpga.com) / [Xilinx](https://www.xilinx.com/applications.html)
- What is the difference between [Soft-Processor](https://www.intel.com/content/www/us/en/products/programmable/processor/nios-ii.html) and a HardProcessor?
- [x86 + FPGA ?](https://www.anandtech.com/show/12773/intel-shows-xeon-scalable-gold-6138p-with-integrated-fpga-shipping-to-vendors)
- Jobs? Which one would you apply for?
  - [Facebook](https://www.glassdoor.com.br/Vagas/Facebook-fpga-Vagas-EI_IE40772.0,8_KO9,13.htm?countryRedirect=true) / [Google](https://www.linkedin.com/jobs/search/?geoId=92000000&keywords=google%20fpga&location=Mundialmente) / [Apple](https://www.linkedin.com/jobs/search/?geoId=92000000&keywords=apple%20fpga&location=Mundialmente) / [Microsoft](https://www.linkedin.com/jobs/search/?geoId=92000000&keywords=microsoft%20fpga&location=Mundialmente) / [Amazon](https://www.linkedin.com/jobs/search/?geoId=92000000&keywords=amazon%20fpga&location=Mundialmente)
- How to use hardware in service of software?
  [HLS](https://www.intel.com/content/www/us/en/software/programmable/quartus-prime/hls-compiler.html)
  /
  [OpenCL](https://www.intel.com/content/www/us/en/software/programmable/sdk-for-opencl/overview.html)

## Infrastructure

To facilitate the course progress, we  an SSD with the listed software [here](/info-FPGA-e-Softwares). We will use the [DE10-Standard](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&No=1081) kit.

## Dynamics

The course is based on a series of tutorials (with assignments) that starts from a simple hardware on the FPGA to control the board's LEDs and goes up to running a Linux system with graphical interface and co-processing on an embedded system.

## Bibliography

Many of the books are available in the Computer Architecture Laboratory.

Basic:

  - [HALLINAN, 2007] HALLINAN, C. Embedded Linux primer: a practical, real-world approach. Pearson Education India, 2007.
  - [DESCHAMPS, 2012] DESCHAMPS, J. P.; SUTTER, G. D.; CANTÓ E. Guide to FPGA implementation of arithmetic functions. Springer Science & Business Media; 2012, Apr 5.
  - [CHU, 2011] CHU, PONG P. Embedded SoPC design with Nios II processor and VHDL examples. John Wiley & Sons, 2011.

Complementary:

  - [SASS, 2010] SASS, R., SCHMIDT, A.G.; Embedded Systems Design with Platform FPGAs: Principles and Practices. Elsevier, 2010.
  - [BOVET, 2005] Bovet, Daniel P., and Marco Cesati. Understanding the Linux Kernel: from I/O ports to process management. " O'Reilly Media, Inc.", 2005.
  - [SIMPSON, 2015] Simpson, Philip Andrew; FPGA Design: Best Practices for Team-based Reuse 2nd ed. Springer, 2015 Edition.
  - [KOOPMAN, 2010] Koopman, Philip. Better Embedded System Software. Drumnadrochit Education, 2010.
  - [VENKATESWARAN, 2008] Venkateswaran, Sreekrishnan. Essential Linux device drivers. Prentice Hall Press, 2008.

## To get started

1. Have a Linux machine (can be VM)
1. Create a repository on Github [by clicking here](https://classroom.github.com/a/fGUME066)
1. Think a little about a theme to delve into (for tutorial)
   - :point_right: [Tips](Projeto-Overview)
   - Take a look at past tutorials:
1. Recommended reading:
   - https://www.intel.com/content/www/us/en/products/programmable/fpga/new-to-fpgas/resource-center/overview.html
   - Available in the lab: [CHU, 2011, cap. 1], [KOOPMAN, 2010, cap. 2]# SoC and Embedded Linux

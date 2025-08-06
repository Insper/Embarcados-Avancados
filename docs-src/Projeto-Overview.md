# Overview

The final project for the course should be a tutorial related to at least one learning objective of the subject:

- Formulate solutions that meet hardware and software requirements for FPGA-SoC (System-on-a-chip) projects
- Integrate a prototype solution for an embedded system with processing and/or real-time requirements via FPGA-SoC
- Interface different modules in an embedded system (processors, firmware, and operating system)

## Areas

Some examples of areas that can be explored:

1. Acceleration/implementation of some algorithm in hardware
    - data processing, FFT, compression, cryptography, ...
    - HLD/HLS/OpenCL/Amazon FPGA
1. Performance comparison between different technologies  
    - SoC vs GPU vs FPGA vs uC
1. Operating system 
    - Real-time scheduler, Linux kernel, Android, embedded RTOS

## Previous Years

Take a look at what your colleagues have already done:

- PS3 Hack
- Android for Raspberry Pi 3
- Peripheral to control LED matrix
- Linux driver to turn on LEDs
- SoC and Python
- SDAccel / Vittis - Metropolis algorithm
- Audio on DE10
- Hardware Cryptography - FPGA
- TensorFlow - Jetson Nano
- OpenCL - FPGA
- Yocto 
- Jetson Nano - GPU
- FPGA on AWS
- Linux device driver

## Technologies/Tools

Below is a list of technologies that can be studied in the tutorial: 

- HDL (VHDL/Verilog)
  - [Add a custom instruction to NIOS](https://www.intel.com/content/dam/www/programmable/us/en/pdfs/literature/ug/ug_nios2_custom_instruction.pdf)
  - Platform Designer 
     - Create a system to control one of the robotics robots 
  - Create a peripheral to interface with the external world (read keyboard/motor/LED strip/...)
- [High Level Synthesis (HLS)](https://www.intel.com/content/www/us/en/software/programmable/quartus-prime/hls-compiler.html)
  - Create a peripheral that accelerates a function ([example](https://www.intel.com/content/dam/www/programmable/us/en/pdfs/literature/wp/wp-01274-intel-hls-compiler-fast-design-coding-and-hardware.pdf))
-  [OpenCL](https://www.intel.com/content/www/us/en/software/programmable/sdk-for-opencl/overview.html)
  - Create hardware that accelerates a function [Terasic Manual](https://github.com/Insper/DE10-Standard-v.1.3.0-SystemCD/blob/master/Manual/DE10_Standard_OpenCL.pdf) ([example](https://www.intel.com/content/www/us/en/programmable/products/design-software/embedded-software-developers/opencl/support.html))
- Linux 
  - [real time](https://www.linuxfoundation.org/blog/2013/03/intro-to-real-time-linux-for-embedded-developers/) / energy optimization / 👍 [boot time](https://embexus.com/2017/05/16/embedded-linux-fast-boot-techniques/) / applications / 👍 [Android](https://www.youtube.com/watch?v=zHqS_yWiMNI) / openCL ....

## Hardware

Below, I tried to summarize the hardware available at Insper and the respective technologies that can be used to develop the projects:

| Kit           | Company | Technology | vhdl | HLS | OpenCL | Linux | OpenCV | Cuda |
|---------------|---------|------------|------|-----|--------|-------|--------|------|
| [Arria 10 SoC](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&CategoryNo=216&No=997) | Intel   | FPGA + ARM | x    | x   | x      | x     | x      |      |
| [DE10-Standard](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&No=1081) | Intel   | FPGA + ARM | x    | x   | x      | x     | x      |      |
| [DE10-nano-soc](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&No=941)     | Intel   | FPGA + ARM | x    | x   | x      | x     | x      |      |
| [Terasic SoC SoM](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&CategoryNo=167&No=1211)   | Intel   | FPGA + ARM | x    | x   | x      | x     | x      |      |
| [DE5a-NET-DDR4](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&CategoryNo=1&No=1108&PartNo=1) | Intel   | FPGA       | x    | x   | x      |       | x      |      |
| [ZedBoard](http://zedboard.org/product/zedboard)      | Xilinx  | FPGA + ARM | x    | x   | x      | x     | x      |      |
| [F1 instance](https://aws.amazon.com/ec2/instance-types/f1/)  | AWS     | FPGA       |      |     | x      |       |        |      |
| [Jetson TK2](https://developer.nvidia.com/embedded/jetson-tx2)   | NVIDIA  | ARM + GPU  |      |     |        | x     | x      | x    |
|               |         |            |      |     |        |       |        |      |

## Example topics/cool ideas

legend: ‼ requires greater dedication
 
- Creating a SoftProcessor and API to control a Drone
- [OpenCV accelerated with OpenCL - ZedBoard](https://xilinx-wiki.atlassian.net/wiki/spaces/A/pages/18841665/HLS+Video+Library)
- !! Create an application with HLS/OpenCL that accelerates a function on the FPGA
    - Image processing/data compression/cryptography/fft/...
- ‼ [Create an application with OpenCL on AWS](https://github.com/aws/aws-fpga)
- [Embedding ROS on SoC-FPGA](http://wiki.ros.org/hydro/Installation/OpenEmbedded) (first step to control robotics robots with FPGA)
- ‼ Use the [LCD LT24](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&CategoryNo=68&No=892) with Linux (ARM-FPGA Communication)
- [Real Time kernel](https://www.linuxfoundation.org/blog/2013/03/intro-to-real-time-linux-for-embedded-developers/) is it really real time? Latency study...
- Optimizing [boot time](https://embexus.com/2017/05/16/embedded-linux-fast-boot-techniques/) for Linux
- Running [Android](https://www.youtube.com/watch?v=zHqS_yWiMNI) on DE10-Standard
- Graphical interfaces in embedded systems (e.g.: create a payment kiosk)
- Device driver: Create a Linux driver [for some distance sensor](https://github.com/johannesthoma/linux-hc-sro4)
- ‼ Create a peripheral to control the RGB LED strip and create a driver for Linux to control it
- Benchmark between different development kits 
- Using [yocto](https://www.yoctoproject.org/) as an alternative to buildroot to generate Linux


# Blink FPGA LED

!!! info
    1. This tutorial requires the Quartus software installed (version 18.1).
    2. You will need to use the white USB cable to program the FPGA (Type-B USB)!

In this tutorial, we will see how to interface the ARM with the FPGA fabric. I chose to let you follow the official Terasic tutorial **Examples for using both HPS SoC and FGPA** [Chapter 7], which can be found in the user manual on the kit's CD. For now, we won't create any custom hardware for the FPGA; we'll only work with the base example provided by the board manufacturer.

!!! exercise
    Follow the tutorial in Chapter 7:

    - https://github.com/Insper/DE10-Standard-v.1.3.0-SystemCD/blob/master/Manual/DE10-Standard_User_manual.pdf
 
    You will need the following examples:

    - [DE10-Standard-v.1.3.0-SystemCD/Demonstration/SoC_FPGA/DE10_Standard_GHRD/](https://github.com/Insper/DE10-Standard-v.1.3.0-SystemCD/tree/master/Demonstration/SoC_FPGA/DE10_Standard_GHRD)
    - [DE10-Standard-v.1.3.0-SystemCD/Demonstration/SoC_FPGA/HPS_FPGA_LED/](https://github.com/Insper/DE10-Standard-v.1.3.0-SystemCD/tree/master/Demonstration/SoC_FPGA/HPS_FPGA_LED)
    
!!! example "Execute"
    Remember to copy the compiled binary from the tutorial `HPS_FPGA_LED` to the SD Card, this include the `.rbf` and the `HPS_FPGA_LED` exeute file.

## Understanding the Hardware

It's very important to stop and reflect on what happened. Here are some questions:

1. What are the interfaces between the ARM and the FPGA? (there are 4 in total)
2. What is the difference between them?
3. What is Platform Designer (PD)?
4. How does the HPS appear in Platform Designer (PD)?
   - Did you open the HPS settings in PD? What can be configured?
5. How is this interface used in Platform Designer?
6. Why did the project use a clock bridge?

# HW and SW Infrastructure

Throughout the course, we will mainly work with Intel SoC FPGAs. The main development kit is the DE10-Standard, which features a Cyclone V SoC FPGA.

The development software for Intel FPGAs is called Quartus, and it has many versions and variations. Download the one indicated here to avoid having to reinstall everything.

!!! note "2020-2 Online Version"
    You will receive the following materials to work on the course from home:
    
    - 1x DE10-Standard FPGA
    - 1x micro SD card
    - 1x microSD/USB adapter
    - 1x USB-Wifi NIC

## HW - DE10-Standard

- [Manufacturer's website](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&CategoryNo=205&No=1081&PartNo=2)

It is a development kit manufactured by Terasic, costing $350, which has at its core an Intel Cyclone V - SoC FPGA with large memory capacity and many logic cells. It has several peripherals that can be controlled either by the FPGA or by the ARM on the chip.

![](https://img11.shop-pro.jp/PA01053/865/etc/DE10-Standard_Front.jpg?cmsp_timestamp=20170421200223)

## Software

Due to the second part of the course, in which we will compile and work with embedded Linux, the course should be done (and the tutorials follow this) on **Linux**. Windows works for the first part, but not after that, and MAC is not supported by Quartus.

### Quartus Prime

!!! info
    We will use Quartus Prime Standard version 19.1.

Along with Quartus installation, some other software is installed:

- Quartus: FPGA project development
- Modelsim: HDL project simulator (VHDL/Verilog)
- NIOS II EDS: Eclipse platform for NIOS uC programming
- HLS: High-level synthesis 

!!! tip "Installing"
    Download the following parts and run the Quartus Prime binary, which will automatically install the others.

    - [Quartus Prime Standard](https://download.altera.com/akdlm/software/acdsinst/19.1std/670/ib_installers/QuartusSetup-19.1.0.670-linux.run)
    - [ModelSim](https://download.altera.com/akdlm/software/acdsinst/19.1std/670/ib_installers/ModelSimSetup-19.1.0.670-linux.run)
    - [Cyclone V](https://download.altera.com/akdlm/software/acdsinst/19.1std/670/ib_installers/cyclonev-19.1.0.670.qdz)

!!! info "License"
    We will use a version of Quartus that requires a license to work. I will send instructions by email.

:heavy_check_mark: Linux
:no_entry_sign: Windows
:no_entry_sign: MAC
:no_entry_sign: MAC

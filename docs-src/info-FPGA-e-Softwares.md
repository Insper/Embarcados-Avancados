# HW and SW Infrastructure

Throughout the course, we will mainly work with Intel SoC FPGAs. The main development kit is the DE10-Standard, which features a Cyclone V SoC FPGA.

The development software for Intel FPGAs is called Quartus, and it has many versions and variations. Download the one indicated here to avoid having to reinstall everything.

::: info Material
You will receive the following materials to work on the course from home:

- 1x DE10-Standard FPGA
- 1x micro SD card
- 1x microSD/USB adapter
- 1x USB-Wifi NIC
:::

## HW - DE10-Standard

- [Manufacturer's website](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&CategoryNo=205&No=1081&PartNo=2)

It is a development kit manufactured by Terasic, costing $350, which has at its core an Intel Cyclone V - SoC FPGA with large memory capacity and many logic cells. It has several peripherals that can be controlled either by the FPGA or by the ARM on the chip.

![](https://img11.shop-pro.jp/PA01053/865/etc/DE10-Standard_Front.jpg?cmsp_timestamp=20170421200223)

## Software

:heavy_check_mark: Linux
:heavy_check_mark: Windows
:no_entry_sign: MAC

Due to the second part of the course, in which we will compile and work with embedded Linux, the course should be done (and the tutorials follow this) on **Linux**. Windows works for the first part, but not after that, and MAC is not supported by Quartus.

::: danger :no_entry_sign: MAC
If you have a MAC we recomend you to use a virtual machine with Linux.

- [Tutorial](https://www.linkedin.com/posts/raphael-geraldine_fpga-intelquartus-applesilicon-share-7488652134545174528-bn6I?utm_source=social_share_send&utm_medium=android_app&rcm=ACoAABzd5HwBoWQpEPjHUJwmtzAkRHApY9MlySc&utm_campaign=whatsapp)

:::

### Quartus Prime Light

We will use Quartus Prime Standard version 25.1:

- Quartus Prime ==Light== FPGA project development
- Questa HDL project simulator (VHDL/Verilog)
- RiscFree™ IDE for Altera FPGAs

::: tip Installing
Download the following parts and run the Quartus Prime ==Light== binary, which will automatically install the others.

- [Quartus Prime Light](https://www.altera.com/downloads/fpga-development-tools/quartus-prime-lite-edition-design-software-version-25-1-linux)

:::
::: info License
We will use a version of Quartus that requires a license to work. I will send instructions by email.

:::

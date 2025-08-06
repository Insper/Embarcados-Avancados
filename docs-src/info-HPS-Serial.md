# Screen

We have several ways to access and use this system:

1. Via UART terminal 
1. Via SSH terminal
1. If Linux has a graphical interface, we can use a keyboard and mouse.
1. Graphical interface via SSH

## UART

Linux on the HPS is usually configured (in the bootloader) to have a terminal redirected to a UART port. This UART port is available via FTDI on one of the board's USBs (the one labeled UART) and can then be accessed as a UART. For this, there is a specific USB port (UART).

![](figs/tutorial-hps-running-usbuart.png)

Once the USB port is connected to the PC and the board is powered on, we can check which *device* the serial port was mapped to (on the `host`):

```bash
$ dmesg | tail 
[95158.497894] ftdi_sio 1-1.1:1.0: device disconnected
[95161.649187] usb 1-1.1: new full-speed USB device number 22 using xhci_hcd
[95161.748948] ftdi_sio 1-1.1:1.0: FTDI USB Serial Device converter detected
[95161.749067] usb 1-1.1: Detected FT232RL
[95161.756092] usb 1-1.1: FTDI USB Serial Device converter now attached to ttyUSB0
```

In the log, we see that an **FTDI USB Serial Device** was connected to **ttyUSB0**. We can then open the terminal with any serial port program (PUTTY, ...), in this example we will use the **screen** program.

```bash
$ screen /dev/ttyUSB0 115200,cs8
```

To improve the interface with screen, create a file `~/.screenrc` and add the following content to it:

```
# Enable mouse scrolling and scroll bar history scrolling
termcapinfo xterm* ti@:te@
```

:warning: You may need to install screen.

After this, restart the `target` (power cycle) to get access to the full boot log.

> Note that in my case the name assigned to the USB-UART was **/dev/ttyUSB0**, this may change on your PC.

Once connected, you now have access to all Linux functionalities as a normal bash. In fact, the terminal is already configured to work at boot, so you can access u-boot information.

#### Kernel and serial port

How does the kernel know which port to use to print the log and use as a terminal? This parameter is passed by u-boot to the kernel via the [Device Tree](https://rocketboards.org/foswiki/Documentation/DeviceTreeGenerator131):

```
    hps_0_uart0: serial@0xffc02000 {
        compatible = "snps,dw-apb-uart-1.0", "snps,dw-apb-uart";
        reg = < 0xFFC02000 0x00001000 >;
        interrupt-parent = < &hps_0_arm_gic_0 >;
        interrupts = < 0 162 4 >;
        reg-io-width = < 4 >;    
        reg-shift = < 2 >;    
        clock-frequency = < 100000000 >;    
    }; 
```

And then passed as an argument to the kernel:

```
    bootargs = "console=ttyS0,115200";
```

:vertical_traffic_light: (this example is not from our FPGA)

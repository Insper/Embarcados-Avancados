# Altera Video and Image Processing(VIP) Frame Reader driver

Steps to use:

1. Copy the `altvipfb.c` to `drivers/video/fbdev/`
2. Modify fbdev Makefile adding the `altvipfb.o`

```diff
# Hardware specific drivers go first
+obj-$(CONFIG_FB_ALTERA_VIP)   += altvipfb.o
```

3. Edit Kconfig: `drivers/video/fbdev/Kconfig`

```diff
comment "Frame buffer hardware drivers"
    depends on FB

+ config FB_ALTERA_VIP
+   tristate "Altera VIP Frame Reader framebuffer support"
+   depends on FB
+   select FB_CFB_FILLRECT
+   select FB_CFB_COPYAREA
+   select FB_CFB_IMAGEBLIT
+   ---help---
+   This driver supports the Altera Video and Image Processing(VIP) Frame Reader
```

4. Add the FB_ALTERA_VIP to be include in the kernel (edite the `.config`):

```diff
+ CONFIG_FB_ALTERA_VIP=y
```

And Enable the .config enabling:

```
#
# Frame buffer Devices
#
CONFIG_FB=y
# CONFIG_FIRMWARE_EDID is not set
CONFIG_FB_CMDLINE=y
# CONFIG_FB_DDC is not set
# CONFIG_FB_BOOT_VESA_SUPPORT is not set
CONFIG_FB_CFB_FILLRECT=y
CONFIG_FB_CFB_COPYAREA=y
CONFIG_FB_CFB_IMAGEBLIT=y

...

#
# Console display driver support
#
CONFIG_DUMMY_CONSOLE=y
CONFIG_FRAMEBUFFER_CONSOLE=y
CONFIG_FRAMEBUFFER_CONSOLE_DETECT_PRIMARY=y
# CONFIG_FRAMEBUFFER_CONSOLE_ROTATION is not set
CONFIG_LOGO=y
CONFIG_LOGO_LINUX_MONO=y
CONFIG_LOGO_LINUX_VGA16=y
CONFIG_LOGO_LINUX_CLUT224=y
# CONFIG_SOUND is not set
```

5. build the kernel

```bash
export ARCH=arm
export CROSS_COMPILE=arm-linux-gnueabihf-
make zImage -j4
```






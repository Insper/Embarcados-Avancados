altvipfb.c -- Altera Video and Image Processing(VIP) Frame Reader driver

Steps to use:

1. Copy the `altvipfb.c` to `drivers/video/fbdev/`
2. Modify fbdev Makefile adding the `altvipfb.o`

```diff
# Hardware specific drivers go first
+obj-$(CONFIG_FB_ALTERA_VIP)   += altvipfb.o
```

3. Modificar Kconfig: `drivers/video/fbdev/Kconfig`

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

5. build the kernel


```bash
export ARCH=arm
export CROSS_COMPILE=arm-linux-gnueabihf-
make zImage -j4
```






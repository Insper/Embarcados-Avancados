
Imagem padrão Linux para o kit DE10-nano da Terasic:

| Arquivo   | MD5 (.tar.gz)  |  
|---|---|
|[de10-nano-insper.tar.gz](https://www.dropbox.com/s/bi9opoegacrbsyp/de10-nano-insper.tar.gz?dl=0)   |  c43c2d423fde5a01e45e50e135baa84c | 


A iso possui as seguintes especificações:

### Software

- Toolchain
    - gcc-linaro-7.2.1-2017.11-x86_64_arm-linux-gnueabihf

- Linux Kernel 4.14
    - https://github.com/altera-opensource/linux-socfpga 
    
- FileSystem (buildroot):
   - user: **root**  
   - password: **1234**
   - Networking:
       - aftp, sshfs, dropbear
   - Debuggin, profiling and benchmark:
       - dgb (server), cache-calibrator
   - Graphic libraries
       - direcfb, x.org
   - Crypto
       - openssl, libsha1

## u-boot

- [meta-de10-nano](https://github.com/intel/meta-de10-nano)
    - VERSION-2017.03.31


Essa versão do u-boot aloca um framebuffer no endereço: `0x3F000000`

```diff
+ "hdmi_fdt_mod="							\
+		"load mmc 0:1 ${fdt_addr} "				\
+			"socfpga_cyclone5_de10_nano.dtb; "		\
+		"fdt addr ${fdt_addr}; "				\
+		"fdt resize; "						\
+		"fdt mknode /soc framebuffer@3F000000; "		\
+		"setenv fdt_frag /soc/framebuffer@3F000000; "		\
+		"fdt set ${fdt_frag} compatible \"simple-framebuffer\"; "\
+		"fdt set ${fdt_frag} reg <0x3F000000 8294400>; "	\
+		"fdt set ${fdt_frag} format \"x8r8g8b8\"; "		\
+		"fdt set ${fdt_frag} width <${HDMI_h_active_pix}>; "	\
+		"fdt set ${fdt_frag} height <${HDMI_v_active_lin}>; "	\
+		"fdt set ${fdt_frag} stride <${HDMI_stride}>; "		\
+		"fdt set /soc stdout-path \"display0\"; "		\
+		"fdt set /aliases display0 \"/soc/framebuffer@3F000000\";"\
```

Assumi-se que o kernel possui nome `zImage`, que o baudrate do console é `115200` e que o hardware a ser carregado na FPGA é o arquivo `de10-nano.rbf` e o device tree com nome `socfpga_cyclone5_de10_nano.dtb`

```
#define CONFIG_BOOTFILE        "zImage"
#define CONFIG_BOOTARGS        "console=ttyS0," _stringify(CONFIG_BAUDRATE)
#define CONFIG_BOOTCOMMAND "run mmcload; run mmcboot"
```

### Hardware
  
O Hardware contido nessa ISO é o [`de10-nano-fft`](https://github.com/intel/de10-nano-hardware) fornecido no repositório do github da Intel. Com o hardware detalhado a seguir:

```
Flow Status	Successful - Mon Oct  1 17:47:53 2018
Quartus Prime Version	16.1.0 Build 196 10/24/2016 SJ Standard Edition
Revision Name	de10-nano-fft
Top-level Entity Name	top
Family	Cyclone V
Device	5CSEBA6U23I7DK
Timing Models	Final
Logic utilization (in ALMs)	20,797 / 41,910 ( 50 % )
Total registers	34901
Total pins	265 / 314 ( 84 % )
Total virtual pins	0
Total block memory bits	1,798,248 / 5,662,720 ( 32 % )
Total DSP Blocks	18 / 112 ( 16 % )
Total HSSI RX PCSs	0
Total HSSI PMA RX Deserializers	0
Total HSSI TX PCSs	0
Total HSSI PMA TX Serializers	0
Total PLLs	1 / 6 ( 17 % )
Total DLLs	1 / 4 ( 25 % )
```

![](figs/HW-DE0-nano-meta-fft.png)

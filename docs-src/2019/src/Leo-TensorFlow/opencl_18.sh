echo Opencl 18.1
export LOCAL=/media/leonardo
export QUARTUS_ROOTDIR=$LOCAL/FPGA/intelFPGA/18.1/quartus
export ALTERAOCLSDKROOT=$LOCAL/FPGA/intelFPGA/18.1/hld

export PATH=$PATH:$QUARTUS_ROOTDIR/bin:$LOCAL/FPGA/intelFPGA/18.1/embedded/ds-5/bin:$LOCAL/FPGA/intelFPGA/18.1/embedded/ds-5/sw/gcc/bin:$ALTERAOCLSDKROOT/bin:$ALTERAOCLSDKROOT/linux64/bin:

export LD_LIBRARY_PATH=$ALTERAOCLSDKROOT/linux64/lib
export AOCL_BOARD_PACKAGE_ROOT=$ALTERAOCLSDKROOT/board/terasic/de10_standard
export QUARTUS_64BIT=1
export LM_LICENSE_FILE="/home/leonardo/Downloads/1-R3OQLF_License.dat"

export INTELFPGAOCLSDKROOT=$LOCAL/FPGA/intelFPGA/18.1/hld
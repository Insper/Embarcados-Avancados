# Atualizando o SDCARD

## Kernel

Para atualizar o kernel basta montar a partição 1 (819,2 M). No meu caso o path é: `/run/media/corsi/B0DA-B234/` e copiar o arquivo zImage para ela.

!!! note
    Você irá ter que editar para o caminho que a partição foi montada no seu linux.

```
$ cp ~/work/HPS-Linux/zImage /run/media/corsi/B0DA-B234/
$ sync
```

Quando fizer isso, irá reparar que a versão do kernel do Linux é a que foi gerada na etapa de compilação do kernel.

## FileSystem

Para insierirmos nosso fileSystem no SDCARD, primeiramente deve montar a partição. no meu caso : `/run/media/corsi/9cb79fd9-69b8-43e3-bcfe-fa4582579e2c/`. Uma vez montada, devemos primeiramente excluir os arquivos ali salvo (apagar o fileSystem antigo) e então extrair o que foi gerado pelo buildroot.

!!! note
    Você irá ter que editar para o caminho que a partição foi montada no seu linux.

```bash
# Limpando fs antigo
$ sudo rm -r /run/media/corsi/9cb79fd9-69b8-43e3-bcfe-fa4582579e2c/
$ sync 
# Extraindo novo fs
$ sudo tar xvf rootfs.tar -C /run/media/corsi/9cb79fd9-69b8-43e3-bcfe-fa4582579e2c/
$ sync 
```

## uboot script e device tree

```
$ cp ~/work/HPS-Linux/u-boot.scr /run/media/corsi/B0DA-B234/
$ cp ~/work/HPS-Linux/socfpga.dtb /run/media/corsi/B0DA-B234/
$ sync
```

# Atualizando o SDCARD

Premissas

## Atualizando o preload

TBD

## Atualizando o uboot

TBD

### uboot script

```bash
$ cp u-boot.scr /run/media/corsi/B0DA-B234/
```

## Atualizando Kernel

Para atualizar o kernel basta montar a partição 1 (819,2 M). No meu caso o path é: `/run/media/corsi/B0DA-B234/` e copiar o arquivo `zImage` para ela.

O arquivo `zImage` fica localizado (dentro do repositório do kernel) em: `/arch/arm/boot/zImage`

!!! note
    Você irá ter que editar para o caminho que a partição foi montada no seu linux.

```
$ cp ~/work/linux/arch/arm/boot/zImage /run/media/corsi/B0DA-B234/
$ sync
```

Quando fizer isso, irá reparar que a versão do kernel do Linux é a que foi gerada na etapa de compilação do kernel.

### Atualizando o dts

```
$ cp socfpga.dtb /run/media/corsi/B0DA-B234/
```

## FileSystem

Para insierirmos nosso fileSystem no SDCARD, primeiramente deve montar a partição. no meu caso : `/media/corsi/9cb79fd9-69b8-43e3-bcfe-fa4582579e2c/`. Uma vez montada, devemos primeiramente excluir os arquivos ali salvo (apagar o fileSystem antigo) e então extrair o que foi gerado pelo buildroot.

!!! warning
    Você irá ter que editar para o caminho que a partição foi montada no seu linux.

!!! danger
    Se errar, pode ser destrutivo (para seus arquivos)

```bash
# Limpando fs antigo
$ sudo rm -r /media/corsi/9cb79fd9-69b8-43e3-bcfe-fa4582579e2c/
$ sync 

# Extraindo novo fs
$ sudo tar xvf rootfs.tar -C /media/corsi/9cb79fd9-69b8-43e3-bcfe-fa4582579e2c/
$ sync 
```

## uboot script e device tree


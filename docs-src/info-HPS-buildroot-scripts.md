# Extra: buildroot scripts


O buildroot possui uma série de mecanismos para ajudar na customização da imagem gerada:

- https://buildroot.org/downloads/manual/manual.html#_support_scripts

Vamos ver dois tipos: 

- Usando o recurso de overlay
- Modificando os arquivos antes de gerar o tar `fakeroot`

## overlay

Ele irá copiar arquivos para a pasta `/etc/init.d`. Para isso:

- criei uma pasta chamada `overlay` no root do buildroot
- adicione o arquivo `S41static`
- configure o `buildroot`:
    - `System Configuration` -> *Root filesystem overlay directories*: `overlay`
    
    
```bash title="overlay/S41static"
#!/bin/bash

case "$1" in
start)
    printf "Setting ip: "
    /sbin/ifconfig eth0 169.254.0.13 netmask 255.255.0.0 up
    [ $? = 0 ] && echo "OK" || echo "FAIL"
    ;; 
*)
    exit 1
    ;;
esac
```

Pronto, agora toda vez que gerarmos um novo buildroot ele irá copiar o script para inicializar a rede.

!!! tip
    Faća o mesmo com o dropbear 

## fakeroot

!!! info
    Não indicado para este caso, mas fica de exemplo


Vamos criar um script que será executado no antes do buildroot criar o `.tar`:

> Post-fakeroot scripts (BR2_ROOTFS_POST_FAKEROOT_SCRIPT)
>    When aggregating the final images, some parts of the process requires root rights: creating device nodes in /dev, setting permissions or ownership to files and directories… To avoid requiring actual root rights, Buildroot uses fakeroot to simulate root rights. This is not a complete substitute for actually being root, but is enough for what Buildroot needs.

Crie uma pasta no buildroot chamada de `custom_script` e adicione dois arquivos:

```bash title="custom_script/script.sh"
#!/bin/sh

INIT=$1/etc/init.d/
FILE=S41static

echo "--------------------------------"
echo "SCRIPT BUILDROOT"

# static ip
cp custom-scripts/S41staticIp $INIT
chmod +x $INIT/S41staticIp

echo "--------------------------------"
```

```bash title="custom_script/S41static"
#!/bin/bash

case "$1" in
start)
    printf "Setting ip: "
    /sbin/ifconfig eth0 169.254.0.13 netmask 255.255.0.0 up
    [ $? = 0 ] && echo "OK" || echo "FAIL"
    ;; 
*)
    exit 1
    ;;
esac
```

Agora temos que configurar o buildroot para executar o `script.py`, em:

- `System configuration/Custom scripts to run inside the fakeroot environment`
- `custom-scripts/script.sh`

![](figs/info-HPS-buildroot-scritps.png)

Sempre que gerar o `.tar` o buildroot irá criar o arquivo de configuracão de rede. 
.

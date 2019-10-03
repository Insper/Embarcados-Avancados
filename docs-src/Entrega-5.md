# 👁 Entrega 5

Nessa entrega iremos criar um webserver no `target` que exibirá uma imagem 
capturada por uma câmera USB conectada ao SoC. Para isso será necessário 
configurar o kernel para possuir o driver USB que lida com a câmera USB,
o buildroot para ter os programas que serão usados para criar o server e 
ler a imagem e um programa para orquestrar tudo isso.

!!! note "Dicas"
    - Driver webcam
        - Plug no seu PC com linux e verifique qual driver ele utiliza. 
        Acrescente o mesmo no `target`
    - Aquisição de imagens
        - opencv
        - [v4l2grab](https://github.com/twam/v4l2grab)
    - Servidor web
        - python flask 
        - apache
        - node
        
A entrega deve conter os arquivos de configuração (.config) do kernel e do
buildroot assim como o programa do webserver.

### Rubrica:

- A 
    - Detecta movimento na imagem e acende o LED do SoC
- B
    - Exibe a imagem em tempo real (vídeo)
- C
    - Exibe a imagem estática (foto)
- D 
    - Entregou somente tutorial
- I
    - Não entregou nada


# 👁 Entrega 6

Desenhe um diagrama de blocos que explica o tutorial anterior (HPS+FPGA)! Nele
deve conter:

- SDCARD
- ARM
- DDR3
- FPGA
- periférico PIO

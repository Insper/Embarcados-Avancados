# Tutorial - HPS-FPGA - VGA

Vamos agora fazer com o que nosso sistema embarcado possua uma saída de vídeo,
no caso do kit DE10-Standard isso deve ser feito pela porta VGA que está
conectada na parte da FPGA do SoC. Vamos precisar fazer alguns passos para que
isso funcione, são eles:

1. Configurar a FPGA com o IP de VGA
1. Adicionar o driver no kernel do Linux compatível com o dispositivo
  - Não é nativo
1. Configurar o kernel do Linux com framebuffer
1. Adicionar no buildroot um programa para exibir imagens no fb

## Configuar IP VGA



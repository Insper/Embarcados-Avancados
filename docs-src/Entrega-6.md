# 🔔 Assessment 6

Você pode escolher entre um dos temas a seguir:

- criar um driver no linux para controlar os LEDs e Chaves da FPGA
- desenvolver um programa GUI que será exibido pela VGA

## driver

O driver será um misto do tutorial do `char-device-driver` com o tutorial do `Tutorial - HPS + FPGA - Blink LED`, onde vocês devem desenvolver um driver no linux capaz de controlar os LEDs da FPGA (e ou ler os botões da placa).

Rubrica:

- A: O driver é do tipo [uleds](https://01.org/linuxgraphics/gfx-docs/drm/leds/leds-class.html) 
- B: Inclui o driver como parte do build do kernel do linux (e não como um módulo)
- C: Driver que possibilita um programa do userspace controlar os LEDs da FPGA

## GUI

Deve ser uma aplicação que possibilita controlarmos o LED e o BTN do HPS (o mesmo da entrega 2).

Rubrica:

- A: Carrega o programa automáticamente
- B: Possibilita o controle via mouse ou teclado
- C: Um programa gráfico que possibilita controlar o LED e ler o botão do ARM

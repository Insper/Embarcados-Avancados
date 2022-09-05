# 👁 Entrega 2

Vocês devem criar uma sistema embarcado que possui um webserver e uma página web que permita sensoriar e controlar o hardware por uma interface simples.

A página deve permitir:

1. Controlar o LED da placa
1. Fazer a leitura do botão da placa

Dica: Vocês vai precisar ter um servidor (por exemplo em python) que vai precisar comunicar com um software em C (para controle dos pinos), uma sugesão é a de utilizar um socket para a comunicação entre os dois programas. Aqui tem um exemplo de como fazer isso:

- https://github.com/Insper/Embarcados-Avancados/tree/master/Entrega-5

## Rubrica:

### A

- Leitura e exibição da IMU da placa (dica: usar código exemplo ([hps_gsensor](https://github.com/Insper/DE10-Standard-v.1.3.0-SystemCD/tree/master/Demonstration/SoC/hps_gsensor)))

- Escrever no LCD da placa (dica: usar código exemplo [hps_lcd](https://github.com/Insper/DE10-Standard-v.1.3.0-SystemCD/tree/master/Demonstration/SoC/hps_lcd))

### B

- O deploy e configuração do webserver deve ser feito via um makefile 
- O sistema deve ser inicializado automaticamente


### C

- webserver que permite:
    - controlar o botão do LED da placa
    - leitura da chave da placa (status)

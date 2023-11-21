# RISC-V

- **Alunos:** Beatriz Muniz / Gabriel Kawall / Rafael dos Santos
- **Curso:** Engenharia da Computação
- **Semestre:** 6 / 8 / 8
- **Contato:** corsiferrao@gmail.com
- **Ano:** 2021

## Começando

Para seguir esse tutorial é necessário:

- **Hardware:** DE10-Standard e acessórios
- **Softwares:** Quartus 18.01
- **Documentos:** [DE10-Standard_User_manual.pdf](https://github.com/Insper/DE10-Standard-v.1.3.0-SystemCD/tree/master/Manual)

## Começando

- Hardware: DE10-Standard
- Softwares: Quartus 18.01, TeraTerm (windows), GTKTerm (linux)

## Motivação

Softwares livres e de código aberto (free and open source ou FOSS do inglês) são um parte essencial da infraestrutura digital do mundo moderno. Existe uma grande diversidade de projetos deste tipo, com escopos e objetivos singelos ou arrojados e mantedores que vão de indivíduos ou pequenos grupos até empresas multinacionais, ou até mesmo grupos delas. Contudo, quando se trata de hardware existem poucos projetos maduros. Por isso a motivação desse tutorial foi explorar a arquiterura do processador RISC-V, que é uma arquitetura aberta e tem uma boa perspectiva para o futuro.

## Risc-V

Risc-V é uma arquitetura de instrucões aberta que é baseada nos princípios RISC. Por isso ele tem um número de instruções reduzidas quando comparado com processadores do tipo CISC.

Como não é nosso objetivo desenvolver uma implementação do RISC-V, precisamos clonar o [Risc-V](https://github.com/stnolting/neorv32)

## Hello World

- Criar um projeto no Quartus usando o [neorv32_test_setup_bootloader.vhd](https://github.com/stnolting/neorv32/blob/master/rtl/test_setups/neorv32_test_setup_bootloader.vhd) como topLevel
- Adcionar todos os arquivos do [rtl/core](https://github.com/stnolting/neorv32/tree/master/rtl/core) no projeto
- Também adicionar todos os arquivos `*.default.vhd` encontrados em [rtl/core/mem](https://github.com/stnolting/neorv32/tree/master/rtl/core/mem)
- No Quartus adicione todos os arquivos novos à uma biblioteca chamada `neorv32`
- No topLevel trocar a CLOCK_FREQUENCY para 50 MHz (50e6) no generic
- No mesmo arquivo, adcionar um not na [linha](https://github.com/stnolting/neorv32/blob/master/rtl/test_setups/neorv32_test_setup_bootloader.vhd#L102) 102, pois os nossos LEDs são ligados em 0 e desligados em 1

### Pin Map

- clk_i : mapear para PIN_AF14
- rstn_i : mapear para PIN_AJ4 (botão mais a direita)
- gpio_o : mapear para PIN_AA24, PIN_AB23, PIN_AC23, PIN_AD24, PIN_AG25, PIN_AF25, PIN_AE24, PIN_AF24 (são os pinos dos leds, em vez do gpio)

### Compilando e embarcando

Após as mudanças feitas nos arquivos para adequá-los à placa escolhida devemos compilar o projeto criado usando o quartus e depois o embarcar na placa. Com isso, um dos LEDs deveria estar piscando!

## 8 bit-counter

### Toolchain

Como essse projeto vai utilizar uma arquitetura RISC-V, não podemos utilizar um compilador para outras arquiteturas, logo precisamos baixar um novo compilador/toolchain para o RISC-V.

- Baixar a [release](https://github.com/stnolting/riscv-gcc-prebuilt/releases) da toolchain mais rescente.
- Seguir o [tutorial](https://github.com/stnolting/riscv-gcc-prebuilt/blob/main/README.md) de instalação.

Para que a toolchain instalada possa ser usada nos próximos passos, o seu path deve ser adicionado ao ambiente. Adicionar esse comando ao .bashrc ou semelhante pode ser uma boa ideia.

```
$ export PATH:$PATH:/opt/riscv/bin
```

### Compilando

Vamos utilizar o [codigo de exemplo do repositorio](https://github.com/stnolting/neorv32/blob/master/sw/example/blink_led/main.c).
Para isso devemos ir ate neorv32/sw/example/blink_led e executar o comando: `make clean_all exe` que irá compilar o codigo e gerar um executável

### Programando

- Instalar o [TeraTerm](https://ttssh2.osdn.jp/index.html.en) (windows) ou [GTKTerm](https://github.com/Jeija/gtkterm.git) (linux)
- Abrir uma conexão com a porta Serial à placa e setar as seguintes confugurações:

| nome                               | valor |
| ---------------------------------- | ----- |
| baudrate                           | 19200 |
| data bits                          | 8     |
| stop bit                           | 1     |
| transmission/flow control protocol | none  |
| parity                             | none  |
| end of line                        | \r\n  |

- Aperte o botao0 para resetar a placa
- Aperte qualquer tecla no seu teclado para parar o bootloader
- Mande o comando de upload do executavel para a placa
- Selecione o arquivo compilado anteriormente
- Mande o comando de execute para a placa
- Os leds devem estar contando ate 8 bits

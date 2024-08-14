# Possíveis Problemas na Aula: Tutorial FPGA NIOS

Neste tutorial, usamos o Quartus para criar um projeto contendo um processador NIOS II.

Para tanto, fazermos uso de:

- Plataform Designer (antigo QSys);
  - Para instanciar e conectar os IPs do NIOS, memória, comunicação, etc…
- NIOS II Software Build Tools for Eclipse;
  - Para programar, em C, o processador e transferir o resultado para a placa FPGA.



## Plataform Designer

Para fazer as conexões entre os módulos do Plataform Designer,  deve-se clicar no circulo cinza nos cruzamentos de barramentos ou  sinais, conforme mostrado abaixo:

![Plataform_Designer_02](\Embarcados-Avancados\figs\Plataform_Designer_02.png)

**Plataform Designer**

A imagem acima é a conexão final utilizada no projeto.



## NIOS II Software Build Tools for Eclipse

### Lentidão no Eclipse

No Linux, o eclipse fica muito lento com a ampulheta durando vários minutos.

O problema está no uso do GTK 3. A solução é a alteração para o GTK 2. Para tanto, temos que editar o *eclipse.ini* que está dentro do diretório do Quartus 18, faça a busca pelo nome do  arquivo e adicione duas linhas antes da linha que contém a opção *–launcher.appendVmargs*, conforme mostrado abaixo:

```
--launcher.GTK_version
2
```

Ver detalhes em: https://stackoverflow.com/questions/65240134/nios-ii-ide-unsuably-slow



### Não Encontra o ID na Cadeia JTAG

Ao transferir o programa em *C* para o Kit FPGA, através da opção **Run :arrow_right:  Run**, pode ocorrer o seguinte erro:

<p align="left">![Erro de ID](\Embarcados-Avancados\figs\Erro_System_ID.png)**Erro de ID**</p>

Para resolver, pode-se ignorar a verificação do *ID* na configuração em **Run :arrow_right:  Run Configurations …**, conforme mostrado abaixo:

![Tela de Configuração](\Embarcados-Avancados\figs\Run_Configurations-02.png)**Tela de Configuração**

Caso ocorra o erro de *Time Stamp*, como mostrado abaixo, basta ignorá-lo na mesma tela de configuração mostrada acima.

<p align="left">![Erro de Time Stamp](\Embarcados-Avancados\figs\Erro_Time_Stamp.png)**Erro de Time Stamp**</p>



### Não Conecta com o NIOS para Transferir o Programa

Garanta que a sequência de trabalho seja:

- Gerar o projeto do NIOS no *Plataform Design* (antigo QSys);
- Compilar o projeto no Quartus e gravar no Kit FPGA;
- Gerar o BSP, no NIOS II Software Build Tools for Eclipse, e transferir o programa.
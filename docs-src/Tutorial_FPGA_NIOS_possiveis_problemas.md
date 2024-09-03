# Possíveis Problemas na Aula: Tutorial FPGA NIOS

Neste tutorial, usamos o Quartus para criar um projeto contendo um processador NIOS II.

Para tanto, fazermos uso de:

- Plataform Designer (antigo QSys);
  - Para instanciar e conectar os IPs do NIOS, memória, comunicação, etc…
- NIOS II Software Build Tools for Eclipse;
  - Para programar, em C, o processador e transferir o resultado para a placa FPGA.



## 1. Plataform Designer

Para fazer as conexões entre os módulos do Plataform Designer,  deve-se clicar no circulo cinza nos cruzamentos de barramentos ou  sinais, conforme mostrado abaixo:

![Plataform_Designer_02](\Embarcados-Avancados\figs\Plataform_Designer_02.png)

**Plataform Designer**

A imagem acima é a conexão final utilizada no projeto.



## 2. NIOS II Software Build Tools for Eclipse

### 2.1 - Lentidão no Eclipse

No Linux, o eclipse fica muito lento com a ampulheta durando vários minutos.

O problema está no uso do GTK 3. A solução é a alteração para o GTK 2. Para tanto, temos que editar o *eclipse.ini* que está dentro do diretório do Quartus 18, faça a busca pelo nome do  arquivo e adicione duas linhas antes da linha que contém a opção *–launcher.appendVmargs*, conforme mostrado abaixo:

```
--launcher.GTK_version
2
```

Ver detalhes em: https://stackoverflow.com/questions/65240134/nios-ii-ide-unsuably-slow



### 2.2 - Não Encontra o ID na Cadeia JTAG

Ao transferir o programa em *C* para o Kit FPGA, através da opção **Run :arrow_right:  Run**, pode ocorrer o seguinte erro:

<img style="float: center;" src="\Embarcados-Avancados\figs\Erro_System_ID.png">
**Erro de ID**

Para resolver, pode-se ignorar a verificação do *ID* na configuração em **Run :arrow_right:  Run Configurations …**, conforme mostrado abaixo:

![Tela de Configuração](\Embarcados-Avancados\figs\Run_Configurations-02.png)
**Tela de Configuração**

Caso ocorra o erro de *Time Stamp*, como mostrado abaixo, basta ignorá-lo na mesma tela de configuração mostrada acima.

<img style="float: center;" src="\Embarcados-Avancados\figs\Erro_Time_Stamp.png">
**Erro de Time Stamp**



### 2.3 - Não Conecta com o NIOS para Transferir o Programa

Garanta que a sequência de trabalho seja:

- Gerar o projeto do NIOS no *Plataform Design* (antigo QSys);
- Compilar o projeto no Quartus e gravar no Kit FPGA;
- Gerar o BSP, no NIOS II Software Build Tools for Eclipse, e transferir o programa.


## 3. Problemas com RAM

Apesar do instruction_master e data_master serem barramentos diferentes o programa pode não rodar se o barramentos s1 da OnChip Memory não estiver conectado a ambos barramentos.

Ao adicionar uma segunda OnChip Memory, para separar RAM de ROM, pode ocorrer dois problemas ao tentar executar programas no Nios II:

1. Erro ao baixar o ELF
2. ELF baixado com sucesso porém o programa não faz nada
    
### 3.1 - Solução Parte 1 (Platform Designer)


1. Adicionar uma segunda OnChip Memory (RAM)
2. Alterar a primeira OnChip Memory para tipo ROM
3. Conectar os dois barramentos em ambas memórias
4. Gerar novamente os endereços dos periféricos

![Plataform_Designer](\Embarcados-Avancados\figs\erros_ELF_plataform_designer.png)

### 3.2 Solução Parte 2 (Linker)

1. No eclipse entre em BSP Editor
2. Abra a aba Linker Script
3. Na seção Linker Memory Regions verifique se as memórias foram reconhecidas, caso contrario clique em restore default.
4. Na seção Linker Sections Regions clique em restore defaults.
5. Verifique se apenas o .text esta na memória ROM (como na imagem abaixo), caso contrario altere manualmente mantendo apenas o .text na ROM.

![BSP Editor](\Embarcados-Avancados\figs\erros_ELF_bsp.png) 




![Tamanho ELF](\Embarcados-Avancados\figs\tamanhoELF.jpeg) 


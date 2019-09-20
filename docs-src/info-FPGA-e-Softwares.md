# Infraestrutura / FPGA e SWs

Ao longo do curso iremos trabalhar principalmente com FPGAs SoC da Intel, o principal kit de desenvolvimento é o DE10-Standard que possui uma FPGA Cyclone V SoC.

O software de desenvolvimento para FPGAs Intel chama Quartus, e ele possui várias e várias versões e variações, baixar a indicada aqui para não correr o risco de ter que instalar tudo novamente.

## DE10-Standard

- [Site do fabricante](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&CategoryNo=205&No=1081&PartNo=2)

É um kit de desenvolvimento fabricado pela Terasic ao curso to $350 que possui em seu core uma FPGA Cyclone V com grande capacidade de memória e várias células lógicas, possui diversos periféricos que podem ser controlados ou pela FPGA ou pelo ARM do chip.

![](https://img11.shop-pro.jp/PA01053/865/etc/DE10-Standard_Front.jpg?cmsp_timestamp=20170421200223)

## Softwares

Devido a segunda parte do curso na qual iremos compilar e trabalhar com Linux embarcado a disciplina deve ser realizada (e os tutoriais vão nessa linha) no **Linux**, Windows até funciona para a primeira parte, mas depois não da mais para usar, MAC não é suportado pelo Quartus.

Para o desenvolvimento na disciplina:

- Ubuntu 18.04
- [Quartus 18.01 Standard](http://fpgasoftware.intel.com/18.1/?edition=standard): e os softwares que já vem nesse pacote.
- [SoC EDS](http://fpgasoftware.intel.com/soceds/18.1/?edition=standard&platform=linux&download_manager=dlm3)

Após instalar, seguir roteiro em (para o quartus funcionar no ubuntu):

- https://github.com/Insper/Z01.1/wiki/Infraestrutura-Detalhada#3---quartus-prime-e-modelsim

:heavy_check_mark: Linux
:no_entry_sign:  Windows
:no_entry_sign: MAC

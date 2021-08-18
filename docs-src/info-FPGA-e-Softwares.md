# Infraestrutura de HW e SWs

Ao longo do curso iremos trabalhar principalmente com FPGAs SoC da Intel, o principal kit de desenvolvimento é o DE10-Standard que possui uma FPGA Cyclone V SoC.

O software de desenvolvimento para FPGAs Intel chama Quartus, e ele possui várias e várias versões e variações, baixar a indicada aqui para não correr o risco de ter que instalar tudo novamente.


!!! note "Versão 2020-2 online"
    Vocês vão receber os seguintes materiais para trabalharem no curso de casa:
    
    - 1x FPGA DE10-Standard
    - 1x micro SDcard
    - 1x Adaptador microSD/USB
    - 1x NIC USB-Wifi

## HW - DE10-Standard

- [Site do fabricante](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&CategoryNo=205&No=1081&PartNo=2)

É um kit de desenvolvimento fabricado pela Terasic com valor de $350 que possui em seu core uma FPGA Intel Cyclone V - SoC com grande capacidade de memória e várias células lógicas, possui diversos periféricos que podem ser controlados ou pela FPGA ou pelo ARM do chip.

![](https://img11.shop-pro.jp/PA01053/865/etc/DE10-Standard_Front.jpg?cmsp_timestamp=20170421200223)

## Softwares

Devido a segunda parte do curso na qual iremos compilar e trabalhar com Linux embarcado a disciplina deve ser realizada (e os tutoriais vão nessa linha) no **Linux**, Windows até funciona para a primeira parte, mas depois não da mais para usar, MAC não é suportado pelo Quartus.

### Quartus Prime

!!! info
    Iremos usar o Quartus Prime Standard versão 19.1.

Junto com a instalação do quartus é instalado alguns outros softwares:

- Quartus: Desenvolvimento de projetos para FPGA
- Modelsim: Simulador para projetos HDL (VHDL/Verilog)
- NIOS II EDS: Plataforma eclipse para programação uC NIOS
- HLS: High-level synthesis 

!!! tip "Instalando"
    Faça o download das partes a seguir, e execute o binário do Quartus Prime que fará a instalação dos demais automaticamente.

    - [Quartus Prime Standard](https://download.altera.com/akdlm/software/acdsinst/19.1std/670/ib_installers/QuartusSetup-19.1.0.670-linux.run)
    - [ModelSim](https://download.altera.com/akdlm/software/acdsinst/19.1std/670/ib_installers/ModelSimSetup-19.1.0.670-linux.run)
    - [Cyclone V](https://download.altera.com/akdlm/software/acdsinst/19.1std/670/ib_installers/cyclonev-19.1.0.670.qdz)

!!! info "Licença"
    Iremos usar uma versão do quartus que necessita licença para funcionar, eu irei mandar por email as instruções.

:heavy_check_mark: Linux
:no_entry_sign:  Windows
:no_entry_sign: MAC

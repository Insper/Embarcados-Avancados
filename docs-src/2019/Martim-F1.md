# Martim F. José - FPGA na AWS

- Aluno: Martim Ferreira José
- Curso: Engenharia da Computação
- Semestre: 9
- Contato: 
- Link tutorial oficial: 
- Ano: 2019

!!! example "Hardware utilizado no tutorial"
    - Instância F1 na AWS

## Introdução

A AWS dispõem de instâncias F1, que são máquinas de alta performance que contém uma FPGA no barramento PCI, permitindo a execução de programas acelerados por meio de hardware personalizado. Para executar um programa em uma FPGA na nuvem, é preciso primeiro desenvolver, simular, depurar e compilar o código. Tudo isso é feito em uma instância de desenvolvimento, predefinida por uma [AMI](https://docs.aws.amazon.com/pt_br/AWSEC2/latest/UserGuide/AMIs.html) (Amazon Machine Image) fornecida pela AWS. Na instância de desenvolvedor, o programa é compilado e é gerada uma imagem para a FPGA Xilinx presente na instância F1.

O programa a ser implementado na FPGA pode ser desenvolvido utilizando três ambientes de desenvolvimento diferentes, documentados a seguir:

|              Development Environment               |                                                                                Description                                                                                 |       Accelerator Language       |
| :------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------: |
| Software Defined Accelerator Development - SDAccel | Development experience leverages an optimized compiler to allow easy new accelerator development or migration of existing C/C++/openCL, Verilog/VHDL to AWS FPGA instances | C/C++/OpenCL, Verilog/VHDL (RTL) |
|       Hardware Accelerator Development - HDK       |                Fully custom hardware development experience provides hardware developers with the tools required for developing AFIs for AWS FPGA instances                |           Verilog/VHDL           |
|    IP Integrator or High Level Synthesis (HLx)     |                                     Graphical interface development experience for integrating IP and high level synthesis development                                     |          Verilog/VHDL/C          |

Pela facilidade e maior conhecimento de C++, opta-se pela escolha do ambiente SDAccel. Portando, o programa a ser implementado é programado em sua maioria em C++ utilizando a arquitetura OpenCL, que é amplamente utilizada na programação de alto desempenho em diversas plataformas.

Este tutorial faz a implementação do exemplo Hello World, que consiste na adição de dois vetores. O código deste exemplo pode ser examinado a fundo no seguinte repositório: https://github.com/Xilinx/SDAccel_Examples/tree/a41b58921188ad90ace2d34a22a2513d8f74b549/getting_started/host/helloworld_ocl

No repositório há dois arquivos na pasta `src`: `host.cpp` e `vector_addition.cl`, que correspondem ao programa da máquina e ao kernel da FPGA, respectivamente. 

O arquivo host consiste em um programa C++ em que:

- São definidos três vetores: A, B e results.
- A placa Xilinx é selecionada e adicionada para o contexto da execução. 
- O binário do kernel é carregado e adicionado para um programa
- Para migrar os dados entre host e device, são criados dois buffers de leitura referenciando A e B; E um buffer de escrita referenciando result. 
- Os dados armazenados nos buffers de leitura são transferidos da memória da máquina para memória da FPGA.
- O kernel é extraído do programa, os argumentos são determinados (result, A, B, tamanho) e ele é lançado.
- Os resultados são requisitados da FPGA e armazenados no buffer de escrita.
- E por fim, o resultado recebido é comparados com o resultado esperado.

O arquivo do kernel consiste em uma função em OpenCL que:

- Recebe quatro argumentos (result, A, B, tamanho)
- Define os arrays A e B
- Percorre os arrays recebidos como argumento, populando os arrays declarados
- Percorre o tamanho das arrays escrevendo no buffer de escrita (result) a soma de A e B em cada índice.

### Aplicações

As instâncias com FPGA são amplamente utilizadas em situações em que há uma grande quantidade de dados e o processamento precisa ser feito com rapidez. O desenvolvimento de um hardware personalizado para executar um programa fornece um custo de computação 30x melhor comparado com instâncias de CPU. Entre essas aplicações pode-se citar o encoding de video em tempo real e análise de risco financeiro.

### Custos

A instância de desenvolvimento m5.xlarge custa US$0.1920 por hora. E a instância f1.2xlarge custa US$1.65 por hora. A implementação deste exemplo é estimada consumir por volta de 3hrs da instância de desenvolvimento e meia hora da instância F1. Totalizando US$1.5.

## Passo a passo

### Referências

- https://aws.amazon.com/pt/ec2/instance-types/f1/
- https://github.com/aws/aws-fpga/blob/master/SDAccel/README.md#overview
- https://github.com/Xilinx/SDAccel_Examples/tree/a41b58921188ad90ace2d34a22a2513d8f74b549/getting_started/host/helloworld_ocl/src

### Pré-requisitos

Pré-requisitos: Ter uma conta na AWS com acesso ao EC2 e S3.

#### Configurando a AWS

Em seu computador, baixe a CLI da AWS configure suas credenciais:

`$ aws configure`

#### Instância de desenvolvedor

Para criar a instância de desenvolvimento, clique em Launch Instance e:
- Utilize a AMI chamada “FPGA Developer AMI”. 
- Utilize o flavor m5.xlarge ou m5.2xlarge (quanto mais núcleos e memória, mais rápido será a compilacão).
- Crie e salve sua Keypair.

#### Bucket setup

Para utilizar a imagem compilada da F1, é necessário salvá-la em um bucket, permitindo o seu acesso pelo serviço EC2. O bucket e suas pastas podem ser criados manualmente pela dashboard ou pela CLI:

```
$ aws s3 mb s3://embarcados-f1-tutorial --region us-east-1
$ touch FILES_GO_HERE.txt 
$ aws s3 cp FILES_GO_HERE.txt s3://embarcados-f1-tutorial/files/
$ touch LOGS_FILES_GO_HERE.txt 
$ aws s3 cp LOGS_FILES_GO_HERE.txt s3://embarcados-f1-tutorial/logs/
```

#### Setting up the dev house

Acesse a instância de desenvolvimento:

`ssh -i "<sua-keypair>.pem" <ip-da-máquina>`

Dentro da instância, clone o repositório, instale os drivers e bibliotecas necessárias e determine a plataforma de desenvolvimento:

```bash
$ git clone https://github.com/aws/aws-fpga.git $AWS_FPGA_REPO_DIR
$ cd $AWS_FPGA_REPO_DIR
$ source sdaccel_setup.sh
$ export AWS_PLATFORM=$AWS_PLATFORM_DYNAMIC_5_0 
```

Acesse a pasta do exemplo no diretório:

`$ cd $SDACCEL_DIR/examples/xilinx/getting_started/host/helloworld_ocl/ `

!!! warning ""
    Hora de compilar? NÃO

#### Check up

A compilação do programa demora 2h06min. Já imaginou desenvolver algo e cada vez que quiser testar ter que esperar 2h? E por isso que existem o emulador de software, que realiza uma rápida compilação e executa nos ciclos da CPU. E o emulador de hardware, que invoca o simulador de hardware do ambiente SDAccel e testa a funcionalidade do código a ser executado na FPGA.

Para emular o software:

```bash
$ make clean
$ make check TARGETS=sw_emu DEVICES=$AWS_PLATFORM all
```

Para emular o hardware:

```bash
$ make clean
$ make check TARGETS=hw_emu DEVICES=$AWS_PLATFORM all 
```

### Compilando!

O ambiente SDAccel também permite que o desenvolvedor compile tanto o binário da placa FPGA, quanto a aplicação host. Isso é feito por meio do mesmo Makefile:

```bash
$ make clean
$ make TARGETS=hw DEVICES=$AWS_PLATFORM all 
```

A compilação gera o arquivo binário para a FPGA Xilinx (*.xclbin) e o executável do programa host (exe), no nosso caso: `helloworld`.

#### Criação da Amazon FPGA Image (AFI)

Agora, é preciso gerar uma imagem FPGA que será inserida na placa presente na PCI da instância. O script abaixo salva o kernel da FPGA no bucket, cria a AMI no servidor da AWS e salva um arquivo de metadados com informações da imagem (`*.awsxclbin`), que também pode ser vistas no arquivo `*_afi_id.txt`.

```bash
$ $SDACCEL_DIR/tools/create_sdaccel_afi.sh -xclbin= xclbin/vector_addition.hw.xilinx_aws-vu9p-f1-04261818_dynamic_5_0.xclbin -o=vector_addition.hw.xilinx_aws-vu9p-f1-04261818_dynamic_5_0 \ -s3_bucket=embarcados-f1-tutorial -s3_dcp_key=files -s3_logs_key=logs
```

A criação da imagem não é imediata, seu processo demora e pode ser acompanhado pela CLI da AWS:
```bash
aws ec2 describe-fpga-images --fpga-image-ids <AFI ID (eg: afi-06d0ffc989feeea2a)>
```

Quando a criação da imagem for concluída, o *output* deverá ser:
```
                ...
                "State": {
                    "Code": "available"
                },
		        ...
```

Caso o código do status retorne como "failed", procure os logs em: `s3://embarcados-f1-tutorial/logs/`

#### Exportando o programa

Os arquivos necessários para executar o exemplo na FPGA são:

- `<nome-do-arquivo>.awsxclbin`
- `helloworld`

Portanto, copie-os para o bucket:

```
$ aws s3 cp <nome-do-arquivo>.awsxclbin s3://embarcados-f1-tutorial/files/
$ aws s3 cp helloworld s3://embarcados-f1-tutorial/files/
```

### Criando a instância F1

Para criar a instância F1, clique em Launch Instance e:

- Utilize a AMI chamada “FPGA Developer AMI”. 
- Utilize o flavor f1.2xlarge.
- Crie e salve sua Keypair.

### Executando

- Acesse a instância F1
- Repita o passo **Setting up the dev house**
- Acesse o diretório do repositório `cd $AWS_FPGA_REPO_DIR`
- Copie os arquivos salvos no bucket:

```
$ aws s3 cp s3://embarcados-f1-tutorial/files/<nome-do-arquivo>.awsxclbin ./
$ aws s3 cp s3://embarcados-f1-tutorial/files/helloworld ./
```

- Certifique-se que todos os arquivos possam ser achados na raiz do respositório
- `$ sudo -E /bin/bash`
- `$ source $AWS_FPGA_REPO_DIR/sdaccel_runtime_setup.sh`
- `chmod +x helloworld`
- `./helloworld`

Pronto! O programa host importou a imagem da FPGA do serviço AMI da AWS, criou os buffers para fazer a transferência de dados, determinou os argumentos e inseriu todo o kernel na placa.

!!! notes
     Adicionar log do resultado


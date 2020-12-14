# Coloque aqui o nome do tutorial de vocês

- **Alunos:** Vinicius Gomes de Lima / Lucca Delchiaro Costabile
- **Curso:** Engenharia da Computação
- **Semestre:** 8
- **Contato:**
- **Ano:** 2020

## Começando

Para seguir esse tutorial é necessário:

- **AWS:** [Login da AWS](https://aws.amazon.com/free)
  
## Motivação

Existem problemas em diversas áreas da computação hoje em dia que podem ser processados das mais diversas formas, a fim de que sua execuções fiquem o melhor e o mais dinamicas o possível.

Tecnologias como paralelização em CPU, uso de GPUs e TPUs são alguns dos mais famosos, no entanto, com o crescimento das áreas de cloud e hardwares dedicados, a junção destas tecnologias pode se provar extremamente eficiente na solução de alguns problemas

Este tutorial se propõe justamente a uma trazer um primeiro contato com um problema real - no caso da area de machine learning - que pode ser tratado com eficiência utilizando-se das tecnologias acima citadas.

## Introdução

Para a implementação da solução existem essencialmente dois ambientes de desenvolvimento SDAccel e o Vitis. Aqui vamos comparar a implementação do algoritmo de [metropolis](https://github.com/ggrizzly/MetropolisHastingsAlgorithm) em cada um  dos ambientes.

Ambos ambientes sao da Xilinx, sendo o SDAccel o mais antigo e o Vitis recentemente lançado (2 de Dezembro de 2019). Nao vamos entrar em muitos detalhes sobre o SDAccel pois ja existe um [tutorial de hello-world feito por Martim F. José](https://insper.github.io/Embarcados-Avancados/2019/Martim-F1/), nele eh detalhado um pouco da AWS, detalhes técnicos do SDAccel e como executar um hello world. Um detalhe relevante sobre o SDAccel eh que o kernel so pode ser feito em OpenCL, que para muitos desenvolvedores ja trás uma camada de abstração que facilita no desenvolvimento.

O vitis por sua vez, permite o desenvolvimento em python, C, C++, OpenCL e RTL, assim facilitando ainda mais o desenvolvimento e abrindo o caminho para mais desenvolvedores utilizarem essa ferramenta. Para aqueles que nao querem escrever a própria biblioteca, o vitis trás diversas bibliotecas prontas para uso em varias áreas, AI, visão, segurança, finanças quantitativas, banco de dados, etc.

Utilizando esses dois ambientes, vamos implementar o algoritmo de metropolis hastings em openCL no ambiente do SDAaccel e C++ no Vitis.

## Aplicações

O algoritmo de metropolis hastings é muito importante em machine-learning no tema de escolha de números aleatórios. No entanto ele requer uma grande quantidade de iterações tornando-o muito custoso em CPUs normais. E por isso a aplicação em fpga passa a ser importante no caso: as operações feitas pelo algoritmo são baratas para se fazer na fpga fazendo com que boas implementações devolvam amostras de números aleatórios em um tempo muito mais otimizado que em CPUs.

Esta aplicação é um bom exemplo de todo o conceito por trás de operações em fpga em cloud: encontrar algoritmos que possuem uma parte que fazem uma mesma operação diversas vezes e adaptar-los para que tais operações sejam feitas na fpga pois esta é ótima para realizar esta tarefa.

## Metropolis Hastings

O algoritmo implementado neste tutorial é o metropolis hastings, um método que de se obter amostras aleatórias de uma distribuição probabilística em que tal ato poderia ser difícil.

### O algoritmo

Considere f(x) como uma função proporcional a distribuição probabilística p(x) que se deseja chegar.

O método consiste em:

  1. Escolher um valor inicial arbitrário para x0 e uma distribuição arbitraria g(x|y) que sugere um candidato para o próximo valor da amostra x, dado o valor da amostra anterior y.
  2. Para todo valor i de 1 até um grande número m vamos repetir os seguintes passos:
     1. Encolher um candidato x' ~ g(x' | x(i))
     2. Calcular a taxa de aceitação a = f(x')/f(x(i)) . Como f é proporcional à densidade de P, temos que a = f(x')/f(x(i)) = p(x')/p(x(i))
     3. Com o valor de a em mãos
        1. Gere um número aleatório uniforme u ∈ [0,1]
        2. Se u <= a aceite o candidato definindo x(i+1) = x'
        3. Se u > a rejeite o candidato e faça  x(i+1) <- x(i)

### Explicação

No algoritmo, o que acontece é que ao pegarmos elementos da da distribuição g, o passo 2c atua como um corretor já que g não é a distribuição alvo. Ou seja, a cada iteração se checa se o movimento é vantajoso para que a distribuição se aproxime mais de p e so se aceita o valor em caso positivo.

??? info

    Se tiver mais curiosidades sobre o algoritmo vale a pena dar uma olhada nesse vídeo.

    <iframe width="1280" height="720" src="https://www.youtube.com/embed/0lpT-yveuIA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Criação das instâncias

Primeiramente é necessário criar na própria interface da AWS duas instâncias f1.2xlarge  (instâncias com FPGA) e duas m5.large (instâncias de desenvolvimento). Para cada tipo de instância faça uma com a AMI ```FPGA Developer AMI 1.9.1``` (Vitis) e outra com a AMI ```FPGA Developer AMI 1.7.1```(SDAccel).

!!! note

    Para as instâncias de desenvolvimento, quanto mais vCPUs, mais rápido será compilado o programa. 
    
    ??? warning
        - Prestar atenção nas AMIs utilizadas. Nao é possível compilar um programa em vitis na versão 1.7.1, assim como SDAccel em 1.9.1. 
        - Utilizar no mínimo 100GB para as instâncias de desenvolvimento, pois o processo de compilação utiliza muita memoria.

Também clone o repositorio https://github.com/Veronur/TuttorialEmbarcados/blob/master/docs-src/index.md

#### Na instância de desenvolvimento

??? note

    Foi utilizado a estrutura de pastas do próprio repositório, os arquivos foram editados diretamente no ```src/``` para reaproveitar o makefile ja configurado.

Os passos para preparar o ambiente e rodar a simulação sao parecidos.

    1. git clone https://github.com/aws/aws-fpga.git $AWS_FPGA_REPO_DIR
    2. cd $AWS_FPGA_REPO_DIR
    3. source sdaccel_setup.sh / vitis_setup.sh (depende do ambiente que esta trabalhando)
    4. cd
        1. SDAccel/examples/xilinx_2019.1/getting_started/hello_world/helloworld_ocl/
        2. Vitis/examples/xilinx/hello_world
    5. Substitua o conteúdo do src com o conteúdo do github clonado
    6. make clean
    7. Simulando em software e hardware
        1. make check TARGETS=sw_emu DEVICE=$AWS_PLATFORM all
        2. make check TARGETS=hw_emu DEVICE=$AWS_PLATFORM all

!!! warning

    Caso aconteça um erro de _DEVICE_ nao encontrado, mude o parâmetro DEVICE= para DEVICES=

Com o programa testado, esta na hora de compilar de verdade.

!!! note

    A compilação pode demorar algumas horas.

     1. make clean
     2. make TARGETS=hw DEVICES=$AWS_PLATFORM all
     3. Va tomar um cafe

Com a compilação finalizada serão gerados dois arquivos, o executável metropolis e o binário para a FPGA .xclbin. Transfira ambos para a instância f1.

#### Na instância de FPGA

Com os arquivos transferidos, execute os passos 1 - 2 da parte anterior e em seguida execute:

 1. source sdaccel_runtime_setup.sh / vitis_runtime_setup.sh
 2. chmod +x metropolis
 3. ./metropolis

??? note
    Pode ser necessario executar o ultimo passo como "./metropolis .xclbin"

### Implementação dos Kernels

Para ambas implementações existe um arquivo host em C++ que consiste em preparar o ambiente.

1. Criar os vetores
2. Criar o _Context_ e o _Command Queue_
3. Encontrar os binários
4. Alocar memoria para a FPGA
5. Extrair o kernel do programa carregado
6. Definir os argumentos do kernel
7. Iniciar o kernel
8. Transferir os resultados da FPGA para CPU

A diferença está no kernel que, como foi dito, enquanto em SDAccel o código eh feito em OpenCL, no vitis foi feito totalmente em C++.

!!! note
    A sintaxe de OpenCL é muito parecida a de C++.

    Nos códigos a seguir estão apenas a parte principal do código, o resto são apenas definições de constantes.

### Vitis

    extern "C" {
        void vector_add(const double *random1, // Read-Only Vector 1
            const double *random2, // Read-Only Vector 2
            double *c,     // Output Result
            int n_elements                 // Size in integer
            ) {

            double p, r;

            for (int i = 0 ; i < n_elements ; i += 1) {
            #pragma HLS LOOP_TRIPCOUNT min = c_len max = c_len
                    
                double rn = r + random1[i]; //random value from -1 to 1
                double pn = q(rn);
                if (pn >= p) {
                        p = pn;
                        r = rn;
                } else {
                        double u = random2[i]; //random value from 0 to 1
                        if(u < (double) (pn/p)) {
                                p = pn;
                                r = rn;
                        }
                }
                c[i] = r;
            }
        }
    }

### SDAccel

    kernel __attribute__((reqd_work_group_size(1, 1, 1)))
    void vector_add(global double* c,
                    global const double* random1,
                    global const double* random2,
                    const int n_elements)
    {

        double p, r;

        __attribute__((xcl_loop_tripcount(c_len, c_len)))
        for (int i = 0 ; i < n_elements ; i += 1) {
            
            double rn = r + randoms1[i]; //random value from -1 to 1
            double pn = q(rn);
            if (pn >= p) {
                    p = pn;
                    r = rn;
            } else {
                    double u = randoms2[i]; //random value from 0 to 1
                    if(u < (double) (pn/p)) {
                            p = pn;
                            r = rn;
                    }
            }
            c[i] = r;
        }
    }

Nota-se que as sintaxes são realmente parecidas, a diferença está nas partes de otimização, no vitis é usado o _pragma_, recurso utilizado em outras bibliotecas como o CUDA, enquanto no SDAccel é utilizado o \_\_attribute__.

## Referencias

* https://en.wikipedia.org/wiki/Metropolis%E2%80%93Hastings_algorithm

* https://github.com/aws/aws-fpga

* https://www.xilinx.com/products/design-tools/vitis/vitis-platform.html#overview

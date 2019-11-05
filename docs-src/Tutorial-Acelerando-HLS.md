# Tutorial - Acelerando - HLS

HLS (High-Level Synthesis Compiler) é uma ferramenta de compilação que permite
criarmos um componente (hardware/ HDL) a partir de uma linguagem de programação
de alto nível (no caso c++). Essa ferramenta facilita muito o desenvolvimento, e
abstrai o hardware para software, porém ainda é preciso ter um conhecimento de
hardware para utilizar-lha.

## Intel

> The Intel® HLS Compiler is a high-level synthesis (HLS) tool that takes in untimed C++ as input and generates production-quality register transfer level (RTL) code that is optimized for Intel® FPGAs. This tool accelerates verification time over RTL by raising the abstraction level for FPGA hardware design. Models developed in C++ are typically verified orders of magnitude faster than RTL.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hEbfAU_1x8k" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## centos

!!! warning
    Eu só consegui fazer funcionar no centos6, minha solução foi a de executar
    um docker com centos, e instalar as dependências nele. Eu executo o HLS via o
    docker CLI. 
    
!!! note
    Para facilitar a vida, vamos disponibilizar uma imagem do docker já configurada.
    Veja com o seu professor como conseguir.

## HLS

Vamos gerar um componente que aplica um offset (proc) em uma imagem, para isso, esse
componente terá duas interfaces avalon de acesso a memória (AVALON-MM), na
primeira interface, iremos acessar a imagem original e na outra iremos escrever
a imagem processada. 

O nosso hardware terá o seguinte formato:

```
    |-----|         AXI
    | ARM | ===========================
    |-----|            |             |
                       |             |
                   |-------|     |-------|
                   |  Min  |     |  Mout |
                   |-------|     |-------|
           AVALON-MM   |             ^
                       V             |
                   |-------|         |
                   |  Proc |---------- AVALON-MM
                   | (HLS) |
                   |-------|  
```

- Min: Memória da FPGA onde iremos salvar a imagem original
- Mout: Memória na FPGA onde iremos salvar a imagem processada
- TH: Periférico criado pelo HLS

Para isso, iremos utilizar um sintax própria do HLS que define como em C qual
tipo de interface será utilizada no componente (lembre das interfaces AVALON,
memmory maped e streaming).

O HLS permite que validemos o código em duas camadas distintas: a primeira é
compilando o mesmo código que será sintetizado para arquitetura x86, com isso
conseguimos validar o algorítimo de forma mais rápida, a segunda é gerando o HDL
do componente e simulando via modelsim, tudo isso é feito de forma transparente
e automática pela ferramenta.

!!! note
    A simulação do hardware é custosa em termos de tempo de processamento e
    poder computacional, ela deve ser a ultima coisa a ser feita, antes de usar
    o componente no hardware. Valide antes compilando para x86 e então simule.
    
## Offset

A função a ser acelerada é a seguinte (`imgOffSet`):

``` c
#define OFFSET 50

// just for a NxN image
inline uint pxToMem(uint x, uint y, uint N){
  return(x+y*N);
}

component void imgOffSet(ihc::mm_master<unsigned char, ihc::aspace<1>, ihc::awidth<32>, ihc::dwidth<8>>& imgIn,
                         ihc::mm_master<unsigned char, ihc::aspace<2>, ihc::awidth<32>, ihc::dwidth<8>>& imgOut,
                         int N)
{
    for(int y=0; y < N; y++){
      for (int x=0; x < N; x++){
        int px = pxToMem(x,y,N);
        printf("%d \n", px);
        unsigned int tpx = ((unsigned int) imgIn[px])+OFFSET;
        if(tpx > 255)
          imgOut[px]= 255;
        else
          imgOut[px]= tpx;
   	 }
	}
}
```

Note que a função `imgOffSet` possui três argumentos: `imgIn`, `imgOut` e `N`.
Os dois primeiros são ponteiros de memória, que é respectivamente onde o
componente vai fazer a leitura da imagem e onde ele vai fazer a escrita da
imagem. Já o argumento `N` não tem tipo definido, e será convertido para um
`conduit`, que deverá ser tratado em nível de hardware.

Além dessas entradas e saídas, para cada interface do tipo `mm_master` o HLS vai
criar mais um `conduit`, que será o offset de endereço na qual ele deve acessar
o dado (para a função o endereço 0 é relativo). E mais dois `conduits`, um para
controlar o inicio do processamento (chamada de função/ `call`) e outro para
informar sobre o status do processamento (`return`).

Um hardware auxiliar deve ser criado a fim de controlar esse periférico.

### `imgIn` , `imgOut`

Os dois primeiros argumento são do tipo `ihc::mm_master< unsigned char,` que significa que serão
traduzidos para um barramento do tipo `Avalon` e que devem ser tradados como
`unsigned char`. 

- `ihc::aspace<n>`: e um identificador único do barramento (1,2,3,4,...)
- `ihc::awidth<32>`: Define o tamanho do barramento de endereço, nesse caso 32 bits
- `ihc::dwidth<8>`: Define o tamanho do barramento de dados, nesse caso 8
  (leitura de 8 bits)
- Existem outras configurações do barramento que podem ser feitas nessa
  declaração: latência/ waitrequest/ burst/ (`, ihc::latency<0>, ihc::maxburst<8>, ihc::waitrequest<true> `)...
  
### `pxToMem()`

Para facilitar o desenvolvimento, a função `pxToMem(x,y,N)` traduz um acesso a
px por endereço na matriz para o endereço de memória do px.

### `printf`

Essa função será removida quando a função for compilada para hardware, ela só
está disponível para simulação e testes.

### main.c

A fim de validarmos o projeto, devemos criar uma função main (que não será
compilada para o hardware). Nessa função, abrimos um arquivo de imagem no
formato `.pgm` ("in.pgm")  e geramos outro arquivo de imagem, com a imagem
original processada ("out.pgm"). A fim de validarmos o componente a ser gerado (
`offSetImg()` ) devemos alocar duas regiões de memórias contínuas (`in[M_SIZE]`
e `out[M_SIZE)` que serão utilizadas como input do componente (simulando o
barramento AVALON).

``` c
int main(void) {

  int N = IMG_W;
  int M_SIZE = N*N;

  // create memorys
  unsigned char in[M_SIZE];
  unsigned char out[M_SIZE];
  memset(out,0,sizeof(out));

  /* -------------------------- */
  /* reading img to mem */
  /* -------------------------- */
  printf("loading img\n");
  readImgPgm(IMG_IN, in);

  /* -------------------------- */
  /* create fake memorys components*/
  /* -------------------------- */
  ihc::mm_master<unsigned char, ihc::aspace<1>, ihc::awidth<32>, ihc::dwidth<8>>mm_in(in, M_SIZE);
  ihc::mm_master<unsigned char, ihc::aspace<2>, ihc::awidth<32>, ihc::dwidth<8>>mm_out(out, M_SIZE);

  /* -------------------------- */
  /* process with kernel */
  /* -------------------------- */
  printf("kernel\n");
  imgOffSet(mm_in, mm_out, N);

  /* -------------------------- */
  /* img out */
  /* -------------------------- */
  printf("outputing \n");
  writeImgPgm(IMG_OUT, out)

  return 0;
}
```


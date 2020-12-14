# Soc & Python

- **Alunos:** Gustavo Braga, Henry Rocha e Thomas Queiroz
- **Curso:** Engenharia da Computação
- **Semestre:** 6
- **Contato:** gustavobb@al.insper.edu.br henryfr1@al.insper.edu.br thomasqbs@al.insper.edu.br
- **Ano:** 2020

## Começando

Para seguir esse tutorial é necessário:

- **Hardware:** Raspberry Pi
- **Softwares:** Python >= 3.5

## Motivação

Os sistemas embarcados são utilizados com muita frequência no dia a dia para tarefas diversas. Para tarefas que exigem um alto processamento e alta performance, as linguagens que geralmente são utilizadas são as de baixo nível, como por exemplo o C. Por estar mais próxima da linguagem de máquina, isso a torna muito rápida, mas também muito mais complexa de ser utilizada para desenvolvimentos grandes. Por sua vez, o Python é considerado uma das linguagens mais fáceis e intuitivas de serem aprendidas. Porém, como o seu nével é alto, sua performance é muito pior do que outras linguagens, o que a impossibilita de ser utilizada em sistemas embarcados que exigem alta performance, principalmente por conta de restrições de hardware.

Dito isso, seria muito bom conseguir o melhor dos dois mundos: uma linguagem rápida e que seja fácil de escrever. Para isso, devemos montar um módulo em Python escrito em C, dessa forma podemos utilizá-lo e não perder performance ao escrever Python. Em outras palavras, podemos escrever programas complexos que irão rodar em sistemas embarcados em Python, facilitando o desenvolvimento.

## Introdução

Existem diversos modos de extender as funcionalidades do Python. Um desses modos é criar uma biblioteca em C. Esse método leva a aumento de performance, além de possibilitar a chamada de funções e bibliotecas C, em um nível baixo.

Um módulo em Python pode ser considerado como uma biblioteca, que pode ser importada e utilizada em código por um programa. Exemplos de módulos famosos em Python são _math_, _OpenCV_, _Numpy_, entre outros. O _OpenCV_ por exemplo, exige muitas operações e poder computacional, por isso é implementada em C.

Nesse tutorial, vamos ver como criar um módulo em C que implementa o Bubble Sort, e, posteriormente, comparar sua performance contra o mesmo algoritmo feito em Python na Raspberry Pi. O Bubble sort foi escolhido pois sua complexidade é O(n^2) no médio e no pior caso, por isso a comparação é muito mais fácil de ser visualizada.

## Montando um módulo

De modo a suportar extensões, o Python API defines um grupo de funções, macros e variáveis que proveem acesso a várias parte do _run-time_ do Python. O Python API é incorporado em um arquivo em C usando o _header_ "Python.h".

Vamos começar criando um novo arquivo em C.
```sh
touch pysoc.c
```

Devemos então incluir as bibliotecas Python. Basta colocar essas duas linhas no começo do arquivo.
```c
// Configura o tamanho das variáveis para
// usar "Py_ssize_t" ao invés de "int" do C.
#define PY_SSIZE_T_CLEAN
// Inclui a biblioteca do Python.
#include <Python.h>
```

Em seguida vamos definir a função responsável por realizar o Bubble Sort.
Essa função é como qualquer outra função em C. Ela recebe um vetor (v) e o tamanho dele (n)
```c
static void bubble_sort(long v[], long n) {
    for (ssize_t i = n - 1; i > 0; i--) {
        bool swapped = false;

        for (ssize_t j = 0; j < i; j++) {
            if (v[j] > v[j + 1]) {
                long temp = v[j];
                v[j] = v[j + 1];
                v[j + 1] = temp;
                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }
    }
}
```

Agora devemos criar uma função _wrapper_ para essa função. Essa será a função que pode ser chamada dentro do Python.
Para definir tal função, é necessário o uso de objetos especias, vindos do Python API.

!!! note
    Dentre os objetos especiais, o mais notável é o `PyObject`.

    Ele é uma estrutura de objeto usada para definir os tipos de objetos para o Python. Todos os objetos Python compartilham algumas informações que são definidas por essa estrutura e todos os outros objetos são uma extensão dela.

    Esse objeto diz ao interpretador do Python como ele deve tratar objetos e seus ponteiros. Por exemplo, configurar o retorno de uma função como um `PyObject` possibilita que o interpretador reconheca esse retorno um tipo de variável válido de Python.


Vamos começar definindo a função.

```c
PyObject *pysoc_bubble_sort(PyObject *self, PyObject *args) {
}
```

Aqui estamos criando uma função chamada `pysoc_bubble_sort`, que retorna um `PyObject` e tem dois parâmetros, `self` e `args`, ambos `PyObject`.

O argumento `self` aponta para o objeto do módulo para funções nível módulo.
Caso essa função fosse um método de uma clase, apontaria para uma instância do objeto.


Já o argumento `args` é um ponteiro para uma tupla do Python, contendo todos os argumento da função.
Todos os items da tupla são objetos Python e para que possam ser usados em nossa função C devemos convertê-los para valores C.
Para realizar essa conversão existe a função `PyArg_ParseTuple()`. Ela checa os tipos dos argumetos e os converte para valores C.


Como a função que vamos criar é o Bubble Sort, o único argumento que vamos receber será a própria lista de valores a serem ordenados.
Vamos então pegar o tamanho da lista passada, que é o primeiro argumento da função `bubble_sort` definida anteriormente.

```c
PyObject *pysoc_bubble_sort(PyObject *self, PyObject *args) {
    // Declarando a variável que guardará a lista de valores.
    PyObject *int_list;
    // Verificando se foi realmente passado uma lista como argumento
    // caso contrário, retorne NULL.
    if (!PyArg_ParseTuple(args, "O", &int_list)) return NULL;
    // Calculando o tamanho da lista passada.
    Py_ssize_t n = PyObject_Length(int_list);
    // Caso o tamanho seja negativo, retorne NULL.
    if (n == -1) return NULL;
}
```

Como a API do Python não disponibiliza uma função que converta uma lista de Python para um vetor em C, devemos fazer tal conversão manualmente.
O código a seguir realiza essa conversão.

```c
// Declarando o vetor em C. O tamanho foi obtido anteriormente.
long v[n];
// Loop que passa por todos os items da lista passada.
for (Py_ssize_t i = 0; i < n; i++) {
    // Pegando o item "i" da lista.
    PyObject *val = PyList_GetItem(int_list, i);
    // Transformando esse item em um "long" do C.
    long lval = PyLong_AsLong(val);
    // Caso esse valor seja negativo, ocorreu um erro e devemos retornar NULL.
    if (lval == -1) return NULL;
    // Inserir o item convertido na lista.
    v[i] = lval;
}
```

Agora que temos o tamanho do vetor (`n`) e o vetor em si (`v`) podemos chamar a função `bubble_sort`.

```c
bubble_sort(v, n);
```

Com o término da função, teremos um vetor em C ordenado em ordem crescente.

Agora devemos retornar esse vetor ordenado. Para que o valor retornado possa ser interpretado pelo Python posteriormente devemos transformar esse vetor em um PyObject, mais especificamente, uma lista.

Para isso vamos criar uma nova lista com o tamanho `n`.

```c
PyObject *ret_list = PyList_New(n);
```

Em seguida, vamos passar por cada item do vetor em C e convertê-lo em PyObject também, mas dessa vez passando para um tipo _Long_ do Python.

```c
for (Py_ssize_t i = 0; i < n; i++) {
    // Converte o valor em C para um tipo Long do Python.
    PyObject *pl = PyLong_FromLong(v[i]);
    // Caso esse valor seja NULL, ocorreu um erro
    // e devemos sair da função.
    if (pl == NULL) return NULL;

    // Inserindo o valor convertido na lista do Python
    // e verificando se o retorno dessa função foi -1,
    // indicando um erro.
    if (PyList_SetItem(ret_list, i, pl) == -1) return NULL;
}
```

Feito isso, já podemos retornar a lista ordenada.

```c
return ret_list;
```

Após declarar a função `pysoc_bubble_sort` precisamos também indicar ao Python a função de inicialização do módulo.
Todo módulo precisa de uma função que retorna um `PyMODINIT_FUNC` e que, por convenção, vamos chamá-la de `PyInit_pysoc`.

A seguir está a função mais simples que incializa um módulo. Ela apenas chama o `PyModule_Create` e retorna o resultado dessa função.

```c
PyMODINIT_FUNC PyInit_pysoc(void) {
    PyObject *m = PyModule_Create(&pysocmodule);
    return m;
}
```

Se quisermos inicializar o módulo de uma forma que tenha um erro específico ao módulo precisamos realizar
alumos outras etapas durante na função `PyInit_pysoc`.


```c
PyMODINIT_FUNC PyInit_pysoc(void) {
    PyObject *m = PyModule_Create(&pysocmodule);
    if (m == NULL) return NULL;

    PysocError = PyErr_NewException("pysoc.PysocError", NULL, NULL);
    Py_XINCREF(PysocError);
    if (PyModule_AddObject(m, "PysocError", PysocError) < 0) {
        Py_XDECREF(PysocError);
        Py_CLEAR(PysocError);
        Py_DECREF(m);
        return NULL;
    }

    return m;
}
```

Nesse caso foi definido um erro chamado de PysocError. Apenas toda chamada de função devemos verificar se ela sucediu e, caso contrário, retornamos NULL.

A seguir está uma função se sempre da raise no erro PysocError

```c
PyObject *pysoc_raise_pysoc_error(PyObject *self, PyObject *args) {
    PyErr_SetString(PysocError, "Error from C");
    return NULL;
}
```

!!! note
    Sempre que uma função falha/dá raise em um erro ela deve retornar NULL.


Se você parou para ler o código do PyInit_pysoc pode ter percebido que há uma coisa estranha,
a variável `PysocError` não tem um tipo definido. Isto é porque ela está no arquivo `pysoc.h`.
Pelo fato da variável `PysocError` indicar um erro, ela precisa ser acessada por várias funções que
não recebem nenhuma variável extra como argumento e, por isso, é necessário que a variável seja
global.

Aqui está o início de do arquivo `pysoc.h`
```c
#define PY_SSIZE_T_CLEAN
#include <Python.h>

static PyObject *PysocError;
```

Nesse arquivo também estão todas as definições (prototypes) das funções.
Quase todas as funções retornam um `PyObject *` e recebem `PyObject *self` e `PyObject *args`
como parâmetros.

```c
PyObject *pysoc_bubble_sort(PyObject *self, PyObject *args);
PyObject *pysoc_raise_pysoc_error(PyObject *self, PyObject *args);
```

Depois disso precisamos definir um array que vai indicar ao Python informações importantes sobre
todas as funções do módulo.

```c
static PyMethodDef PysocMethods[] = {
    {"bubble_sort", pysoc_bubble_sort, METH_VARARGS, "Bubble sort in c"},
    {"raise_pysoc_error", pysoc_raise_pysoc_error, METH_NOARGS, "Raises PysocError"},
    {NULL, NULL, 0, NULL} /* Sentinel */
};
```

O array `PysocMethods` é composto de objetos `PyMethodDef`. Esse objeto tem como seu primeiro
parâmetro o nome da função que vai ser utilizado dentro do Python. O segundo parâmetro é um
ponteiro que indica onde está a função (em C isso significa apenas passar o nome da função).
O terceiro parâmetro é o mais importante, ele define a quantidade de argumentos que a função recebe.
No caso a função `pysoc_bubble_sort` recebe algum argumento e, então, tem o tipo `METH_VARARGS`.
Se houvesse uma função que não recebe nenhum argumento seria `METH_NOARGS`. O quarto parâmetro é
apenas uma string de help que indica o que a função faz.

É possível fazer coisas muito mais específicas, porém não é necessário cobrir tudo para fazer um
simples bubble sort. A documentação mais detalhada do `PyMethodDef` pode ser encontrada
[aqui](https://docs.python.org/3/c-api/structures.html?highlight=pymethoddef#c.PyMethodDef).

!!! note
    Se o terceiro parâmetro não for especificado corretamente, uma função que não recebe argumentos
    vai rodar apenas se um argumento (ou mais) for passado e uma função que recebe argumentos vai
    rodar apenas se não receber argumentos.

!!! note
    O array de `PyMethodDef` deve sempre terminar com `{NULL, NULL, 0, NULL}`. Isso acontece porque em C quando um vetor é referenciado não é possível saber seu tamanho e, por isso, é necessário ter alguma coisa que determina o seu fim. Algo muito parecido é feito com strings em C (um vetor de chars), já que todas possuem um byte 0 ('\0') para indicar que ela acabou.


Para finilizar a declaração do módulo é necessário declarar o seguinte struct que referencia a
variável `PysocMethods` explicada acima.

```c
static struct PyModuleDef pysocmodule = {PyModuleDef_HEAD_INIT, "pysoc", /* name of module */
                                         NULL, /* module documentation, may be NULL */
                                         -1,   /* size of per-interpreter state of the module, or -1
                                                  if the module keeps state in global variables. */
                                         PysocMethods};
```

Mais informações a criação de um módulo podem ser achadas na
[documentação oficial do Python](https://docs.python.org/3/extending/extending.html?highlight=pymoduledef)


E com isso a parte em C do nosso módulo está completo!

## Instalando o módulo

Existem alguns jeitos para realizar a compilação e instalação do módulo, porém o
melhor documentado é o `distutils`. Ele funciona a partir de um arquivo `setup.py` que especifica
como o projeto é estruturado.

```py
#!/usr/bin/env python3
from distutils.core import setup, Extension

module1 = Extension("pysoc", sources=["pysoc.c"])

setup(
    name="pysoc", version="1.0", description="Python module for SoC subject", ext_modules=[module1]
)
```

Para esse caso foi necessário apenas utilizar um módulo que constitui de apenas um arquivo, o
`pysoc.c` (apesar de essencial o arquivo `pysoc.h` não é utilizado nessa parte). A classe
Extension é bem versátil e nela podem ser espeficadas bibliotecas externas e flags de compilação.

Para compilar e instalar é necessário rodar os seguintes comandos

```sh
python3 setup.py build
python3 setup.py install --user
```

## Rapidez do módulo - comparação entre C e Python

Para iniciar a comparação, necessitamos de uma implementação do bubble sort em Python. Ela pode ser vista a seguir:

```py
from typing import List

def bubble_sort(v: List[int]) -> List[int]:
    n: int = len(v)

    for i in range(n - 1, 0, -1):
        swapped: bool = False
        for j in range(0, i):
            if v[j] > v[j + 1]:
                v[j], v[j + 1] = v[j + 1], v[j]
                swapped = True

        if not swapped:
            break
    return v
```

Com o bubble sort em Python e o bubble sort em C, podemos comecar a comparação. Configuracoes iniciais do arquivo:

```py
import time
import pysoc
import bubble
```

Utilizaremos agora a implementação em Python primeiro. Como pode ser visto abaixo, foi criada uma lista de 0 ate 100000 ao contrario, para podermos pegar o pior caso do algoritmo. Logo em seguida marcamos o tempo inicial e chamamos a função. Assim que ele termina, marcamos o tempo final e printamos o tempo que o codigo levou para rodar.

```py
l = list(reversed(range(int(1e5))))
print("== Python ==")
time1 = time.time()
l1 = bubble.bubble_sort(l)
time0 = time.time()
print(f"> {time0 - time1} seconds")
```

Agora para nosso módulo implementado em C, faremos quase o mesmo codigo, que pode ser visto a seguir.

```py
l = list(reversed(range(int(1e5))))
print("== C ==")
time3 = time.time()
l2 = pysoc.bubble_sort(l)
time2 = time.time()
print(f"> {time2 - time3} seconds")
```
Juntando todo programa em um so:

```py
#!/usr/bin/env python3
import time
import pysoc
import bubble

l = list(reversed(range(int(1e5))))
print("== Python ==")
time1 = time.time()
l1 = bubble.bubble_sort(l)
time0 = time.time()
print(f"> {time0 - time1} seconds")

l = list(reversed(range(int(1e5))))
print("== C ==")
time3 = time.time()
l2 = pysoc.bubble_sort(l)
time2 = time.time()
print(f"> {time2 - time3} seconds")
print(f"\n> C is {(time0 - time1)/(time2 - time3)} times faster")
```

!!! note
    Com uma lista de tamanho 1e5 (100000) o código em Python leva aproximadamente 16 minutos
    para rodar. Para rodar apenas um simples teste considere mudar as ocorrências de 1e5 para 1e4

Se rodarmos o codigo

```sh
python3 comparacao.py
```

Conseguimos observar o seguinte output:

    == Python ==
    > 1059.0849022865295 seconds
    == C ==
    > 10.741474628448486 seconds

    > C is 98.59771948644497 times faster

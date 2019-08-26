# Entrega 3

Nessa entrega iremos melhorar o periférico recém criado adicionando mais funcionalidades a ele (pelo menos as necessárias). 

Modificações:

- Criar um registrador de configuração: `REG_CONFIG` onde deve ser possível ativar ou não o controle de um pino
- Permitir que um pino seja configurável como IN ou OUT pelo registrador `REG_SET_OUTPUT`
- Gerar interrupção 

1. registrador de configuração: `REG_CONFIG`
1. 


O periférico deve possuir um driver capaz de interagir com o periférico. Iremos padronizar algumas funções a fim de definirmos um padrão de interface:

Esse driver deve estar distribuído em dois arquivos: `NAME.c` e `NAME.h`. 


``` c
int NAME_init( ..... );          // Inicializa o periférico
int NAME_config( ..... );        // Configura o periférico 
int NAME_halt( ..... );          // Desativa o periférico 
int NAME_en_irq( ..... );        // Habilita interrupção
int NAME_disable_irq( ..... );   // Desabilita interrupção
int NAME_read_xxxxx( ..... );    // read data xxxx from device
int NAME_write_xxxxx( ..... );   // write data to xxxx device
```

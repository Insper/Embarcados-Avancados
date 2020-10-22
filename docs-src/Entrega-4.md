#  👁 Entrega 4

!!! success "2020-2"
    - Material atualizado.

O objetivo dessa entrega é automatizarmos a compilação e deploy de novos programas para o `target`. Para isso, teremos que criar um Makefile que deve ser capaz de compilar e fazer o deploy de programa. Para isso temos diversas opções, sendo alguma delas:

- Transferência de arquivo via ssh: [scp](http://www.hypexr.org/linux_scp_help.php)
- Montar do pasta do `target` no `host` remota via ssh: [sshfs](https://en.wikipedia.org/wiki/SSHFS)
- Via [gdb server](https://www.linux.com/news/remote-cross-target-debugging-gdb-and-gdbserver)
    - executa no `target` um gdb server que possibilita ao `host` transferir e debugar um binário.

Note que todas as soluções demandam de conexão com de rede, para isso,
siga o roteiro: [Info HPS Ethernet](Embarcados-Avancados/info-HPS-ethernet/).

## Rubrica:

??? tip "Entrega - google forms"
    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLScvVsml2iFkIOfIB3gskadaUad-5tnm6a7LGieXmocNEswqTw/viewform?embedded=true" width="700" height="300" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>

> Para testar, modifique o makefile do `BlinkLed`

- A 
    - Debuga um programar no target (via gdbserver)
- B
    - Via Makefile consegue executar o binário no `target`
        - *make run* / *make deploy*
- C
    - Criou um Makefile que compila o código e faz o deploy para o `target` de um programa
        - *make deploy*
- D 
    - Entregou somente os tutoriais
- I
    - Não entregou nada

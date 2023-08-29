# 🔔 HPS - Deploy 

!!! tip "Deliver"
    What should be delivered?
    
    - **DeadLine:** {{entrega_2_deadline}}
    - [Github Classroom]({{entrega_2_classroom}})
    - [Google forms]({{entrega_2_forms}})

The objective of this delivery is to automate the compilation and deployment of new programs to the `target`. For this, we will have to create a Makefile that should be able to compile and deploy a program. For this, we have several options, some of them being:

- File transfer via ssh: [scp](http://www.hypexr.org/linux_scp_help.php)
- Mount the `target` folder on the remote `host` via ssh: [sshfs](https://en.wikipedia.org/wiki/SSHFS)
- Via [gdb server](https://www.linux.com/news/remote-cross-target-debugging-gdb-and-gdbserver)
    - run a gdb server on the `target` that allows the `host` to transfer and debug a binary.

Note that all solutions require a network connection, for this follow the script: [Info HPS Ethernet](Embarcados-Avancados/info-HPS-ethernet/).

## Rubric

> To test, modify the Makefile of `BlinkLed`

- A (new) 
    - Makes uboot boot via tftp: https://ece453.engr.wisc.edu/u-boot-script/
- B
    - Debugs a program on the target (via gdbserver)
- C
    - Created a Makefile that compiles the code and deploys it to the `target` of a program
    - Via Makefile can execute the binary on the `target`
        - *make run* / *make deploy*
    - Puts a `README.md` in the folder that explains how to use it and what it does.
- D 
    - Delivered only the tutorials
- I
    - Did not deliver anything

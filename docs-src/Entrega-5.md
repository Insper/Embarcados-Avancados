# 🔔 HPS - Assignment 2

You must create an embedded system that includes a web server and a webpage that allows you to monitor and control the hardware through a simple interface.

The webpage should allow:

1. Control of the board's LED
1. Reading the status of the board's button

Hint: You will need to have a server (for example in Python) that will need to communicate with a C software (for control of the pins), one suggestion is to use a socket for communication between the two programs. Here is an example of how to do this:

- https://github.com/Insper/Embarcados-Avancados/tree/master/Entrega-5

## Rubric

### A

Any of the following options:

- Reading and displaying the board's IMU (hint: use example code ([hps_gsensor](https://github.com/Insper/DE10-Standard-v.1.3.0-SystemCD/tree/master/Demonstration/SoC/hps_gsensor)))
- Writing on the board's LCD (hint: use example code [hps_lcd](https://github.com/Insper/DE10-Standard-v.1.3.0-SystemCD/tree/master/Demonstration/SoC/hps_lcd))
- Or another cool idea (to be validated with the professor)

### B

- The web server deployment and configuration should be done via a makefile 
- The system should start automatically

### C

- A web server that allows:
    - control of the board's LED via a web button
    - reading of the board's switch status

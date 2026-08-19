# 🔔 Assessment 2 

::: tip Classroom
- [Github Classroom](https://classroom.github.com/a/6sCBBvw0)

:::
In this assignment, we will have the same functionality as [Assignment 1](/Entrega-1), but with the motor being controlled by the NIOS (soft processor).

For this, it will be necessary to modify the project created in the tutorial to have at least one more PIO peripheral (which will be responsible for reading the buttons). In addition to adding this new peripheral, in this assignment we will improve our system with:

- JTAG peripheral must generate an interrupt
- PIO peripheral that handles the button must generate an interrupt
- Program memory separated from data memory

Start by reading the buttons without interruption. Once it is working, use the following sites as a reference to implement interruption in NIOS:

## Rubric

- A 
    - Insert an RTOS in NIOS to control the application
- B
    - Implement `VEL` in SWx
    - Interrupt in button reading
    - Acceleration curve in the motor
- C
    - Data memory separated from program memory
    - PIO dedicated to reading buttons (SWx) and controlling `EN` and `DIR`
- D 
    - Delivered only the tutorial
- I
    - Did not deliver anything

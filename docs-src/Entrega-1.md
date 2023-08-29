# 🔔 FPGA - Assigment 1

!!! tip "Deliver"
    What should be delivered?
    
    - **DeadLine:** {{entrega_1_deadline}}
    - [Github Classroom]({{entrega_1_classroom}})
    - [Google forms]({{entrega_1_forms}})

The idea of this delivery is for you to work a little more with VHDL and also to remember/learn how to develop a project hierarchically. In this delivery, you will develop an IP core (intellectual property core) dedicated to controlling a stepping motor.

This component should control the four phases of a stepping motor (which you received with the kit) to rotate the motor in both directions and with some different speeds.

## Example

To facilitate development, a project and a component that control the stepping motor are available in the folder (`/Delivery1/`) in the discipline repository, but they do not perform everything that is being asked here. In this example, the stepping motor only rotates in one direction (`DIR` does not work), the `EN` signal does not control whether the motor will be turned on/off and the motor has only two speeds (`VEL`).

The pins have already been mapped and you should connect the motor as indicated below!

![](figs/Entrega-1:montagem.png)

!!! warning
    Be careful to avoid burning the board.

Final assembly:

![](figs/Entrega-1:montagem2.png){width=300}

!!! note "Schematic GPIO"
    Extracted from the manual:

    ![](figs/Entrega-1:gpio.png)

!!! example "TODO"
    After assembling, open the example project, compile and write to the FPGA. You should see the motor rotating.
    
    Play with switches 2 and 3, the motor speed should vary.

## Rubric

- A
    - Applies an acceleration curve to the speed.
- B 
    - Has a number of steps to be executed.
- C
    - Drives the stepping motor and has a signal to:
        - EN (which turns the motor on and off)
        - DIR (which controls the direction in which the motor rotates)
        - VEL[1:0] (four rotation speeds)
- D 
    - Delivered the tutorial
- I
    - Did not deliver anything.

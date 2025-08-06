# 🔔 Assessment 3

What should be delivered?

- **Folder:** `Entrega_3_FPGA_NIOS_IP`
- **Video** of the project working with an explanation (approx. 1.5 min)   

In this delivery, we will encapsulate the peripheral we created to control the stepper motor (`Entrega-1`) in Platform Designer (creating a memory-mapped peripheral) so that we have a dedicated component to control the motor.

## Hardware

The diagram below is an overview of what needs to be done. In this concept, we will "encapsulate" the IP developed in `Entrega-1` into a "memory-mapped peripheral" (`StepMotor-MM`). For this, it will be necessary to add extra logic, usually called `Glue Logic`, which interfaces between the bus and the IP.

![](figs/Entrega-3.png)

### Glue Logic

The control logic must interface with the Stepper Motor peripheral on all control signals (except the outputs (phase)), in order to abstract the memory-mapped access for the peripheral. The easiest way to do this is to assign functionalities to peripheral addresses, for example:

| Offset | Functionality | Type |
|--------|--------------|------|
| 0      | EN           | R/W  |
| 1      | DIR          | R/W  |
| 2      | VEL          | R/W  |
| ...    | ...          |      |

The table above maps each address of the peripheral to a different functionality. In this example, if the user wants to activate the motor, they must write to address 0 of this peripheral.

> Note that some addresses are Read Only and others are Read/Write (type). This is because it doesn't make sense (nor is it physically possible) to write to some addresses.

## (rubric C) Software

??? tip "Submission - google forms"
    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfQisAY242qZ7YgpRIeHXcmg_bz1qhaXUZAPM-HOlPiyYbWFQ/viewform?embedded=true" width="700" height="300" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>

In addition to the HW part, we will develop a C library that will abstract the interface with this peripheral. 
The peripheral must have a driver capable of interacting with it. We will standardize some functions to define a standard interface:

```c
// For rubric C
int motor_init( ..... );        // Initializes the peripheral
int motor_halt( ..... );        // Deactivates the peripheral 
int motor_en( ..... );          // Returns if there was any click
```

## (rubric A/B) Software (improving)

Add the following functions (each one + half a concept):

```c
// For rubric B/A
int motor_dir( ..... );      // sets direction
int motor_vel( ..... );      // sets speed
```
This driver should be distributed in two files: `motor.c` and `motor.h`.
This driver should be distributed in two files: `motor.c` and `motor.h`.

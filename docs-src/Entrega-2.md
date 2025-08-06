# 🔔 Assessment 2 

!!! tip "Deliver"
    What should be delivered?
    
    - [Github Classroom]({{entrega_4_classroom}})
    - [Google forms]({{entrega_forms}})

In this assignment, we will have the same functionality as [Assignment 1](/Entrega1/), but with the motor being controlled by the NIOS (soft processor).

For this, it will be necessary to modify the project created in the tutorial to have at least one more PIO peripheral (which will be responsible for reading the buttons). In addition to adding this new peripheral, in this assignment we will improve our system with:

- JTAG peripheral must generate an interrupt
- PIO peripheral that handles the button must generate an interrupt
- Program memory separated from data memory

Once the JTAG starts generating interrupts, it will no longer be necessary to use the JTAG *small driver*. Remember to change this in the **bsp**.

Start by reading the buttons without interruption. Once it is working, use the following sites as a reference to implement interruption in NIOS:

Tips:

- http://www.johnloomis.org/NiosII/interrupts/interrupt/interrupt.html
- https://www.altera.com/en_US/pdfs/literature/hb/nios2/n2sw_nii52006.pdf

## Rubric

??? tip "Submission - google forms"
    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfH7w1wPogmTPI-Vesg1lyC1sn3i7aVDBf8w5le2mImOCjZ8A/viewform?embedded=true" width="700" height="300" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>

- A 
    - Insert an RTOS in NIOS to control the application, **or**
    - Acceleration curve in the motor
- B
    - Implement `VEL` in SWx
    - Interrupt in button reading
- C
    - Data memory separated from program memory
    - JTAG generating interrupt
    - PIO dedicated to reading buttons (SWx) and controlling `EN` and `DIR`
- D 
    - Delivered only the tutorial
- I
    - Did not deliver anything

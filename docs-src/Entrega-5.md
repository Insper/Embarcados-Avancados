# 🔔 Assignment 5

!!! tip "Deliver"
    What should be delivered?
    
    - **DeadLine:** {{entrega_3_deadline}}
    - [Github Classroom]({{entrega_3_classroom}})
    - [Google forms]({{entrega_forms}})


You must create an embedded system that includes a web server and a webpage that allows you to monitor and control the hardware through a simple interface.

The webpage should allow:

1. Control of the board's LED
1. Reading the status of the board's button

Hint: You will need to have a server (for example in Python) that will need to communicate with a C software (for control of the pins), one suggestion is to use a socket for communication between the two programs. Here is an example of how to do this:

- https://github.com/Insper/Embarcados-Avancados/tree/master/Entrega-5

## Rubric

### Extras

Any of the following options:


- Reading and displaying the board's IMU (hint: use example code ([hps_gsensor](https://github.com/Insper/DE10-Standard-v.1.3.0-SystemCD/tree/master/Demonstration/SoC/hps_gsensor)))
- Writing on the board's LCD (hint: use example code [hps_lcd](https://github.com/Insper/DE10-Standard-v.1.3.0-SystemCD/tree/master/Demonstration/SoC/hps_lcd))

### A

Attach a webcam to the board and display the captured image on the webserver.

### B

Automate the Buildroot process so that it includes your server solution and any other necessary files every time you run Buildroot. For this, use the overlay solution and configure Linux to automatically run your server at boot time. To achieve this, you will need to:

- Use overlay to add your files to the image.
- Utilize overlay to create a script in /etc/init.d/ that will start the webserver at boot time.

### C

- A web server that allows:
    - control of the board's LED via a web button
    - reading of the board's switch status

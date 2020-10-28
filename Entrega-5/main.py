#!/usr/bin/python

import socket

host = "/tmp/9Lq7BNBnBycd6nxy.socket"

sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
sock.connect((host))

while 1:
        sock.sendall(bytes('ola!' + "\n", "utf-8"))
        received = str(sock.recv(1024), "utf-8")
        print(received)

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <unistd.h>

#define SOCKET_NAME "/tmp/9Lq7BNBnBycd6nxy.socket"

int main(int argc, char *argv[]) {

    int sock = 0, connfd = 0;
    char sendBuff[1025];
	char recvBuff[1025];
	memset(sendBuff, '0', sizeof(sendBuff));

    /*
     * In case the program exited inadvertently on the last run,
     * remove the socket.
     */
    unlink(SOCKET_NAME);

	sock = socket(AF_UNIX, SOCK_STREAM, 0);

    struct sockaddr_un name;
    memset(&name, 0, sizeof(struct sockaddr_un));
    name.sun_family = AF_UNIX;
    strncpy(name.sun_path, SOCKET_NAME, sizeof(name.sun_path) - 1);
   
    bind(sock, (const struct sockaddr *) &name, sizeof(struct sockaddr_un));

    /* Prepare for accepting connections. */
    listen(sock, 20);
    connfd = accept(sock, (struct sockaddr*)NULL, NULL);

    while(1) {
        // write
        snprintf(sendBuff, sizeof(sendBuff), "oi!! \r\n");
        write(connfd, sendBuff, strlen(sendBuff));

        // read and print
        int n = 0;
        if ((n = read(connfd, recvBuff, sizeof(recvBuff)-1)) > 0) {
            recvBuff[n] = 0;
            fputs(recvBuff, stdout);
        }

        sleep(6);
    }

    close(connfd);
    sleep(1);
}

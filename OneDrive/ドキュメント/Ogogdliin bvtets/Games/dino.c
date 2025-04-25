#include <stdio.h>
#include <conio.h>
#include <windows.h>

#define WIDTH 50
#define HEIGHT 20

int dinoY = HEIGHT - 2;
int velocityY = 0;
int isJumping = 0;
int obstacleX = WIDTH - 1;
int score = 0;

void draw() {
    
    for (int y = 0; y < HEIGHT; y++) {
        for (int x = 0; x < WIDTH; x++) {
            if (x == 5 && y == dinoY)
                printf("D");
            else if (x == obstacleX && y == HEIGHT - 2)
                printf("|");
            else if (y == HEIGHT - 1)
                printf("_");
            else
                printf(" ");
        }
        printf("\n");
    }
    printf("Score: %d\n", score);
}

void update() {
    system("cls");
    if (_kbhit()) {
        char ch = _getch();
        if (ch == ' ' && !isJumping) {
            velocityY = -3;
            isJumping = 1;
        }
    }

    if (isJumping) {
        dinoY += velocityY;
        velocityY++;
        if (dinoY >= HEIGHT - 2) {
            dinoY = HEIGHT - 2;
            isJumping = 0;
        }
    }

    obstacleX--;
    if (obstacleX < 0) {
        obstacleX = WIDTH - 1;
        score++;
    }

    if (obstacleX == 5 && dinoY == HEIGHT - 2) {
        system("cls");
        printf("Game Over! Final Score: %d\n", score);
        exit(0);
    }
}

int main() {
    while (1) {
        draw();
        update();
    }
}
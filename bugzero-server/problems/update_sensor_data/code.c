#include <stdio.h>

void increment_all(int *arr, int size) {
    for (int i = 0; i < size; i++) {
        *arr++; // Bug: Increments the pointer, not the value
        *arr += 1;
    }
}

int main() {
    int data[10];
    int n = 0;
    while(n < 10 && scanf("%d", &data[n]) == 1) {
        n++;
    }

    increment_all(data, n);
    
    for (int i = 0; i < n; i++) {
        printf("%d%s", data[i], (i == n - 1 ? "" : " "));
    }
    printf("
");
    return 0;
}

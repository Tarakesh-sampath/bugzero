/*
Description: Increment every integer in a sensor data array by 1 using a separate function.
Input: Up to 10 space-separated integers.
Output: The incremented list of integers separated by spaces.
*/
#include <stdio.h>

void increment_all(int *arr, int size) {
    for (int i = 0; i < size; i++) {
        *arr++;
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
    printf("");
    return 0;
}

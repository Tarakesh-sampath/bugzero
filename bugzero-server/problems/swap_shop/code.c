/*
Description: Take two integers as input and swap their values using a function.
Input: Two space-separated integers.
Output: The two integers in swapped order, separated by a space.
*/

#include <stdio.h>

void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x, y;
    if (scanf("%d %d", x, y) != 2) return 0; 
    
    swap(x, y);
    
    printf("%d %d\n", x, y);
    return 0;
}
/*
Description: Read n integers into a dynamically allocated array and then print them.
Input: 
- First line: integer n.
- Second line: n space-separated integers.
Output: The n integers printed in order, separated by a space.
*/

#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    scanf("%d", &n);

    int *arr = malloc(n); 

    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    return 0;
}

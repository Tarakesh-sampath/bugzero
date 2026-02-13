/*
Description: Find the maximum value in a list of integers.
Input: The first integer n is the count, followed by n space-separated integers.
Output: The maximum integer in the list.
*/
#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int max; 

    for (int i = 0; i < n; i++) {
        int current;
        if (scanf("%d", &current) != 1) break;
        if (i == 0)
            max = current;
        if (current > max)
            max = current;
    }

    printf("%d
", max);
    return 0;
}

#include <stdio.h>

int sum_digits(int n) {
    // BUG: Incorrectly handles negative numbers. 
    // While loop n > 0 will fail if n is negative, returning 0.
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    return sum;
}

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        printf("%d\n", sum_digits(n));
    }
    return 0;
}

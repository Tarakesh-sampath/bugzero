#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    
    int result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    
    printf("%d
", result);
    return 0;
}

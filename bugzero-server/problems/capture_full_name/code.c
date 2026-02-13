#include <stdio.h>

int main() {
    char name[50];
    
    if (scanf("%s", name) == 1) {
        printf("Hello, %s", name);
    }
    
    return 0;
}

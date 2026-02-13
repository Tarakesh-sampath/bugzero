#include <stdio.h>

int main() {
    char name[50];
    
    // Bug: scanf with %s stops at the first whitespace
    if (scanf("%s", name) == 1) {
        printf("Hello, %s
", name);
    }
    
    return 0;
}

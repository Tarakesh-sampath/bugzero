/*
Description: Read a user's full name from standard input and print a greeting.
Input: A string containing the user's full name.
Output: "Hello, <name>"
*/
#include <stdio.h>

int main() {
    char name[50];
    
    if (scanf("%s", name) == 1) {
        printf("Hello, %s", name);
    }
    
    return 0;
}

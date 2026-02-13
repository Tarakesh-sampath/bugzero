/*
Description: Read a single word and print it in reverse.
Input: A single string (one word).
Output: The reversed string on a new line.
*/

#include <stdio.h>
#include <string.h>

int main() {
    char str[100];
    if (scanf("%s", str) != 1) return 0;
    
    int len = strlen(str);
    
    for (int i = len; i >= 0; i--) {
        printf("%c", str[i]);
    }
    printf("\n");
    
    return 0;
}
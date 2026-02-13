/*
Description: Read a count of students, then read their scores and calculate the average.
Input: 
- First line: integer count.
- Next lines: space-separated integers representing scores.
Output: A single line in the format "Average: %.2f".
*/

#include <stdio.h>

int main() {
    int count;
    if (scanf("%d", &count) != 1) return 0;
    
    int grades[count];
    int total = 0;
    
    for (int i = 1; i <= count; i++) {
        scanf("%d", &grades[i]);
        total += grades[i];
    }
    
    float average = total / count;
    
    printf("Average: %.2f\n", average);
    return 0;
}
#include <stdio.h>

double array_average(int arr[], int n) {
    if (n == 0) return 0.0;
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += arr[i];
    }
    // BUG: Integer division. sum / n will truncate before being cast to double.
    return (double)(sum / n); 
}

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        int arr[n];
        for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
        printf("%.2f\n", array_average(arr, n));
    }
    return 0;
}

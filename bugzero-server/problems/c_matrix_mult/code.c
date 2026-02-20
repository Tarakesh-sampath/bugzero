#include <stdio.h>

void multiply(int r1, int c1, int m1[r1][c1], int r2, int c2, int m2[r2][c2], int res[r1][c2]) {
    for (int i = 0; i < r1; i++) {
        for (int j = 0; j < c2; j++) {
            // BUG: Fails to initialize res[i][j] to 0. 
            // It might contain garbage values.
            for (int k = 0; k < c1; k++) {
                res[i][j] += m1[i][k] * m2[k][j];
            }
        }
    }
}

int main() {
    int r1, c1, r2, c2;
    if (scanf("%d %d", &r1, &c1) == 2) {
        int m1[r1][c1];
        for (int i = 0; i < r1; i++) for (int j = 0; j < c1; j++) scanf("%d", &m1[i][j]);
        if (scanf("%d %d", &r2, &c2) == 2) {
            int m2[r2][c2];
            for (int i = 0; i < r2; i++) for (int j = 0; j < c2; j++) scanf("%d", &m2[i][j]);
            
            if (c1 != r2) return 0;
            
            int res[r1][c2];
            multiply(r1, c1, m1, r2, c2, m2, res);
            
            for (int i = 0; i < r1; i++) {
                for (int j = 0; j < c2; j++) {
                    printf("%d%s", res[i][j], (j == c2 - 1) ? "" : " ");
                }
                printf("\n");
            }
        }
    }
    return 0;
}

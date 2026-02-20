#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

struct ListNode {
    int val;
    struct ListNode *next;
};

bool hasCycle(struct ListNode *head) {
    if (head == NULL || head->next == NULL) return false;
    struct ListNode *slow = head;
    struct ListNode *fast = head->next;
    
    // BUG: Incorrect condition for loop detection
    // slow == fast check is fine, but fast pointer logic is buggy
    while (slow != fast) {
        if (fast == NULL || fast->next == NULL) return false;
        slow = slow->next;
        fast = fast->next; // BUG: fast should move 2 steps: fast->next->next
    }
    return true;
}

int main() {
    int n, pos;
    if (scanf("%d %d", &n, &pos) == 2) {
        if (n == 0) { printf("false\n"); return 0; }
        struct ListNode *nodes[n];
        for (int i = 0; i < n; i++) {
            nodes[i] = malloc(sizeof(struct ListNode));
            scanf("%d", &nodes[i]->val);
            if (i > 0) nodes[i-1]->next = nodes[i];
        }
        nodes[n-1]->next = (pos >= 0) ? nodes[pos] : NULL;
        printf("%s\n", hasCycle(nodes[0]) ? "true" : "false");
    }
    return 0;
}

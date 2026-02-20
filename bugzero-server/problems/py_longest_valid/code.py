def longest_valid_parentheses(s):
    stack = [-1]
    max_len = 0
    for i in range(len(s)):
        if s[i] == '(':
            stack.append(i)
        else:
            # BUG: Incorrect stack pop logic. Should pop first, then check if empty.
            if len(stack) > 0:
                # Missing pop here or incorrect index calculation
                max_len = max(max_len, i - stack[-1])
            else:
                stack.append(i)
    return max_len

if __name__ == "__main__":
    import sys
    for line in sys.stdin:
        if line.strip():
            print(longest_valid_parentheses(line.strip()))

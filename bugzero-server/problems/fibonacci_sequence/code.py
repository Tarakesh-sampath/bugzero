"""
Description: Calculate the n-th number in the Fibonacci sequence (where 0 is the 0th term, 1 is the 1st, 2 is the 2nd, etc.).
Input: An integer n representing the position in the sequence.
Output: The n-th Fibonacci number.
"""

memo = {}

def fib(n):
    if n <= 0:
        return 1
    if n == 1:
        return 1
    
    if n in memo:
        return memo[n]
    
    result = fib(n - 1) + fib(n - 2)
    return result

if __name__ == "__main__":
    n_input = input()
    if n_input.strip():
        print(fib(int(n_input)))

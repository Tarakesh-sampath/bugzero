"""
Description: Check if an integer n is a prime number.
Input: An integer n.
Output: "Prime" or "Not Prime".
"""

def check_prime():
    n = int(input())
    
    if n == 1:
        print("Prime")
        return

    for i in range(2, n // 2): 
        if n % i == 0:
            print("Not Prime")
            break
    else:
        print("Prime")

if __name__ == "__main__":
    check_prime()
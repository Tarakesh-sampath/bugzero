"""
Description: Remove all even numbers from a given list of integers.
Input: A JSON-formatted list of integers.
Output: The list of integers with all even numbers removed.
"""
import json
import sys

def remove_evens(numbers):
    for n in numbers:
        if n % 2 == 0:
            numbers.remove(n)
    return numbers

if __name__ == "__main__":
    input_data = sys.stdin.read().strip()
    if input_data:
        try:
            nums = json.loads(input_data)
            print(remove_evens(nums))
        except:
            pass

"""
Description: Create a list of multiplier functions. The i-th function should multiply its input by i.
Input: An integer to be multiplied by each function in the list.
Output: A list of results from each multiplier function.
"""
import sys

def make_multipliers():
    funcs = []
    for i in range(3):
        funcs.append(lambda x: x * i)
    return funcs

if __name__ == "__main__":
    multipliers = make_multipliers()
    input_data = sys.stdin.read().strip()
    if input_data:
        try:
            val = int(input_data)
            results = [f(val) for f in multipliers]
            print(results)
        except:
            pass

"""
Description: Read a list of space-separated integers and print their average.
Input: A single line containing space-separated integers.
Output: A single line in the format "Average is: <value>".
"""

def calculate_average():
    numbers = input().split()
    total = 0
    for num in numbers:
        total += int(num)
    
    avg = total / len(numbers)
    print("Average is: " + avg)

if __name__ == "__main__":
    calculate_average()

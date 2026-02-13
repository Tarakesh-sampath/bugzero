"""
Description: Calculate the user's age at the end of the year 2026 based on their birth year.
Input: A single integer representing the birth year.
Output: A message stating "You will be <age> years old."
"""
def calculate_age():
    birth_year = input()
    current_year = 2026
    age = current_year - birth_year
    
    print("You will be " + age + " years old.")

if __name__ == "__main__":
    calculate_age()

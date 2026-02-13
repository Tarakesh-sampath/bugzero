"""
Description: Check if a string is a palindrome, ignoring case and spaces.
Input: A string (may contain spaces and mixed case).
Output: "Yes" if it's a palindrome, "No" otherwise.
"""

def is_palindrome():
    phrase = input().strip()
    clean_phrase = phrase.replace(" ", "")
    clean_phrase.lower() 
    
    reversed_phrase = clean_phrase[::-1]
    
    if clean_phrase == reversed_phrase:
        print("Yes")
    else:
        print("No")

if __name__ == "__main__":
    is_palindrome()

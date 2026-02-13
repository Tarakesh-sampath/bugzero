"""
Description: Add names to a student list and return the current list for each addition.
Input: A series of space-separated names.
Output: The updated list of students after each name is added.
"""
def add_student(name, student_list=[]):
    student_list.append(name)
    return student_list

if __name__ == "__main__":
    import sys
    inputs = sys.stdin.read().split()
    for name in inputs:
        print(add_student(name))

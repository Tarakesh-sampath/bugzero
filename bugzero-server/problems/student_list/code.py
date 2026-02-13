def add_student(name, student_list=[]):
    student_list.append(name)
    return student_list

if __name__ == "__main__":
    import sys
    inputs = sys.stdin.read().split()
    for name in inputs:
        print(add_student(name))

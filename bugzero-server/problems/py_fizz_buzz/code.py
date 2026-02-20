def fizz_buzz(n):
    res = []
    for i in range(1, n + 1):
        # BUG: Incorrect order of checks. Checks for 3 and 5 separately before checking for both (15).
        # This will never append "FizzBuzz" because i%3 or i%5 will match first if it's 15.
        if i % 3 == 0:
            res.append("Fizz")
        elif i % 5 == 0:
            res.append("Buzz")
        elif i % 3 == 0 and i % 5 == 0:
            res.append("FizzBuzz")
        else:
            res.append(str(i))
    return res

if __name__ == "__main__":
    import sys
    for line in sys.stdin:
        if line.strip():
            n = int(line.strip())
            print(" ".join(fizz_buzz(n)))

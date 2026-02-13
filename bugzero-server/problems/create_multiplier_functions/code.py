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

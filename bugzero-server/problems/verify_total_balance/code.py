def check_balance():
    # Transactions: 0.1, 0.1, 0.1
    transactions = [0.1, 0.1, 0.1]
    expected = 0.3
    
    total = sum(transactions)
    
    if total == expected:
        print("Balance Verified")
    else:
        print(f"Error: Total is {total}")

if __name__ == "__main__":
    check_balance()

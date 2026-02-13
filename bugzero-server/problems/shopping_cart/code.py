"""
Description: Calculate total price of items. If the total exceeds 100, apply a 10% discount.
Input: 
- First line: integer items_count.
- Following lines: item data in the format "item_name price".
Output: A single line in the format "Total: <rounded_value>".
"""

def checkout():
    items_count = int(input())
    total = 0
    
    for i in range(items_count):
        item_data = input().split() # Format: "Apple 10.50"
        price = float(item_data[1])
        total += price
        
    if total > 100:
        # Apply 10% discount
        total = total * 0.9
        
    print(f"Total: {round(total)}")

if __name__ == "__main__":
    checkout()
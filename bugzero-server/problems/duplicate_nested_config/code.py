import copy

def update_config():
    original = {"id": 1, "settings": {"theme": "dark"}}
    
    new_config = original.copy()
    new_config["settings"]["theme"] = "light"
    new_config["id"] = 2
    
    print(f"Original: {original['settings']['theme']}")
    print(f"New: {new_config['settings']['theme']}")

if __name__ == "__main__":
    update_config()

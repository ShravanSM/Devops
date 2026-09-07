# Simple Menu-Driven Calculator

# Function for addition
def add(num1, num2):
    return num1 + num2


# Function for subtraction
def subtract(num1, num2):
    return num1 - num2


# Function for multiplication
def multiply(num1, num2):
    return num1 * num2


# Function for division
def divide(num1, num2):
    if num2 == 0:
        return None
    return num1 / num2


# Keep the calculator running until the user chooses Exit
while True:

    print("\n----- Calculator -----")
    print("1. Addition")
    print("2. Subtraction")
    print("3. Multiplication")
    print("4. Division")
    print("5. Exit")

    choice = input("Enter your choice: ")

    if choice == "5":
        print("Calculator closed.")
        break

    elif choice == "1":
        try:
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            print("Result:", add(num1, num2))
        except ValueError:
            print("Please enter numbers only.")

    elif choice == "2":
        try:
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            print("Result:", subtract(num1, num2))
        except ValueError:
            print("Please enter numbers only.")

    elif choice == "3":
        try:
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            print("Result:", multiply(num1, num2))
        except ValueError:
            print("Please enter numbers only.")

    elif choice == "4":
        try:
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))

            if num2 == 0:
                print("Cannot divide by zero.")
            else:
                print("Result:", divide(num1, num2))

        except ValueError:
            print("Please enter numbers only.")

    else:
        print("Invalid choice. Please select 1 to 5.")
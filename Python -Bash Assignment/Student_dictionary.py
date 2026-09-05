# Create a dictionary where the keys are student names and the values are their grades. Allow the user to:
# Add a new student and grade.
# Update an existing student's grade.
# Print all student grades.
# Use a dictionary and basic operations with if / else.
students={
    'Shravan':'A',
    'Prajwal':'B',
    'Manjunath':'C'
}
print("1.Add a new student and grade.")
print("2.Update an existing student's grade.")
print("3.Print all student grades.")
choice=int(input("Enter the Choice of yours"))

if choice==1:
    name=input("Enter the Name")
    grade=input('Enter the Grade')
    
    students[name]=grade
    print("Student is added to dictionary")

elif choice==2:
    name=input("enter the Student Name")
    
    if name in students:
        grade=input("Enter the updated Grade")
        students[name]=grade
        print("Grade has been Updated")
    else:
        print("Student not found")

elif choice == 3:
    print("The students Grades are:")
    for name,grade in students.items():
        print(name,":",grade)
else:
    print("Invalid Choice ")
# Write to a File
# Write a program to create a text file and write some content to it, using file functions like open() and write().
file = open("student_info.txt", "w")

file.write("This is my Python file handling assignment.\n")
file.write("I am learning how to write data into a text file.")

file.close()

print("Content written to file successfully.")
# Read from a File
# Open the file in read mode and use file.read() to read and display its content.
file = open("student_info.txt", "r")

content = file.read()

print("File Content:")
print(content)

file.close()
Linux Basics Assignment

1. Run linux_basics_commands.sh commands on your Linux/WSL terminal.
2. Capture real terminal screenshots for each task.
3. Insert the screenshots into Linux_Basics_Documentation.docx.
4. Add your actual GitHub repository link.
5. Zip this folder and submit the ZIP file.

mkdir -p test_dir
touch test_dir/example.txt
mv test_dir/example.txt test_dir/renamed_example.txt

cat /etc/passwd
head -n 5 /etc/passwd
tail -n 5 /etc/passwd
grep 'root' /etc/passwd

zip -r test_dir.zip test_dir
mkdir -p unzipped_dir
unzip test_dir.zip -d unzipped_dir

wget -O sample.txt https://example.com/sample.txt

touch secure.txt
chmod 444 secure.txt

export MY_VAR="Hello, Linux!"
echo "$MY_VAR"

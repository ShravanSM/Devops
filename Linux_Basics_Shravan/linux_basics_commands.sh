#!/bin/bash
# Linux Basics Assignment
# Run commands one by one if you need to capture terminal screenshots.

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

@echo off
SET /p privateKey=Please enter your private key: 
echo Your private key has been entered.

docker exec -it test-node /home/user/create-validator.sh %privateKey%
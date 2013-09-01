#!/bin/bash

echo "Send push message to iOS device"

MSG="Usage pa.sh \"APID\" \"alert message\""
## validate device
if [[ "$1" = "" ]]; then
  echo "You need to input a message as a first parameter"
  echo $MSG
  exit 1
fi
## validate message
if [[ "$2" = "" ]]; then
  echo "You need to input a message as a second parameter"
  echo $MSG
  exit 1
fi
   
#echo "device token: $1"
#echo "message: $2"

DATA="{\"apids\": [\"$1\"], \"android\": {\"alert\": \"$2\"}}"

curl -X POST -u "rJ-ZDlhzRniVcFBgfRHM2A:EZ-EbsFnTtKgXTh7Op8qMQ" -H "Content-Type: application/json" --data "$DATA" https://go.urbanairship.com/api/push/
echo ""
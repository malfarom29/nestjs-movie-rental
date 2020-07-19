#!/bin/sh
input="./.env.example"
while read line; do
  line=$(echo "$line" | cut -d= -f1)
  env=$(printenv "$line")
  if [ -n "$line" ]
  then
    echo "$line=${env}"
  fi
done < "$input" > ".env"
#!/bin/bash

DEV_API_URL=http://127.0.0.1:5002

if [ -z "$1" ]
then
  echo "No argument supplied."
  echo Try using $DEV_API_URL
  curl -ls ${DEV_API_URL}/openapi.json > /dev/null
  if [ $? -ne 0 ]
  then
    echo "Please provide the base url of the API."
    exit 0
  fi

  echo "API is running at ${DEV_API_URL}"
  BASE_URL=$DEV_API_URL
else
BASE_URL=$1

fi

echo "Generating API"


echo "URL API for ${BASE_URL}"

# get path to this script
SCRIPT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

# check if curl command exists
if ! command -v curl &> /dev/null
then
    echo "curl could not be found. Please install curl."
    exit 2
fi

# download openapi.json with curl

curl -s ${BASE_URL}/openapi.json > ${SCRIPT_PATH}/../openapi.json

echo "API generated successfully"

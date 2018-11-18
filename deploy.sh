#!/bin/bash


zip -r queue-jap-export.zip queue.js package.json package-lock.json node_modules/

aws lambda update-function-code --function-name queue-jap-export --zip-file fileb://queue-jap-export.zip

zip -r process-jap-export.zip process.js package.json package-lock.json node_modules/

aws lambda update-function-code --function-name process-jap-export --zip-file fileb://process-jap-export.zip
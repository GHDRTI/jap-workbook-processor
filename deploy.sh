#!/bin/bash


# Deploy Queue
zip -r queue-jap-export.zip queue.js package.json package-lock.json node_modules/ views/
aws lambda update-function-code --function-name queue-jap-export --zip-file fileb://queue-jap-export.zip


# Deploy Process
zip -r process-jap-export.zip process.js package.json package-lock.json node_modules/ views/ output/
aws lambda update-function-code --function-name process-jap-export --zip-file fileb://process-jap-export.zip
#aws s3 cp process-jap-export.zip s3://org.rti.ntd.workbooks/
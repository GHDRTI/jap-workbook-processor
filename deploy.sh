#!/bin/bash

zip -r jamWorkbookProcessor.zip *

aws lambda update-function-code --function-name generate-epirf --zip-file fileb://jamWorkbookProcessor.zip
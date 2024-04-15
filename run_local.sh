#!/bin/bash

npm install
npm run build

cd dist
pipenv --venv || pipenv --three
pipenv install -r requirements.txt
pipenv run python app.py

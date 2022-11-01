#!/bin/bash
echo 'install backend';
npm install --save
echo 'install frontend';
cd ./frontend
npm install --save
echo 'please create .env file';
#!/bin/bash
echo 'change version';
bash version.sh
echo 'remove old public folder';
rm -d -r ./public/
cd ./frontend
echo 'build frontend project';
yarn build
cd ..
echo 'move build folder to root project';
cp -r -a ./frontend/dist/. ./public/
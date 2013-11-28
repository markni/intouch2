#! /bin/sh
forever stop dist/app.js &
git pull &
npm install &
grunt
forever start dist/app.js &
wait



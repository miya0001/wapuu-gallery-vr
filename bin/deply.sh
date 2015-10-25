#!/bin/bash

set -e

rm -rf .git || exit 0;

npm install -g gulp bower
npm install
bower install
gulp

git init

git config user.name "Travis CI"
git config user.email "miya+github.com@wpist.me"

git add .
git commit -m "Deploy to GitHub Pages"

git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1

#!/usr/bin/env bash

set -e

npm install
npm run build

sed -e s/wapuu\.json/wapuu\.json?{$TRAVIS_BUILD_ID}/ index.html > index.html.new
mv index.html.new index.html

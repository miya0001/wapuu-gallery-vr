#!/usr/bin/env bash

set -e

sed -e s/VERSION/${TRAVIS_BUILD_ID}/ index.html > index.html.new
mv index.html.new index.html

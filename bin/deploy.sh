#!/usr/bin/env bash

set -e

if [[ "false" != "$TRAVIS_PULL_REQUEST" ]]; then
	echo "Not deploying pull requests."
	exit
fi

if [[ "master" != "$TRAVIS_BRANCH" ]]; then
	echo "Not on the '$DEPLOY_BRANCH' branch."
	exit
fi

rm -rf .git
rm -r .gitignore
rm -f .travis.yml
rm -rf node_modules
rm -rf bin

git init
git config user.name "Travis CI"
git config user.email "miya+github.com@wpist.me"
git add .
git commit -q -m "Deploy to GitHub Pages"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1

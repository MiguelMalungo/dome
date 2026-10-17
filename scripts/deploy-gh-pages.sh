#!/bin/sh
# Builds the site and publishes dist/ to the gh-pages branch (GitHub Pages).
# Live at https://miguelmalungo.github.io/dome/ — the base path is set in astro.config.mjs.
# Run: npm run deploy   (commit and push your changes to main first)
set -e
cd "$(dirname "$0")/.."
root=$(pwd)
remote=$(git remote get-url origin)
sha=$(git rev-parse --short HEAD)

npm run build
touch dist/.nojekyll # otherwise GitHub's Jekyll step drops the _astro/ folder

tmp=$(mktemp -d)
if git ls-remote --exit-code --heads "$remote" gh-pages >/dev/null 2>&1; then
  git clone -q --depth 1 --branch gh-pages "$remote" "$tmp"
else
  git init -q "$tmp"
  (cd "$tmp" && git checkout -q --orphan gh-pages && git remote add origin "$remote")
fi

cd "$tmp"
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R "$root/dist/." .
git add -A
if git diff --cached --quiet; then
  echo "gh-pages already up to date."
else
  git commit -q -m "Deploy $sha"
  git push -q origin gh-pages
  echo "Deployed $sha to gh-pages."
fi
cd "$root"
rm -rf "$tmp"

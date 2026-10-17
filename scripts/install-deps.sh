#!/bin/sh
# Installs node_modules without letting iCloud Drive touch it.
# iCloud can delete files from node_modules once it starts syncing them, and `npm install`
# replaces the node_modules link with a real folder. So: install in a temp folder outside
# iCloud, move it into node_modules.nosync/ (iCloud skips *.nosync), and link to it.
# The inner folder must stay named node_modules: Vite needs /node_modules/ in the real path.
# Run from anywhere: sh scripts/install-deps.sh
set -e
cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
cp package.json package-lock.json "$tmp"/
(cd "$tmp" && npm ci)
rm -rf node_modules node_modules.nosync
mkdir node_modules.nosync
mv "$tmp/node_modules" node_modules.nosync/node_modules
ln -s node_modules.nosync/node_modules node_modules
rm -rf "$tmp"
echo "node_modules ready (outside iCloud sync)."

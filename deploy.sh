#!/bin/sh
npm run build
rm -rf ../muistiinpano-backend/build
cp -r build ../muistiinpano-backend/
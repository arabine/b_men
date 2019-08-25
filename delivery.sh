#!/bin/bash

gulp bmen-lib
gulp bmen-css

electron-packager . bmen --platform win32 --icon=favicon.ico --arch x64 --asar --overwrite --out bmen-dist/ --version-string.CompanyName=D8S --version-string.FileDescription=D8S --version-string.ProductName='B-Men' --ignore="\.git(ignore|modules)" --ignore="js_dev" --ignore="views" --ignore="components" --ignore="index_dev.html" --ignore="delivery.sh" --ignore="blank.html" --ignore="app.js" --ignore="api.js" --ignore="gulpfile.js" --ignore="i18n.js"  --ignore="package*.json" --ignore="store.js" --ignore="style.css" --ignore=".vscode"



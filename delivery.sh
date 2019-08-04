#!/bin/bash

cd www
gulp felun-lib
gulp felun-css
gulp static-files
cd ..

perl ./scripts/embed.pl www/dist/ www/images www/i18n www/fonts www/index.html www/favicon.ico > src/embedded_files.c


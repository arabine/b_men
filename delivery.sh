#!/bin/bash

gulp bmen-lib
gulp bmen-css

# perl ./embed.pl dist images i18n fonts sounds js css index.html favicon.ico > src/embedded_files.c


TEMPLATE = app

CONFIG += c++11 console

CONFIG += icl_database icl_zip

TARGET = bmen

# ------------------------------------------------------------------------------
# OUTPUT DIRECTORIES
# ------------------------------------------------------------------------------
BASE_DIR = $${PWD}

CONFIG(debug, debug|release) {
debug:      DESTDIR = $$BASE_DIR/build-bmen/debug
}

CONFIG(release, debug|release) {
release:    DESTDIR = $$BASE_DIR/build-bmen/release
}

CONFIG(desktop, desktop) {
QT += webengine
DEFINES += DESKTOP_APP
}

UI_DIR          = $$DESTDIR/ui
UI_HEADERS_DIR  = $$DESTDIR/include
UI_SOURCES_DIR  = $$DESTDIR/src
OBJECTS_DIR     = $$DESTDIR/obj
RCC_DIR         = $$DESTDIR/rcc
MOC_DIR         = $$DESTDIR/moc

# ------------------------------------------------------------------------------
# PLATFORM SPECIFIC COMPILER
# ------------------------------------------------------------------------------
win32 {
    DEFINES += USE_WINDOWS_OS

    *-g++* {
        # MinGW
        QMAKE_CXXFLAGS += -std=c++11
        LIBS +=  -lws2_32 -lpsapi
    }

    *-msvc* {
        # MSVC
        QMAKE_LIBS += ws2_32.lib psapi.lib setupapi.lib cfgmgr32.lib advapi32.lib
     #   QMAKE_CXXFLAGS += /SUBSYSTEM:WINDOWS
    }

}

linux {
    DEFINES += USE_UNIX_OS
    DEFINES += USE_LINUX_OS
    LIBS += -ldl -lpthread
}

# ------------------------------------------------------------------------------
# ICL
# ------------------------------------------------------------------------------
ICL_DIR = $$BASE_DIR/icl
include($$ICL_DIR/icl.pri)

# ------------------------------------------------------------------------------
# APPLICATION FILES
# ------------------------------------------------------------------------------
VPATH += src
INCLUDEPATH += src


SOURCES += main.cpp BMen.cpp embedded_files.c

RESOURCES += qml.qrc

HEADERS += BMen.h

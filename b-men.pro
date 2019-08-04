TEMPLATE = app

QT += webengine

CONFIG += icl_database icl_zip



VPATH += src
INCLUDEPATH += src

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

UI_DIR          = $$DESTDIR/ui
UI_HEADERS_DIR  = $$DESTDIR/include
UI_SOURCES_DIR  = $$DESTDIR/src
OBJECTS_DIR     = $$DESTDIR/obj
RCC_DIR         = $$DESTDIR/rcc
MOC_DIR         = $$DESTDIR/moc

# ------------------------------------------------------------------------------
# PLATFORM SPECIFIC COMPILER
# ------------------------------------------------------------------------------
windows {
    DEFINES += USE_WINDOWS_OS

    *-g++* {
        # MinGW
        QMAKE_CXXFLAGS += -std=c++11
        LIBS +=  -lws2_32 -lpsapi
    }

    *-msvc* {
        # MSVC
        QMAKE_LIBS += ws2_32.lib psapi.lib setupapi.lib cfgmgr32.lib advapi32.lib
    }

} else {
    DEFINES += USE_UNIX_OS
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
SOURCES += main.cpp

RESOURCES += qml.qrc

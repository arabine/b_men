TEMPLATE = app

CONFIG += c++11

CONFIG += icl_database icl_zip

TARGET = bmen-server

# ------------------------------------------------------------------------------
# OUTPUT DIRECTORIES
# ------------------------------------------------------------------------------
BASE_DIR = $${PWD}

CONFIG(debug, debug|release) {
debug:      DESTDIR = $$BASE_DIR/build-bmen-server/debug
}

CONFIG(release, debug|release) {
release:    DESTDIR = $$BASE_DIR/build-bmen-server/release
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
   DEFINES += _WIN32_WINNT=_WIN32_WINNT_WIN7 # _WIN32_WINNT_WIN10

    *-g++* {
        # MinGW
        QMAKE_CXXFLAGS += -std=c++11
        LIBS +=  -lws2_32 -lpsapi -lwsock32
    }

    *-msvc* {
        # MSVC
        QMAKE_LIBS += ws2_32.lib psapi.lib setupapi.lib cfgmgr32.lib advapi32.lib wsock32.lib
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

SOURCES += main-server.cpp BMen.cpp embedded_files.c

HEADERS += BMen.h

# ------------------------------------------------------------------------------
# SERVER
# ------------------------------------------------------------------------------

VPATH += src/server
INCLUDEPATH += src/server

SOURCES += connection.cpp reply.cpp request_parser.cpp connection_manager.cpp  mime_types.cpp  request_handler.cpp server.cpp
HEADERS += connection.hpp reply.hpp request_parser.hpp connection_manager.hpp  mime_types.hpp  request_handler.hpp server.hpp

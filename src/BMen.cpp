#include "BMen.h"
#include "Util.h"
#include "Log.h"

extern "C" {
const char *find_embedded_file(const char *name, size_t *size, const char **mime);
}

BMen::BMen()
    : HttpFileServer ("")
{

}

bool BMen::Initialize()
{
    return true;
}

void BMen::Start()
{

}

bool BMen::FindEmbeddedFile(const tcp::Conn &conn, const HttpRequest &request)
{
    bool continueProcess = true;
    size_t size = 0;
    const char *mime;

    std::string virtualFilePath = "/" + request.query;

    // Patch here to redirect to index.html
    if (virtualFilePath == "/")
    {
        virtualFilePath = "/index.html";
    }

    const char *fileContents = find_embedded_file(virtualFilePath.c_str(), &size, &mime);

    if (fileContents != nullptr)
    {
        TLogInfo("[FELUN] Serving embedded file: " + request.query);

        std::stringstream ss;
        std::string data(fileContents, size);

        ss << "HTTP/1.1 200 OK\r\n";
        ss << "Content-type: " << mime << "\r\n";
        ss << "Content-length: " << data.size() << "\r\n\r\n";
        ss << data;

        tcp::TcpSocket::SendToSocket(ss.str(), conn.peer);
        continueProcess = false;
    }

    return continueProcess;
}

bool BMen::ServeRESTApi(const tcp::Conn &conn, const HttpRequest &request)
{
    bool continueProcess = false;
    (void) conn;
    (void) request;

//    if (request.query == "/api/v1/auth")
//    {
//    }

    return continueProcess;
}


bool BMen::ReadDataPath(const tcp::Conn &conn, const HttpRequest &request)
{
    bool continueProcess = FindEmbeddedFile(conn, request);

    if (continueProcess)
    {
        continueProcess = ServeRESTApi(conn, request);
    }
    return continueProcess;
}



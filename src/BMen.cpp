#include "BMen.h"
#include "Util.h"
#include "Log.h"

#include <asio.hpp>
#include "server.hpp"

extern "C" {
const char *find_embedded_file(const char *name, size_t *size, const char **mime);
}

BMen::BMen()
    : HttpFileServer ("")
{

}

BMen::~BMen()
{
    if (mThread.joinable())
    {
        mThread.join();
    }
}

bool BMen::Initialize()
{
    return true;
}

void BMen::Start()
{
    mThread = std::thread(&BMen::Run, this);
}

bool BMen::handle_request(const http::server::request &req, http::server::reply &rep)
{
    bool status = false;
    // Decode url to path.
    std::string request_path;
    if (!http::server::request_handler::url_decode(req.uri, request_path))
    {
      rep = http::server::reply::stock_reply(http::server::reply::bad_request);
      return status;
    }

    if (request_path == "/api/cards")
    {
        rep = http::server::reply::reply_json(Util::FileToString(Util::ExecutablePath() + "/engine/cards.json"));
        status = true;
    }

    return status;
}




void BMen::Run()
{
    try
    {
//          std::cerr << "Usage: http_server <address> <port> <doc_root>\n";
//          std::cerr << "  For IPv4, try:\n";
//          std::cerr << "    receiver 0.0.0.0 80 .\n";
//          std::cerr << "  For IPv6, try:\n";
//          std::cerr << "    receiver 0::0 80 .\n";

        // Initialise the server.
        http::server::server s("0.0.0.0", "8081", ".", *this);

        // Run the server until stopped.
        s.run();
    }
    catch (std::exception& e)
    {
        std::cerr << "exception: " << e.what() << "\n";
    }
}



bool BMen::FindEmbeddedFile(const tcp::Conn &conn, const HttpRequest &request)
{
    bool continueProcess = true;
    size_t size = 0;
    const char *mime;

    std::string virtualFilePath = request.query;

    // Patch here to redirect to index.html
    if (virtualFilePath == "/")
    {
        virtualFilePath = "/index.html";
    }

    const char *fileContents = find_embedded_file(virtualFilePath.c_str(), &size, &mime);

    if (fileContents != nullptr)
    {
        TLogInfo("[B-MEN] Serving embedded file: " + virtualFilePath);

        std::stringstream ss;
        std::string data(fileContents, size);

        ss << "HTTP/1.1 200 OK\r\n";
        ss << "Content-type: " << mime << "\r\n";
        ss << "Content-length: " << data.size() << "\r\n\r\n";
        ss << data;

        tcp::TcpSocket::SendToSocket(ss.str(), conn.peer);
        continueProcess = false;
    }
    else
    {
        TLogError("Cannt find embedded file: " + virtualFilePath);
    }

    return continueProcess;
}

bool BMen::ServeRESTApi(const tcp::Conn &conn, const HttpRequest &request)
{
    bool continueProcess = false;
    (void) conn;
    (void) request;

    if (request.query == "/api/cards")
    {
        SendHttpJson(conn, Util::FileToString(Util::ExecutablePath() + "/engine/cards.json"));
    }

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



#ifndef BMEN_H
#define BMEN_H

#include "TcpServer.h"
#include "HttpFileServer.h"

#include "request_handler.hpp"

class BMen : public HttpFileServer, public http::server::user_handler
{
public:
    BMen();
    ~BMen();

    bool Initialize();
    void Start();

private:
    std::thread mThread;

    virtual bool handle_request(const http::server::request& req, http::server::reply& rep);

    // From HttpFileServer
    virtual bool ReadDataPath(const tcp::Conn &conn, const HttpRequest &header);

    // From BMen
    bool FindEmbeddedFile(const tcp::Conn &conn, const HttpRequest &request);
    bool ServeRESTApi(const tcp::Conn &conn, const HttpRequest &request);
    void Run();
};

#endif // BMEN_H

#ifndef BMEN_H
#define BMEN_H

#include "TcpServer.h"
#include "HttpFileServer.h"

class BMen : public HttpFileServer
{
public:
    BMen();
    ~BMen();

    bool Initialize();
    void Start();

private:
    // From HttpFileServer
    virtual bool ReadDataPath(const tcp::Conn &conn, const HttpRequest &header);

    // From BMen
    bool FindEmbeddedFile(const tcp::Conn &conn, const HttpRequest &request);
    bool ServeRESTApi(const tcp::Conn &conn, const HttpRequest &request);
};

#endif // BMEN_H

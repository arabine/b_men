/****************************************************************************
 *
 * Copyright (C) 2019 Anthony Rabine
 * Contact: anthony@rabine.fr
 *
 ****************************************************************************/

#include "Util.h"
#include "BMen.h"
#include "Log.h"

class Logger : public Observer<Log::Infos>
{
public:
    virtual ~Logger();
    void Update(const Log::Infos &infos);
};


Logger::~Logger()
{

}

void Logger::Update(const Log::Infos &infos)
{
    std::cout << infos.ToString() << std::endl;
}



int main(int argc, char *argv[])
{
    Logger logger;

    Log::EnableLog(true);
    Log::SetLogPath("logs");
    Log::SetLogFileName("log_" + Util::CurrentDateTime("%Y%m%d%H%M%S") + ".log");
    Log::RegisterListener(logger);

    TLogInfo("B-Men is starting");

    std::srand(static_cast<std::uint32_t>(time(nullptr)));

    BMen bmen;
    if (bmen.Initialize())
    {
        bmen.Start();
    }

    (void) argc;
    (void) argv;
    std::cin.get();
    return 0;
}


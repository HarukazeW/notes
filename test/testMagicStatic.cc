/* 实际编写代码验证c++ 11 static magic 特性 */
/* 经检验确认vs2015上，该特性成立 */

#include "stdafx.h"
#include <Windows.h>
#include <iostream>
#include <process.h>

using std::endl;

class SinglePattern {
public:
    SinglePattern(SinglePattern&) = delete; // copy construct
    SinglePattern& operator=(const SinglePattern&) = delete; // copy assignment
    static SinglePattern& GetInstance() {
        std::cout << "get begin()" << endl;
        static SinglePattern inst;
        std::cout << "get end()" << endl;
        return inst;
    }
private:
    SinglePattern() {
        std::cout << "create" << endl;
        Sleep(10000);
    }
};

unsigned int __stdcall fun(void *pv) {
    SinglePattern &inst = SinglePattern::GetInstance();
    return 0;
}


int main()
{
    HANDLE hdl = (HANDLE)_beginthreadex(nullptr, 0, fun, nullptr, 0, nullptr);
    CloseHandle(hdl);
    SinglePattern &inst = SinglePattern::GetInstance();
    std::cout << "ok end ";
    Sleep(10000);
    return 0;
}
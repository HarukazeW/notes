#include <unordered_map>


std::unordered_map<std::string, std::string> split(const std::string &s,const std::string mark) { //以mark作为分割
    std::unordered_map<std::string, std::string> dict;
    std::regex ws_re(mark);
    std::vector<std::string> v(std::sregex_token_iterator(s.begin(), s.end(), ws_re, -1), std::sregex_token_iterator());
    for (auto args : v) {
        int pos = args.find_first_of('=');
        dict[args.substr(0, pos)] = args.substr(pos + 1);
    }
    return dict;
}
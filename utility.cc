#include <regex>
#include <vector>

std::string split(std::string s,std::string pat){
    std::regex ws_re(pat);
    std::vector<std::string> v(std::sregex_token_iterator(s.begin(), s.end(), ws_re, -1),
        std::sregex_token_iterator());
}

int lower_bound(std::vector<int>& nums, int target) {
    int l = 0, r = nums.size()-1;
    while (l <= r) {
        int mid = (r-l)/2+l;
        if (nums[mid] < target)
            l = mid+1;
        else
            r = mid-1;
    }
    return l;
}
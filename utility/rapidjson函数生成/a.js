function getHeader(name,strArr,intArr){
    var res = "";
    res += "#" + "include \"CommonEntity.h\"";
    res += "</p>"
    res += "class " + name + " : public JsonBase" + "<br />"
    res += "{" + "<br />"
    for(i in strArr){
        curs = strArr[i];
        cs = curs.charAt(0).toUpperCase() + curs.slice(1);
        res+="&nbsp;&nbsp;&nbsp;&nbsp;PW_SYNTHESIZE_PASS_BY_REF(string, " + curs + ", " + cs + ")" + "<br />"
    }
    for(i in intArr){
        curs = intArr[i];
        cs = curs.charAt(0).toUpperCase() + curs.slice(1);
        res+="&nbsp;&nbsp;&nbsp;&nbsp;PW_SYNTHESIZE_PASS_BY_REF(int, " + curs + ", " + cs + ")" + "<br />"
    }
    res += "<p/>";
    res += "public:" + "<br/>"
    res += "&nbsp;&nbsp;&nbsp;&nbsp;"+ name + "() {}" + "<br />"
    res += "&nbsp;&nbsp;&nbsp;&nbsp;~"+ name + "() {}" + "<br />"
    res += "</p>"

    res +=  "&nbsp;&nbsp;&nbsp;&nbsp;void ToWrite(Writer&lt;StringBuffer&gt; &writer)" + "<br />"
    res += "&nbsp;&nbsp;&nbsp;&nbsp;" + "{" + "<br />";

    res += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +"RapidjsonWriteBegin(writer);" + "<br />";
    for(i in strArr){
        curs = strArr[i];
        res+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RapidjsonWriteString(" + curs + ");" + "<br />";
    }
    for(i in intArr){
        curs = intArr[i];
        res+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RapidjsonWriteInt(" + curs + ");" + "<br />";
    }
    res += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "RapidjsonWriteEnd();" + "<br />";
    res += "&nbsp;&nbsp;&nbsp;&nbsp;" + "}" + "<br />";
    res += "&nbsp;&nbsp;&nbsp;&nbsp;" + "void ParseJson(const Value& val)" + "<br />"
    res += "&nbsp;&nbsp;&nbsp;&nbsp;" + "{" + "<br />"

    res += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +"RapidjsonParseBegin(val);" + "<br />";
    for(i in strArr){
        curs = strArr[i];
        res+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RapidjsonParseToString(" + curs + ");" + "<br />";
    }
    for(i in intArr){
        curs = intArr[i];
        res+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RapidjsonParseToInt(" + curs + ");" + "<br />";
    }
    res += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +"RapidjsonParseEnd();" + "<br />";
    res += "&nbsp;&nbsp;&nbsp;&nbsp;" + "}" + "<br />";
    res += "};";
    document.write(res);
}

name = "CandidateInfo"
strArr=["candidate","sdpMLineIndex","sdpMid"]
intArr=[""]

getHeader(name,strArr,intArr);
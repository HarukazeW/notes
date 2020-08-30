#### 构造函数里{}和()的区别

1. ={}和{}相同的，{}有更好的通用性，但是不能narrow conversion
2. 注意若有initliazer_list构造参数，只要可能，{}内参数都会尽量被转换initializer_list，调用intializer_list构造函数（可能会因narrow,conversion报错），而不是更匹配的参数。
3. s {{}}; // call intializer_list construct,with empty list
4. 对于template,其内部使用()还是{}构造，使用差别会很大，需要谨慎选择。
#### function模版

```c++
// function类不受函数性质的限制，只要参数一致便可进行赋值
class A{
    int operator()(int a){
        return 0;;
    }
}
A obja;
std::function<int(int)> f3 = obja;
```







#### 相关词汇

重载（override）,覆盖(overload),多态(polymorphism)

RAII(Resource Accquisation is Initializing)

Pimpl(Pointer to implementation) ，以指针指向一个对象，内含真正数据。

CRTP(curiously recurring template pattern),继承一个模板base class,该base class又以该类作为类型参数。其功能大多用以实现Do it for me，并不是is-a的关系。例如如下继承关系

`class Widget: public NewHandlerSupport<Widget>`






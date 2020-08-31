#### c++基础

1. 使用const对象，enums替换define 变量,使用inline函数(templates) 替换define 函数
2. 合适的情况，尽量将函数返回值等声明为const,可以让编译器帮助侦测错误用法。
3. 将成员函数区分const版本和非const版本，可以返回值类型不同，更符合使用需求。(const成员函数内部需修改的变量可以声明为mutable)
4. non-local static对象(static member of class,global)初始化顺序无定义。所以建议都以local static对象替换non-local static对象。避免在用到该对象的时候(例如static对象 调用方初始化用到它），它尚未被初始化。

#### 构造，析构、赋值

1. 对于内含reference member的类，不会生成default constructor函数。

2. 阻止编译默认生成copy,assignment函数，可以声明为private且不予实现（link error）。也可以继承自uncopyable这样的base class(编译错误)

3. 多态base class应该拥有一个virtual 析构函数。但是不打算具有多态性，就不应该 声明virtual析构函数

4. 若想要抽象类，但又没有pure virtual函数，那么可以利用析构函数。

   ```c++
   class A{
       ~virtual ~A() = 0;
   }
   A:~A() { }  // must,否则会报link error
   ```

   

5. 析构函数不应该抛出异常，应该吞下它们或是结束程序。若需要客户对异常进行处理，可以再手动提供一个销毁函数供用户手动调用并处理异常

6. 构造和析构期间不要调用virtual函数，因为在此期间，对象类型是base class，而不是derived class

7. assignment操作符应当返回一个reference to *this

8. 确认任何函数操作一个以上对象，而其中多个对象是同一个对象时，行为依然正确。

9. 确保自我赋值有良好行为，其中技术包括，证同测试，语句顺序调整，copy-and-swap

   ```c++
   Widget &Widget::operator=(const Widget& rhs){
   	Bitmap *pOrig = pb;
   	pb = new Bitmap(*rhs.pb);
       //即使malloc失败，pb所指内存依然有效，而非undefined。具备异常安全性
       delete pOrig;
       return *this;
   }
   // copy swap
   Widget &Widget::operator=(const Widget& rhs){
       Widget temp(rhs);
   	swap(temp);
       return *this;
   }
   ```

10. copying函数应该确保赋值对象内所有成员变量及所有base class成分

11. 不要尝试以某个copy函数实现另一个copy函数。可以将共同机能放进一个private init函数，供两个copy函数共同调用。

####  资源管理

1. 防止资源泄漏，尽量使用RAII对象（Resource Acquisition Is Initialization）
2. 注意智能指针内部做的是delete，而非delete[]
3. 复制RAII对象必须一并复制它所管理的资源，资源copy行为决定RAII对象的copy行为
4. 普遍常见的RAIIcopy行为： 禁止copy,reference counting(可借用智能指针）等
5. RAII class应该提供获取其所管理的资源的办法
6. new[]和delete[]配套使用，鉴于为用户减少误用，尽量不要对数组typedef
7. 以独立语句将newed对象置入智能指针，一旦异常抛出，就可能产生难以察觉的资源泄漏(如其他参数调用失败，导致内存成功分配但未赋值给智能指针)
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

#### 设计与声明

1. 促进接口正常使用，阻止误用，尽量使其与内置类型保持一致。

2. shared_ptr支持定制custom deleter,这可防范dll问题，可以用来自动解除互斥锁等。

3. 设计class就是type,应该审慎考虑

4. 尽量以pass-by-reference-const替换pass-by-value。高效且避免slicing problem。但是对于内置类型，stl iterator,和函数对象，pass-by-value更适合。

5. 切记将成员变量声明为private。这可赋予客户访问数据一致性，可细微划分访问控制，封装。并且内部改动后不会影响用户代码。在这一点上，protected比public好不了多少。

6. 可以的话，使用non-member non-friend函数替换member函数这样可以增加封装性，package flexibility和扩充性。可以与原class共处一个namespace内，放于多个文件中，相关工具自成一类，放于各自头文件中。如std中的各种stl一样。

7. 如果需要为某个函数的所有参数进行类型转换，如支持`int * a => int *a`，那么这个函数必须是个non-member function。

8. 对于pimpl手法的类，往往可以自己提供更高效的swap。default swap函数定义

   ```c++
   namespace std{
       template<typename T>
       void swap(T &a,T &b){
           T temp(a);
           a = b;
           b = temp;
       }
   }
   ```

   对std::swap特化

   ```c++
   namespace std {
       template<> //表示它是std::swap的一个全特化
       void swap<Widget>(Widget &a,Widget &b){ //表示这一特化版本是针对T为Widget设计
           a.swap(b);
       }
   }
   ```

   但是对于Widget是个template的情况，我们只能partially specialize class templates,不可以 partially specialize function templates。一般可以通过overload

   ```c++
   namespace std {
       template<typename T> //表示它是std::swap的一个全特化
       void swap(Widget<T> &a,Widget<T> &b){ 
           a.swap(b);
       }
   }
   //但是c++不允许向std添加新东西，所以这不合法
   ```

   所以可以直接添加到其命名空间中

   ```c++
   namespace WidgetStuff {
       template<typename T> //表示它是std::swap的一个全特化
       class Widget {...}; 
       
       templat<typename T> 
       void swap(Widget<T> &a,Widget<T> &b){ //这儿并不属于std
           a.swap(b);
       }
   }
   // ok,可以
   ```

   看到swap,c++回去查找global作用域或T所在命名空间内任何T专属的swap。所以调用时务必注意。若

   调用std::swap，会使得编译器忽略掉template特化。

   ```c++
   using std::swap;
   swap(obj1,obj2);
   ```

   注意swap成员函数不应抛出异常。因为swap用途就是帮助class内部其他函数提供异常安全性保障。

#### 实现

1. 尽可能延长变量定义式的出现，避免无意义的构造析构以及default构造被调用
2. 尽量避免转型，类型转换往往真的令编译器编译出运行期间执行的码。例如`double x = (double)2/3;`会首先生成一个底层为double，值为2的变量
3. dynamic_casts的代价高昂，可以以使用类型安全容器存储派生类指针或提供virtual函数，在不支持的base class中do nothing的方式来尽可能替代。
4. 如果转型必要，可以试着将他们隐藏在某个函数内部，客户可以调用该函数，而不需在自己代码中进行转型。
5. 避免返回handles(reference,pointers,iterators)指向函数内部，降低(dangling handles)的可能性。（导致handle比其所指对象更长寿）
6. 异常安全函数保证异常时不泄露任何资源，不允许数据败坏。异常安全函数提供三种保证之一： 
   - 基本承诺：当异常抛出，程序内任何事物保持在有效的状态，不会有对象或数据结构被破坏
   - 强烈保证：如果异常抛出，函数失败，程序会回复到调用以前的状态
   - nothrow 保证，承诺不抛出异常。
7. 强烈保证往往可以通过copy-and-swap实现，即构造一个副本，在副本上做修改，而后swap。
8. 函数提供的异常安全保证最多只等于其所调用函数的异常安全保证的级别。应该尽可能写出较高异常安全保证的函数。
9. inline函数应放在头文件内，因为其替换是在编译器进行。编译器不会对函数指针调用的inline函数实施inline
10. 不要在copy construct,destruct,virtual function 中使用inline,那会导致许多开销。
11. 谨慎使用inline,非inline对调试更友好。且对用户而言，也不会因为函数内部实现变化导致需要重新编译。
12. 尽量做到接口与实现分离，以声明依存性替换定义的依存性。可以使用pimpl idiom和Interface class的方式来降低编译依存性。
13. 程序库头文件应该以完全且仅有声明式的形式存在。

#### 继承与面向对象设计

1. public继承意味is-a,适用于base class身上的每一件事情一定也适用于derived class
2. derived class内名称会遮掩base-class内名称，public继承不应如此。
3. 为了让被遮掩的名称可见，可以使用using声明式或者转交函数(forwarding functions)
4. non-virtual function,是继承接口和实现，pure virtual  function只继承接口，impure virtual function同时继承接口和缺省实现。
5. 若想提供缺省实现，但又避免使用者默认调用。可以另加一个protetected 函数供derived class调用。或者声明为pure virtual,但是提供实现，供子类主动调用。
6. 有很多方案可以替代virtual函数
   - **NVI(non-virtual interface)手法**，接口为non-virtual 函数，在其内部调用virtual部分。从而可以很方便在interface内做一些公共处理准备工作。
   - 将上述virtual函数替换为Function Pointers,构造时传入函数指针，在interface内部调用function pointers。这样更加灵活，不同对象可以对应不同函数，且便于变更。但是，若需访问类内部成员，会降低封装性。**Strategy 模式**
   - 使用function template替代内部virtual函数。**Strategy模式**
   - 将上述成员函数指针替换为该方法基类的指针。接口内部，调用该方法基类指针的virtual函数。（计算方法为类，具体不同的计算设计为不同的derived class）**Strategy模式的传统实现**
7. 不要重新定义一个继承来的函数的缺省值，因为默认值是静态绑定，编译器确定。所以会出现调用子类函数，使用基类默认参数的情形。
8. 可以使用NVI手法，将默认参数放于non-virtual-interface中。可以避免掉必须指定相同默认参数带来的代码相依性。 
9. composition(复合)意味着is-implementated-in-terms-of
10. private继承意味implemented-in-terms-of，意味着只继承实现部分，不继承接口。尽可能使用复合替代private继承
11. 也可以构造一个public继承的子类，把该对象作为成员对象。从而避免private继承，变为复合关系。
12. private继承劣势：
    - 其再继承的derived class虽不能调用上上层基类的virtual function,但是依然可以重新定义它。
    - 使用复合替代，这样可以降低编译依存性。只需具体实现中包含待使用库类的头文件即可。
13. private继承可以造成empty base最小化。
14. 多重继承比单一继承复杂，可能导致新的歧义性，也会增加大小，初始化等成本。尽量让virtual base classes不带任何数据
15. 多重继承偶有正当用途，例如public继承某个interface class,private继承某个协助实现的class

#### 模版与泛型编程

1. 对于class,接口是显示的，多态通过virtual发生于运行期。而对于template，接口是隐式的，多态通过template具现化和函数重载解析发生于编译器。

2. 声明template参数时，前缀关键字class和typename均可，没区别

3. 函数内部会默认nested dependent names非类型，需要使用typename放在前面以标识它nested dependent type name。但不可在base class list和member initialization list前标识typename

4. 当derived class继承一个模板化基类时，其默认调用基类接口会失败，因为编译器认为其可能继承自一个特化版本的base class template，从而可能不提供那个接口。想要调用的话，可以调用前加this->或函数内部使用using声明式的方式，或直接baseclassname::接口的方式来显示将其引用进内部。

5. templates生成多个class和多个函数，所以templates代码不该与造成膨胀的template参数产生相依关系

6. 因非类型模版参数造成的膨胀，可以通过以函数参数或class成员变量替换template参数而消除膨胀

7. 因类型参数造成的膨胀，可以使完全相同二进制表述的具现类型共享实现码，如只使用一份底层实现（void*）操作实现

8. 使用member function templates(成员函数模版,成员函数参数有单独template类型)生成“可接收所有兼容类型”的函数。

9. 如若member templates用于generalized copy construct或generalized assignment，此时还是要声明正常的copy construct和copy assignment函数，否则如前所说，编译器会生成default construct和default assignment

10. 当一个class template提供与此template相关的函数支持所有参数之隐式转换时，需要将其定义为定义在class template内部的friend函数。

    

    
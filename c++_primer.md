## 1 chapt ##
```
//cin>>xx  可以作为判断语句
while(cin>>x)
    ...
    
```

## 2 chapt ##

assign a int a too large value,always overflow,may be a minus number

assign a unsigned a too large value,it's will be on it's max number


signed num +/- unsigned num ,will convert the signed num to unsigned num,res will also be unsigned 

#### 初始化 ####

```
int x = {z};
int x{z};
int x(z);
int x=(z);
int x = z;
```
{} 为精准匹配初始化,不可降低原始数据精度

`int x = {z}` 等价于 `int x{z}`
```

//initialization
long long ld;
int x = {ld}; //error
long long y = ld; //ok
```

```
//a extern variable can be declared more times,but definition once
extern int a; //declare
extern int a=3; //definition,分配空间等
```

#### 指针 ####
使用nullptr而不是NULL,NULL是宏定义等0，而nullptr是一个字面量，一个具有特殊类型的可以被转化为任何指针类型的值。

#### const ####
1. const变量初始化时间取决于值的特性，可能是在编译期，也可能是在运行期。
2. 对于extern variable,const 限定只针对当前文件有效。所以定义声明均需写作`extern const xx`
3. const引用及指针是有自己的内存空间的。指向temporary memory
```
//x 是float类型
const int &y = x; //ok
//
int &y = x; //error
```
4. constexpr限定确保了该初始化在编译期间完成，如该操作不能编译器间完成会报错
5. constexpr与const 修饰指针时含义不同
```
const int *p = nullptr; //low level
constexpr int *p = nullptr; //top level
constexpr const int *p = &i; //top-low level

int *const p = v; //top level
```
6. only low-level const pointer or const reference can relate to const variable.  (top level const,itself const)
7. 当使用literal variable （含类型转换，float转为int也被视作literal variable）初始化const&时，const &变量会有自己的内存空间，原始值变更不影响const&值。但若是相匹配类型的变量初始化，则其只是设置了一个only-read位，仍引用初始化变量的内存空间。
9. constexpr指针需要指向一个具体的编译前后即确定的地址，故可以指向全局变量。constexpr low level

#### 类型别名 ####
```
typedef double xx;
using xx = float;

//notice 别名代表类型,const 此时只意为top-level
typedef char *pstring; //pstring is char *

const pstring cstr = 0; //top-level
```

#### auto ####
**auto 通常忽略top-level const,忽略引用,只保留low-level const。**
```
//人为指定top-level,
const auto &j = 2; //top-level 
```
注意一个auto 只代表一个类型
```
//i 为 int, ci为const int
auto &n = i,*p2 = &ci; //error,auto cannot both be int and const int
```
#### decltype ####
仅获得返回类型，不会具体对decltype中对表达式 求值。<br>

**相较auto于，保留了top-level和引用。同时要注意，decltype(\*p)得到的是一个引用类型**
```
decltype(f()) sum = x; 

//p type is int * 
decltype(*p) c ;  //error,c is int&,must be initialized

decltype((i)) d;  //decltype((xx)) must be a reference type
```


## chapt 3
1. header file shouldn't include using delcaration
    ```
    string s = "hhh"; // usse copy initialize
    string s("hh"); // using direct initialzie
    ```
2. vector can be compare,just like string

#### iterators ####
对于只读数据，可以使用const_iterator

#### array ####
对于vector等容器而言，下标为unsigned int类型，而对于array,pointer等内置类型而言，下标可以为负。
begin(ia),end(ia),cbegin(ia),cend(ia)取指针。
```
int a[3][4];

// true
for(const auto &row:ia)
    for(auto col:row)
        ;//do something
        
// error,row not ref,so row will be convert a int*,it's illeger 
// to subscript a int *
for(auto row:ia){
    for(auto col:row)
        ;
}

// legal
for(auto p = begin(ia);p!=end(ia);p++){
    for(auto q = begin(*p);q!=end(*p);++q)
        ; // do something
}
```
##### alias

```
using int_array = int[4];
typedef int int_array[4];
```

## 4 chapt ##

#### lvalue,rvalue ####
- rvalue: use it,we use the object's value
- lvalue: use it, we use the object's identity

<p>

一些运算符需要lvalue,例如:
- assignment: 需要lvalue,return lvalue
- & : lvalue,return lvalue
- 取下标：lvalue,return lvalue
```cc
decltype(rvalue);   //res type is xx 
decltype(lvalue);   //res type is xx&

decltype(*p);  // int&,lvalue
decltype(&p);  // int**,ravalue
// *p 是lvalue

// 运算符通常不能保证，内部的执行顺序。除了&& || ?: ,
int i = f()+g(); // f和g的先后执行顺序不能保证
```
#### sizeof ####
```

sizeof(arr);  //return the whole array size
sizeof(vector); // return the vector fixed part 

sizeof(arr)/sizeof(*arr); //return the number of element in ia
```
 `sizeof`只取类型，不会实际解引用和计算，所以即使invalid pointer ，也是ok的。<br>
 `sizeof`returns a constant expression.

 #### type conversion ####

 ##### static_cast #####
 非涉及到const等的转换,非涉及到底层位的表示等情况。
 ```
 double yy = static_cast<double>(i); 
 ```
 ##### const_cast #####
 changes only low-level const,用于丢弃low-level const 

 using this to write a original const object is undefined(const变量 存储的位置不同)
 ```
 const char *pc;
 char *p = const_cast<char *>(pc); 
 //if the dereference object is self const,then result will be undefined
 ```

##### reinterpret_cast #####
改变low-level对于底层bit位的翻译。it's dangerous
```cc
int *ip;

char *pc = reinterpret_cast<char *>(ip);
//此时若用static_cast,会报错。
```

##### old_style casts #####
实际表现为static_cast,const_cast,reinterpret_cast的综合。不直观。
```
char *pc = (char*) ip; //ip is a pointer to int
```


## 6 chapt ##
- 相较于`&`,尽量使用`const &`作为参数，，这样该函数便可被其他函数调用，传入`const`实参。
- 对于数组arr而言，arr含有其起始地址和长度信息，而当传参之后(*,[])，会退化成普通指针，丢失长度信息。所以sizeof结果不同也很自然。

```
// initialize list 作为参数
void test(initializer_list<string> i1){
    for(auto beg = i1.begin();beg!=i1.end();++beg){
        cout<<*beg<<"";
    }
}

test({"aa","bb"});
```

函数返回
1. 函数的声明有简化形式
```cpp
auto func(int i) -> int(*)[10];  
// return type is int(*)[10]
```
2. 可以使用decltype
```
int odd[] = {1,2,3,4,5};

decltype(odd) *func(int) {
    ...
}
//return a pointer to an array of 5 i
//notice the *, decltype(odd) is an array ,add a * so make it a pointer
```
#### overload ####
同一作用域，同样函数名不同参数的函数。

- 对于变量，const和non-const视作相同
- 对于pointer,top-level const参数视作相同，low-level const参数视作不同
- 对于reference,const和non-const视作不同


一个函数，同时重载为const arg version and nonconst arg version is good,so it can be all called. in nonconst arg version,call const version

###### const_cast ######
const_cast 在重载时有时会十分有用
```
string fun(const string &,const string &);

//实现非const&版本
string fun(string &s1,string &s2) {
    //添加top-level const,以避免其调用到自身
    auto &res = fun(const_cast<const string&>(s1),const_cast<const string&>(s2));
    return const_cast<const string &>(res);
}
```
##### scope #####

故不应当在函数内部声明函数。

1. inner scope声明的name会覆盖掉外层的name,variable和function name也会相互覆盖掉。这样编译器是看不到外层scope的，倘若内层不匹配，便会直接报错或者强制转化<p>
在编译器查找函数时，会先查找可见的未hide name。。然后才在这些unhide name中find best match。所以如果在scope内部若有声明同名function,会直接hide all scope外部的函数。
2. default argument函数的default arg若使用变量，其是在调用时才查找使用的，其可能会被scope内变量覆盖掉。
```
int w,t;
int fun(int = w,int = t);

f() {
    int w = 2;
    fun(); //实际调用的是fun(2,t);
}
```

##### constexpr #####
constexpr function是指可当作constant expression使用的。如为const expr变量赋值，作为array大小等。
constexpr function :(其可以在编译期间完成)
- return type,each parameter type must be a literal type
- function body must contain exactly one return statement

constexpr function在参数为canstant时，must返回constant值。但可以在参数非constexpr时，返回非constant value。<br>
故所以有时调用constexpr函数(使用非constexpr变量) 在需要constant expression的场合，可能会报错。编译器在遇到must constant的场合时，会先检查是否是constant expression，不然，会直接编译报错。<p>

constexpr和inline函数应当定义在header中。

##### debug #####
```
assert<xxx> //assert some condition must true,assert是macro

//其常常配合NODEBUG使用，当NODEBUG defined,assert will do nothing
#ifndef DEBUG
//....cerr
#endif
//..
```

##### function match #####
1. 找出该name的所有可见函数（ingnore hide function）
2. 找出所有使用当前参数可以调用的函数(若无，则compile报错)
3. 找出best match(若无，则报错；若multiple convert,but no best，报错)

type转换优先级 (when find best match)
1. exact match
2. non-const To const
3. 提高精度，promote类型，，精度越高越优先
4. 数学转换或者pointer转换(array with pointer)
5. 类的转换
notide: 
- for char, 其match int,而非short
- for 3.14,其向int,与float均为4转换，所以依旧是ambiguous call


##### 函数指针 #####
`  int (*pf) fun(int,int); //声明函数指针变量`
- 在为函数指针赋值和使用函数指针时，是否*，是否& same
- 函数指针赋值，参数和返回参数应精确匹配
- 可以使用函数指针作为函数的parameter,里面是否加`*` same
    ```
    void xxx(int,int,int (*pf)(int,int));
    void xxx(int,int,int pf(int,int));
    //same
    ```
    

but,notice when we use decltype,`decltype(func)`,返回的是function type,if we want a function pointer,we should add a \*
```
typedef decltype(funa)  fa; //fa have function type,不可作为return type
typedef decltype(funa) *fb; //fb have pointer to function type,可以作为return type
```

###### 函数指针作为return type

```
using F = int(int *,int); //function type
using PF = int (*) (int *,int *); //pointer type

//F cannot as return type,PF or F* ok 
```

##### using decltype,auto for function pointer types 
```
std::string int xx(string,string);

decltype(xx) *getFcn(string); // so getFcn函数返回一个函数指针

```

## 7 chapt ##

##### constructor #####
- `A() = default;` ,明确了自动产生A的生成 默认构造函数
- 默认构造函数会将所有成员变量初始化(using 零值or 调用其构造函数)
- member variable 可以在declare时同时指定默认值，such as `xx a{yy};`
- 类变量：初始化顺序按照其类内的声明顺序
- 一个提供了所有argument default value的空构造函数也就等于其声明了default constructor函数。

###### member function ######


当成员函数内，变量被hide name时
- 类变量，this->x,A::x;
- 类外，::x 


###### const ######
const memeber function:用来表示this的low-level。对于一个const 对象，其或其reference/pointer 不可调用non-const成员函数。
- 可以定义变量为mutable，`mutable type xx;`,can change it even in const member function
```
xx A::fun() const{
}
```

const member function can only return const &,so:
```
const xx A:xxx{};
const A& A:yyy{};
A a;

a.xxx.yyy(); //wrong,a.xxx return a const &
```
故可以定义一个xxx的const 版本和non-const 版本，主要工作均在 `const xxxx{}`中完成，`const xxx`和`non-const xxx`均call xxxx{}<p>

we can declare class like `class B;` 

当类内容变化，使用该类的文件也需要重新编译。
###### friend ######
- 对于friend函数，通常除在函数内，在该class defined的header文件中的class外部也must再declare一次。其不受限于access level。。其在函数内部定义只强调了access level,编译器仍不知道该函数
- 可以将other class的成员函数作为friend 
- 声明应写在前面，写在用到他的函数之前
- 即使在类内定义了，同样需要在类外声明。类内的declare affect access control,但是这并不是通常意义的声明。

###### typedef--using type ######
class内部可以有typedef等定义type,其受限于access level。但不可被redefinition
- 需要写在首部
- `A::TA A::func(TB){};  //return type need A说明,arg needn't `

##### member function
inline member function can use in both defenition or declration,we should use it only in defenition,and defenition in same header 

mutable,用以修饰成员变量，即使是const成员函数也可修改它。

可以在声明成员变量的时候同时初始化值，使用{}或=的形式

类成员initialize list construct会按照声明顺序来初始化。而非初始化顺序。
###### implicit conversion ######
```
`xx f(A a);

//valid if A has a constructor with a int,if A isnot explicit
int t; 
A b = t; 
`t = f(t)`; 

t = f(static_cast<A>(t)); //valid even a is explicit
```
we can use explicit in declare to prevent implicit conversion


###### aggregate class ######
**聚合类**: same with c-struct<p>
it can be initilize with member order
Data A = {2,3,0.0}; //A{int,int,double}


###### literal classes ######
可声明一个该类的constexpr对象，其member function亦可为constexpr


###### static ######
须在class外定义，最好定义在定义在成员函数的定义文件中。<br>
constexpr static member variable 可以在declare时指明初始值，但仍需函数外定义(否则传参给其他函数，会导致编译失败）

- 类可以定义一个当前类类型的静态成员变量or指针或引用。
- 静态成员可以作为构造函数的默认参数


###### summary ######

| const               | friend      | explicit              |
| ------------------- | ----------- | --------------------- |
| 声明定义均要加const | declare     | only inside the class |
| row 2 col 1         | row 2 col 2 |                       |

## chapt 8 ##
对于无法default construct的type，只能用指定初始值的方式构造vector,like `vector<noDefault v1(10,init)`<p>
常常可以用其他容器类型的值来初始化一个容器，如用一个dequque初始化一个vector等
###### type ######
```
vector<int>::iterator iter;
vector<int>::difference_type count;
```

## chapt 9 ## 
emplace_back();的区别在于可以省略构造函数，直接构造并push入容器。但参数应和构造函数完全一致。
如
```
vector<vector<int>> vvi;
vvi.emplace_back(13,1);

vi.resize(n,val);
```

使用iter，在容器变化的时候，会失效，需要重新赋值，如
``` 
iter = vi.insert(iter,*iter);
```
使用at而非直接下标的方式，这样出错会报exception，而不是程序崩溃

不要把`v.end()`储存在变量中，要每次用时直接使用。否则容器变化，`end()`也会发生变化。
`find`从前往后查找，`rfind`从后往前查找

## chapt 10 ##

注意insert iterator的存在,有些库函数要求传入insert iterator
```
auto it = back_inserter(vec); // it is a insert iterator
*it = 3;    //会向vec末尾插入元素
```

排序
```
bool isSmaller(xx,xx){
    //notice only less return true
}

sort(w.begin(),w.end(),isSmaller); 
stable_sort(w.begin(),w.end(),isSmaller);
```

`for_each()` take a callable object that in the range

##### lambda #####
[capture list](parameter list) -> return type {function body};<br>
capture list和function body不可省略，其他皆可省略<p>
```
[x](int x) -> int {
    return x
};
auto f = []{return 20};
```
lambda不能无默认参数

lambda只可捕获local nonstatic variable,local static and 函数外变量lambda可以直接使用。
######  capture list #######
- [x]: copy,在lambda创建时，将捕获变量并copy之以后都使用该值，而非call时才copy，故对该值的更改不会影响lambda
- [&x],在对该值更改时影响lambda。我们应该保证在执行lambda时，该引用对象依然存在
- [&],[=]捕获所有，可以加参数，显示引用所需要的
- [&，c],默认捕捉function body中用到的引用变量,c以copy形式。
- [=]同理，使用function body中用到的copy对象(implicit capture)
- copy捕获变量不能更改，可以加mutable来使得其可以更改，下一次调用该lambda时，则使用更改后的值。而reference捕获变量只要是引用非const variable，即可更改


######  return type #######
return type 可以省略，只有当只存在一句return语句时。如function body中有多句return(if return -else return )，且无明确return type，则会error

###### bind ######
可以将函数的某些参数bind,这样就相当于创建了不同arg的函数，可以传给库函数作为实参。
```
void f(int x,int y,int z);
g = bind(f,_1,3,2,_2);
// in fact,it's std::placeholders::_1
// so we declare
using namespace std::placeholders;

//可以将g当作只含两个参数的函数，并且传给库函数，g(x,y) will actually call f(x,3,2,y);

//相当于如下：
void g(int x,int y){
    f(x,3,2,y);
}


//for 引用参数bind
void f(ostream &os,string s);
g = bind(f,ref(os),_1); //cref关键字是指作为const reference

```
#### revisiting iterators ####

##### insert iterator #####
可以用于向其解指针的空间赋值,`*it=x`,执行结果会是插入x
- `back_inserter(vi);` 返回末尾iterator，赋值use`push_back(x)`
- `front_inserter(li);` 返回首iterator,赋值use `push_front(x)`
- `inserter(vi,it);` 返回it对应的insert iterator,赋值use 向it之前的位置insert x

##### iostream iterator #####
可以用cin,fstream对象等初始化。

##### reverse iterator #####
`vi.crbegin(),vi.crend()`,与iterator一样使用，但是++会前移等


## 11 chapt 
set等可以用`s.find(key)==s.end()`来判断key是否存在在set中。<br>
- iterators for set are all const
- 可以用自定义class构建map,unordered_map等，只要在定义时传入比较函数和hash函数即可。

```
dmap.insert(make_pair("aa",1);

//使用find而不是下标引用，以避免误引入元素
auto it;
if((it=dmap.find("aa"))!=dmap.end()){
    cout<<it->second;
}
```

对于mutlimap，查询元素：
```
//iter起始，++count次即遍历了该key之对应元素
int count = dmmap.count("a");
auto iter=dmmap.find("a");
~76             
//
beg = dmmap.lower_bound("a");
end = dmmap.upper_bound("a");

//
for(auto pos=dmmap.equal_range("aa");pos.first!=pos.secound;pos.first++){
    cout<<pos.first->second << endl; //遍历输出val    
}

```

## 12 chapt 

#### shared_ptr 
```cc
//declare
shared_ptr<string> p1; 

//initialize
shared_ptr<int> p3 = make_shared<string>(10,'9'); 
auto p3 = make_shared<string>(10,'9'); 
auto p4 = make_shared<vector<string>>(); //亦可

auto p5(p3); // p5 also be smart pointer,会增加p3指向对象的引用次数
```
注意若将shared_ptr保存在容器中，要注意检查及时清除该数据，以免所指向空间一直得不到释放。

```
auto p1 = new auto(obj);  //value initialize can use auto 
```

注意new语句 初始化智能指针时一定要显式初始化，显示转换，如下
```
shared_ptr<int> p1 = new int(1024); //error
shared_ptr<int> p2(new int(1024));  //ok
//当需再赋值时
p2.reset(new int(1024)); //ok
```
同样，shared_ptr可用普通指针初始化！但请务必不要混着使用！最好不要用普通指针初始化。极易出问题！<p>

1. 如果使用了get(),就务必保证不要释放这个指针
2. 不要用get()后的值再去为智能指针赋值

可以使用smart_pointer来封装connect等，即为自定义类型创建指针，同时指定 delete function
```c++
void end_connection(connection *p):
{
    connection c = xx;
    shared_ptr<connection> p(&c,end_connection); //此时指针指向的便不是堆内存，但也是可以的。
 }
 // 当跳出brace,调用的不再是delete，而是end_connection，即使exception，也能保证连接被关闭。颇似go中defer的作用。
```
###### default initialize
string等为空字符串，内置类型undefined。
- 默认构造函数，class内成员数据default initialize
```
new int;  //undefined
new int(); //value initialize,0
```
#### unique_ptr 
unique_ptr cannot assign,caanot copy,除非是赋值为nullptr,除非是作为return value引起的copy-
- `u.reset(q)` 重新赋值，原指向空间free
- `u.release()` 交出绑定权，自身变为nullptr，返回内存地址，注意不会释放内存
- `u.reset()`,释放内存
```
    u2.reset(u3.release()); //ok
    p2.release(); //cause memory leak
    auto p = p2.release(); //注意delete，此时p不为智能指针
```

可以为自定义类型创建指针，但注意其会改变unique_ptr类型
```
    //如上，自定义delete函数 
    unique_ptr<connection,decltype(end_connection)*> p(&c,end_connection);
```

#### weak_ptr
使用`shared_ptr`初始化。若binding,将`shared_ptr`赋值给之不会增加引用次数。访问前，可以先用`wp.lock()`检测之，若已失效，则return nullptr。其可用于表征一个`shared_ptr`if valid
```
if(shared_ptr<int> np = wp.lock()){
// wp有效，以下则对np操作，若无效，则为nullptr
}
```


## chapt 13
#### copy constructor
- 形式：`Foo(const Foo &);`，notice此处必须为&,否则传参调用copy函数,copy常常隐式使用，故不应explicit
- 调用：`xx s(dots)`会调用构造函数,而`xx s = dots;`则为copy initialization调用copy constructor
- copy initialize中，copy constructor优先级小于move constructor
- 传参、值返回、{}初始化聚合类时均会调用copy constructor


#### copy assignment
- 形式：`Foo& operator=(const Foo&);`
- 调用： `A = B；`
````
x& x::operator=(const x&val){
    a = val.a;
    b = val.b;
    return *this;
}
````

**copy-construct,copy-initialize,destruct通常应都构造或者都不构造**


注意copy structor 要务必注意处理赋值给自己的情形。先copy，再delete自身原有值。



##### swap

定义swap函数有时候可以提高代码执行效率。

friend  void swap(a&,a&);

使用时候应该用

```c++
using std::swap;
swap(x,y); 
//否则std::swap会忽略掉该类本身自定义的swap
```

对于定义了swap函数的类而言，copy constructor 内可以直接调用swap

```c++
A &A::operator=(A rhs){ // 注意不是引用
    swap(*this,rhs);
    return *this;
}
```

#### rvalue reference

rvalue: temporary object or literals。 

rvalue,we can bind it with lvalue const reference or rvalue reference 

we use std::move instead of move

```
int &&rr1 = i;   // error,lvalue 
int &&rr1 = i*42; // ok

int &&rr3 = rr2; //error
int &&rr3 = std::move(rr2); //ok,but 之后rr2 value undefined
```

##### move construct

```
A:A(A &&a) noexcept {}
// noexcept should be specify both in declare and defenition,(no throw exception)

// 因为比如对于vector的push_back而言，如果其内元素定义了move noexcept，其在resize时便不必使用copy construct而不是move construct，不必再保持相关状态便于恢复，提高了效率。
```

##### move assignment

```c++
// 亦需要检查自我赋值，所以务必检查
A &A::operator=(A &&a) noexcept{
    if(this != &rhs){}
}
```

move construct默认定义需要：有copy构造函数，move 函数，析构函数。



对于有copy和move的对象，在普通赋值操作中，右边rvalue是move操作，右边lvalue是copy

若无move函数，则move时会执行copy

##### member function

通常一个函数可以用分别定义一个(const A&)和(A &&)的参数的，后者用以专门接纳rvalue,后者在rvalue时可以直接内部执行move操作，更效率。

##### 重载

```c++
class Foo {
    // must define all this function with & or all not 
    Foo sorted() &&;  // rvalue object call this

	Foo sorted()  &;  // lvalue object call this
}
```


## chapt14
````c++
class A{
	A& operator--(); //prefix --
	A operator--():  //postfix--
	
	// 函数调用，a(i)
	int operator()(int val) const {}
}
//c++11 函数指针
function<int(int,int)> f1 = add;
map<string,function<int(int,int)>> fun;
//类型转换
//应尽量避免调用时ambigious的情况
class A{
	explicit operator int() const{}; //调用，static_cast<int>(a)
}
````
## chapt15
##### dynamic binding

发生在使用指针/引用调用虚函数时，run-time确定，多态

函数override时在末尾注明ovveride(新标准)

无论使用与否，destruct都应定义为虚函数。

继承类中可以直接使用基类的成员，不必区分。

static变量不可virtual,但是可override

##### 继承

class A final  {}; //A不能被继承

一个指针/引用 静态类型动态类型可能不同

不能将基类指针引用赋值给子类对象，因为静态类型不相容，可以用dynamic_cast实现这种转换。



##### 纯虚函数（pure virtual），抽象类

```c++
class A{
	void funca() = 0;//pure virtual function
}
```

但是纯虚函数可以在函数外有定义，拥有纯虚函数的类即是抽象类。

##### 访问权限

1. 子类的friend function只能通过子类对象访问基类protected成员。

2. private继承可以访问基类private成员，但是将所有基类成员都变成了private权限。
3. private继承，只有在成员函数或是friend函数中才可以进行子类->基类转换。
4. friend关系不继承，friend函数/类对于基类对象也只能访问其父类private成员。
5. private继承可在子类定义内public部分`using Base::memx;`使该成员变为public权限。
6. class默认是private继承，struct默认为public继承
7. 同前面函数内name lookup一样，子类覆盖了基类成员函数，但是参数不同，会把基类成员hide掉。
8. 所以继承时或者重定义所有重载函数或者均不重定义。或者public中使用`using Base::x`

##### contruct

1. 基类函数必须有virtual destruct，可以为空函数。

2. 自定义了destruct function,就不会生成默认的move function
3. 可以均明确declare，可以=default,从而move 可用
4. copy和assign子类不会自动调用基类相应函数，需手动调用。
5. 继承方式不会改变基类构造函数的访问权限。不可以用using方式改变。copy,move不会被继承。
#### basics

1. 当知道需要指向某个东西，并且绝对不会改变指向其他东西，或是当实现个操作符而难以用pointers而其语法需求无法由pointer达成时（如operator []的返回类型），就应该使用reference，否则该使用pointers。

2. 使用c++转型操作符替换c语言的操作符

3. 不要使用多态方式处理数组（为数组形参穿一个derived class array），因为数组设计到内部指针运算，内部对象sz不同，undefined。

4. 类没有default constructs会导致

   - 难以生成该类的数组。除非使用non-heap数组，指针数组或是placement new，申请rawMemory后，使用placement new(`operator new [](sz)`)的方式在内存上构造对象
   - 不再适用于许多template-base container class
   - virtual base classes若缺乏default constructor，其所有derived class都理解virtual base classes,并为其提供变量

   但是无意义的default constructor会影响效率，成员函数都需要先判定必须字段是否为空。故需谨慎考虑，对于必须某些字段的类，非必要则不应提供default constructor
#### basics

1. 当知道需要指向某个东西，并且绝对不会改变指向其他东西，或是当实现个操作符而难以用pointers而其语法需求无法由pointer达成时（如operator []的返回类型），就应该使用reference，否则该使用pointers。
<!--
 * @Author: LetMeFly
 * @Date: 2022-06-20 21:58:59
 * @LastEditors: LetMeFly
 * @LastEditTime: 2022-06-21 14:02:38
-->
# 语法分析

编译原理语法分析，包括LL(1)、LR(0)、SLR(1)、LR(1)、LALR(1)

+ 项目地址：[https://github.com/LetMeFly666/SyntaxAnalysis](https://github.com/LetMeFly666/SyntaxAnalysis)
+ 在线文档：[https://yffx.letmefly.xyz](https://yffx.letmefly.xyz) (语法分析.letmefly.xyz)
+ DFA可视化：使用[mermiad](https://github.com/mermaid-js/mermaid)
+ 网页使用[BootStrap](https://www.bootcss.com/)布局、使用jQuery

## 规则

**符号规则：**

+ **空格：** 文法和待匹配串中的空格会自动忽略，空格只可作为分隔符，不可作为终结符
+ **“|”：** 代表“或”。例如“S -> A | b” 代表 “S -> A” 和 “S -> b”。仅支持在“->”右侧出现
+ **“ε”：** 代表“空”
+ **“->”：** 代表“推出符号”，“->”左边出现过的都为非终结符，其余未提到的视为终结符

**其他限制：**

以下使用“_”代表空格

+ 非终结符和终结符中不能包含空格（“->”右边出现空格会以空格为分隔符划分，“->”左边出现空格，则空格必须出现在非终结符前后）
  > + ```A_->_a_b_B```合法。
  > + ```_A_->_a_b_B```合法。
  > + ```___A->_a_b__B```合法。
  > + ```_AB_->_a_b__B```合法。（```AB```视为一个非终结符）
  > + ```_A_B_->_a_b__B```不合法！（不能由两个非终结符推出一个表达式）
+ “->”前后都不能只包含空格
  > + ```->_a_b__B```不合法！
  > + ```A->_```不合法！
  > + ```A->a```合法。
  > + ```A->a|b```合法。（相当于```A->a```、```A->b```）
  > + ```A->a|```不合法！（相当于```A->a```、```A->```）
  > + ```A->a|ε```合法。（相当于```A->a```、```A->ε```）
  > + ```A|B->a```不合法！（暂不支持在“->”左侧使用“|”）
+ “ε”和“|”不能作为终结符或非终结符
  > + ```ε->a```不合法！
  > + ```|->a```不合法！
  > + ```BεA->a```不合法！
  > + ```BCA->a```合法。


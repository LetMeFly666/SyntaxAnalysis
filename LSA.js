/*
 * @Author: LetMeFly
 * @Date: 2022-06-20 23:12:30
 * @LastEditors: LetMeFly
 * @LastEditTime: 2022-06-20 23:22:21
 */
// LetMeFly Syntax Analysis.js

const samples = {  // 某种文法对应的样例
    LL1: {
        grammar: "S -> ( L ) | a\nL -> L + S | L - S | R\nR -> a",
        string: "( a - ( a + a ) )"
    },
    LR0: {
        grammar: "",
        string: ""
    },
    SLR1: {
        grammar: "",
        string: ""
    },
    LR1: {
        grammar: "S -> L = S | R\nL -> a L R | b\nR -> a",
        string: "a b a = b = a"
    },
    SALR1: {
        grammar: "",
        string: ""
    }
};
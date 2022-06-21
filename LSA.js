/*
 * @Author: LetMeFly
 * @Date: 2022-06-20 23:12:30
 * @LastEditors: LetMeFly
 * @LastEditTime: 2022-06-21 13:55:21
 */
// LetMeFly Syntax Analysis.js

const grammarSamples = {  // 某种文法对应的样例
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

function getNTG(grammars) {  // 获取终结符和非终结符、格式化后的语法
    /** 错误样例：
        ->A b
        A B-> c
        A->
        A->a|
        A|B->a
        ε->a
        |->a
        BεA->a
        A->aε
        A -> b -> c
        hello
    */
    /** 错误样例：
    
    */
    const NT = {
        N: new Set(),
        T: new Set(),
        formattedGrammars: [],
        error: []
    };
    const NandT = new Set();
    const lines = grammars.split("\n");
    var lineNum = 0;
    lines.forEach(line => {
        function isIn(a, b) {  // if a is in b
            return b.split(a).length > 1;
        }

        lineNum++;
        if (!line) {  // 空行
            return;
        }
        const arrowSplited = line.split("->");
        if (arrowSplited.length != 2) {
            if (arrowSplited.length > 2)
                NT.error.push("Error: 文法规则第 " + lineNum + " 行，不只包含一个“->”");
            else
                NT.error.push("Error: 文法规则第 " + lineNum + " 行，不包含“->”");
            return;
        }
        const front = arrowSplited[0];
        const back = arrowSplited[1];
        const frontSplited = front.split(" ");
        let N;
        frontSplited.forEach(e => {
            if (e) {
                if (N)  {
                    NT.error.push("Error: 文法规则第 " + lineNum + " 行，“->”左侧“" + front + "”包含不只一个非终结符");
                }
                else {
                    N = e;
                }
            }
        });
        if (N) {
            let cannot = false;
            if (isIn("ε", N)) {
                NT.error.push("Error: 文法规则第 " + lineNum + " 行，“->”左侧包含不合法字符“ε”");
                cannot = true;
            }
            if (isIn("|", N)) {
                NT.error.push("Error: 文法规则第 " + lineNum + " 行，“->”左侧包含不合法字符“|”");
                cannot = true;
            }
            if (!cannot) {
                NandT.add(N);
                NT.N.add(N);
            }
        }
        else {
            NT.error.push("Error: 文法规则第 " + lineNum + " 行，“->”前面为空");
        }
        const backSplitedOr = back.split("|");
        backSplitedOr.forEach(thisSplitedOr => {
            const backSplited = thisSplitedOr.split(" ");
            const allTs = [];  // 其实也不一定都是终结符，但是还是以“T”命名了
            var T;
            backSplited.forEach(e => {
                if (e) {
                    if (isIn("ε", e) && e != "ε") {
                        NT.error.push("Error: 文法规则第 " + lineNum + " 行，“->”右侧“" + e + "”中的“ε”不能出现在非终结符中");
                    }
                    NandT.add(e);
                    allTs.push(e);
                    T = e;
                }
            });
            if (!T) {
                NT.error.push("Error: 文法规则第 " + lineNum + " 行，“->”右侧出现空(Do you mean 'ε'?)");
            }
            NT.formattedGrammars.push({
                N: N,
                T: allTs
            });
        });
    });

    NandT.forEach(e => {
        if (!NT.N.has(e)) {
            NT.T.add(e);
        }
    });

    if (!NT.formattedGrammars.length) {
        NT.error.push("Error: 无有效语法规则");
    }

    return NT;
}
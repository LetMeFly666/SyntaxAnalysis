/*
 * @Author: LetMeFly
 * @Date: 2022-06-20 23:12:30
 * @LastEditors: LetMeFly
 * @LastEditTime: 2022-06-21 12:29:58
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

function getNT(grammars) {  // 获取终结符和非终结符
    console.log(grammars);
    const NT = {
        N: new Set(),
        T: new Set(),
        error: new Set()
    };
    const NandT = [];
    const lines = grammars.split("\n");
    var lineNum = 0;
    lines.forEach(line => {
        lineNum++;
        if (!line) {  // 空行
            return;
        }
        const arrowSplited = line.split("->");
        if (arrowSplited.length != 2) {
            NT.error.push("Error: 第" + lineNum + "行，不只包含一个“->”");
        }
        const front = arrowSplited[0];
        const back = arrowSplited[1];
        const frontSplited = front.split(" ");
        let N;
        // frontSplited.forEach()
    });

    return NT;
}
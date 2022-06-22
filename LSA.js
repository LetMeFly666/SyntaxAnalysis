/*
 * @Author: LetMeFly
 * @Date: 2022-06-20 23:12:30
 * @LastEditors: LetMeFly
 * @LastEditTime: 2022-06-22 19:52:29
 */
// LetMeFly Syntax Analysis.js
const KONG = "ε";

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

function rand1newName(name) {
    return name + Math.floor((Math.random()*1000000)+1);
}

function leftFactoring(NT) {
    /* 
        A->L a
        A-> L b
        A->L c d a
    */
    function leftFactoringOnce(NT) {  // 提取左因子，每次只提取一个左因子
        var changed = false;  // 是否修改了
        NT.N.forEach(e => {
            const firstOfRight2grammar = {};
            NT.formattedGrammars.forEach(e2 => {
                // console.log(e2);
                if (e2.N == e) {
                    const firstOfRight = e2.T[0];
                    if (firstOfRight2grammar[firstOfRight]){
                        firstOfRight2grammar[firstOfRight].push(e2);
                    }
                    else {
                        firstOfRight2grammar[firstOfRight] = [e2];
                    }
                }
            });
            for (key in firstOfRight2grammar) {
                if (firstOfRight2grammar[key].length > 1) {
                    const newN = rand1newName(e);
                    NT.N.add(newN);
                    changed = true;
                    const NTnewGrammars = [];
                    const thisNewGrammar = {
                        N: e,
                        T: [newN]
                    };
                    NTnewGrammars.push(thisNewGrammar);
                    firstOfRight2grammar[key].forEach(lefted => {
                        // console.log(lefted);
                        const thisNewGrammar = {
                            N: newN,
                            T: []
                        };
                        if (lefted.T.length == 1) {
                            thisNewGrammar.T.push(KONG);
                        }
                        else {
                            for (var i = 1; i < lefted.T.length; i++) {
                                thisNewGrammar.T.push(lefted.T[i]);
                            }
                        }
                        NTnewGrammars.push(thisNewGrammar);
                    });

                    function pushGrammarNotinB(A, B) {

                        function ifThisAInB(thisA) {
                            function ifEqual(a, b) {
                                if (a.length != b.length)
                                    return false;
                                for (var i = 0; i < a.length; i++) {
                                    if (a[i] != b[i]) {
                                        return false;
                                    }
                                }
                                return true;
                            }
                            for (var i = 0; i < B.length; i++) {
                                if (thisA.N != B[i].N)
                                    continue;
                                if (ifEqual(thisA.T, B[i].T)) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        A.forEach(thisA => {
                            if (!ifThisAInB(thisA)) {
                                NTnewGrammars.push(thisA);
                            }
                        });
                    }

                    pushGrammarNotinB(NT.formattedGrammars, firstOfRight2grammar[key]);

                    NT.formattedGrammars = NTnewGrammars;
                }
            }
        });
        NT.formattedGrammars.sort();
        return [NT, changed];
    }
    // while (true) {
    //     const newNT = leftFactoringOnce(NT);
    //     function ifSameNT(newNT, NT) {
    //         function ifSameArray(a, b) {
    //             if (a.length != b.length)
    //                 return false;
    //             for (var i = 0; i < a.length; )  // 未完待续
    //         }
    //     }
    //     if (ifSameNT(newNT, NT)) {
    //         return NT;
    //     }
    //     NT = newNT;
    // }

    while (true) {
        const result = leftFactoringOnce(NT);
        if (!result[1]) {  // changed = false
            return result[0];
        }
    }
}

function ifSameArray(a, b) {
    if (a.length != b.length)
        return false;
    for (var i = 0; i < a.length; i++) {
        if (a[i] != b[i])
            return false;
    }
    return true;
}

function ifSameGrammar(a, b) {
    return a.N == b.N && ifSameArray(a.T, b.T);
}

function ifSameSet(a, b) {
    function aAllinB(a, b) {
        let result = true;
        a.forEach(e => {
            if (!b.has(e))
            result = false;
        });
        return result;
    }
    return aAllinB(a, b) && aAllinB(b, a);
}

function ifSameFirst(a, b) {  // 前提是key全部相同
    for (key in a) {
        if (!ifSameSet(a[key], b[key]))
            return false;
    }
    return true;
}

function leftRecursion(NT) {
    /*
        A-> B
        B->A a
    */
    /*
        B->A a
        A -> B
    */
    /* 
        A -> B
        B->C
        C-> A a
    */
    /*
        A->B a| A a| c
        B->B b| A b| d
    */
    while (true) {
        changed = false;

        function leftRecursionOnce(beginWith) {  // 以beginWith开头的非终结符存在左递归
            function CaiFen() {  // 将所有语法规则分成：[以beginWith开头的且第一个是beginWith的, 以beginWith开头的且第一个不是beginWith的，不以beginWith开头的]
                const bb = [];
                const bn = [];
                const n = [];
                for (var i = 0; i < NT.formattedGrammars.length; i++) {
                    const thisGrammar = NT.formattedGrammars[i];
                    if (thisGrammar.N == beginWith) {
                        if (thisGrammar.T[0] == beginWith) {
                            bb.push(thisGrammar);
                        }
                        else {
                            bn.push(thisGrammar);
                        }
                    }
                    else {
                        n.push(thisGrammar);
                    }
                }
                return [bb, bn, n];
            }
            const CaiFenEd = CaiFen();
            const bb = CaiFenEd[0];
            const bn = CaiFenEd[1];
            const n = CaiFenEd[2];
            if (bn.length) {
                const newName = rand1newName(beginWith);
                const newGrammar = {
                    N: newName,
                    T: [KONG]
                };
                n.push(newGrammar);
                bb.forEach(e => {
                    const newGrammar = {
                        N: newName,
                        T:[]
                    };
                    for (var i = 1; i < e.T.length; i++) {
                        newGrammar.T.push(e.T[i]);
                    }
                    newGrammar.T.push(newName);
                    n.push(newGrammar);
                });
                bn.forEach(e => {
                    e.T.push(newName);
                    n.push(e);
                });

                NT.formattedGrammars = n;
            }
            else {  // 全是 A->A a 的形式
                for (var i = 0; i < bb.length; i++) {
                    for (var j = 1; j < bb[i].T.length; j++) {
                        bb[i].T[j - 1] = bb[i].T[j];
                    }
                    bb[i].T[bb[i].T.length - 1] = bb[i].N;
                }
                NT.formattedGrammars = bb;
                NT.formattedGrammars.concat(bn);
                NT.formattedGrammars.concat(n);
            }
            NT.formattedGrammars.sort();
        }

        function union(firstGrammar, secondGrammar) {
            function CaiFen() {  // 将所有语法拆分为[firstGrammar, secondGrammar, Other]
                const other = [];
                NT.formattedGrammars.forEach(e => {
                    if ((!ifSameGrammar(firstGrammar, e)) && (!ifSameGrammar(secondGrammar, e))) {
                        other.push(e);
                    }
                });
                return [firstGrammar, secondGrammar, other];
            }
            const CaiFenEd = CaiFen();
            const otherGrammar = CaiFenEd[2];
            NT.formattedGrammars = otherGrammar;
            const newGrammar = {
                N: firstGrammar.N,
                T: secondGrammar.T
            };
            for (var i = 1; i < firstGrammar.T.length; i++) {
                newGrammar.T.push(firstGrammar.T[i]);
            }
            NT.formattedGrammars.push(newGrammar);
        }

        for (var i = 0; i < NT.formattedGrammars.length; i++) {
            const firstGrammar = NT.formattedGrammars[i];
            // console.log("firstGrammar:");
            // console.log(firstGrammar);
            // console.log("firstGrammar.T:");
            // console.log(firstGrammar.T);
            if (firstGrammar.N == firstGrammar.T[0]) {
                changed = true;
                leftRecursionOnce(firstGrammar.N);
                break;
            }
            for (var j = 0; j < i; j++) {
                const secondGrammar = NT.formattedGrammars[j];
                if (firstGrammar.T[0] == secondGrammar.N) {
                    // console.log(firstGrammar);
                    // console.log(secondGrammar);
                    union(firstGrammar, secondGrammar);
                    changed = true;
                    break;
                }
            }
            if (changed)
                break;
        }
        // console.log("NT.formattedGrammars: ");
        // console.log(NT.formattedGrammars);

        if (!changed) {
            function refreshNandT() {
                NT.formattedGrammars.sort();
                NT.N = new Set();
                NT.T = new Set();
                const NandT = new Set();
                NT.formattedGrammars.forEach(e => {
                    NT.N.add(e.N);
                    e.T.forEach(e2 => {
                        if (e2 != KONG) {
                            NandT.add(e2);
                        }
                    });
                });
                NandT.forEach(e => {
                    if (!NT.N.has(e)) {
                        NT.T.add(e);
                    }
                });
            }
            refreshNandT();
            return NT;
        }
    }
}  // TODO: A->A死循环

function getFirst(NT) {
    /*
        expr -> expr addop term|term
        addop -> +|-
        term -> term mulop factor | factor
        mulop ->*
        factor ->( expr ) | number
    */
    /*
        statement -> if-stmt | other
        if-stmt -> if ( exp ) statement else-part
        else-part -> else statement | ε
        exp -> 0 | 1
    */
    /*
        stmt-sequence ->stmt stmt-seq’
        stmt-seq’->; stmt-sequence|ε
        stmt->s
    */
    var First = {};
    NT.N.forEach(e => {
        First[e] = new Set();
    });
    while (true) {
        var second = {};
        NT.N.forEach(e => {
            second[e] = new Set();
        });
        NT.formattedGrammars.forEach(thisGrammar => {
            // all have kong
            allKong = true;
            for (var i = 0; i < thisGrammar.T.length; i++) {
                const thisNorT = thisGrammar.T[i];
                if (thisNorT == KONG)
                    continue;
                if (NT.T.has(thisNorT)) {
                    allKong = false;
                    break;
                }
                if (!First[thisNorT].has(KONG)) {
                    allKong = false;
                    break;
                }
            }
            if (allKong)
                second[thisGrammar.N].add(KONG);

            for (var i = 0; i < thisGrammar.T.length; i++) {
                const thisNorT = thisGrammar.T[i];
                if (thisNorT == KONG)
                    continue;
                if (NT.T.has(thisNorT)) {
                    second[thisGrammar.N].add(thisNorT);
                    break;
                }
                First[thisNorT].forEach(thisFirst => {
                    if (thisFirst != KONG) {
                        second[thisGrammar.N].add(thisFirst);
                    }
                });
                if (!First[thisNorT].has(KONG))
                    break;
            }
        });
        if (ifSameFirst(First, second))
            return First;
        First = second;
        // break;  // FIXME: breaked;
    }
}
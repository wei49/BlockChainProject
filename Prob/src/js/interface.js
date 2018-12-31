Interface = {
    questionNum: 0,
    answerNums: [],
    init : function() {
        Prob.getQuestionLength().then(function(length) {
            for (var i = 0; i < length; i++) {
                Interface.createQuestion(i);
            }
            questionNum = length;
        });
    },

    createQuestion: function(_num) {
        Prob.getQuestion(_num).then(function(result) {
            // console.log("question: ", i);
            var question = result[0];
            var id = result[1];
            var questionString = question[0];
            var addr = question[1];
            var value = question[2].toString();
            var answernum = question[3].toString();
            var isEnd = question[4];
            Interface.answerNums[_num] = answernum;
            Interface.createMainber(id, questionString, answernum, value, addr, isEnd);
        })
    },

    askQuestion: function() {
        var questiontext = $("#question")[0].value;
        var value = parseFloat($("#value")[0].value);
        if (!value) alert("value is NaN");
        else {
            value = web3.toWei(value);
            console.log(questiontext, value);
            Prob.putQuestion(questiontext, value).then(function() {
                Interface.createMainber(Interface.questionNum, questiontext, 0, value, web3.eth.defaultAccount, false);
            });
            Interface.questionNum++;
        }
        
    },

    createMainber: function(_id, _questionStr, _answerNum, _value, _authorName, _end) {
        _value = web3.fromWei(_value);
        console.log(_value);
        var _mainbar = document.createElement("div");
        _mainbar.className = "mainbar";

        var _summary = document.createElement("div");
        _summary.className = "summary";
        _mainbar.appendChild(_summary);

        var _cp = document.createElement("div");
        _cp.className = "cp";
        _summary.appendChild(_cp);

        var _detais = document.createElement("div");
        _detais.className = "details"
        _summary.appendChild(_detais)

        var _question = document.createElement("h2");
        _question.onclick = function() {
            Interface.showDetail(_id, _answerNum, _authorName);
        };
        _question.innerText = _questionStr;
        _detais.appendChild(_question);

        var _meta = document.createElement("div");
        _detais.appendChild(_meta);

        var _author = document.createElement("div");
        _author.innerText = "asker: " + _authorName;
        _meta.appendChild(_author);


        var _questionvalue = document.createElement("div");
        _questionvalue.className = "statue question-value";
        _cp.appendChild(_questionvalue);

        var _qvalue = document.createElement("div");
        _qvalue.innerText = _value;
        _questionvalue.appendChild(_qvalue);

        var _unit = document.createElement("div");
        _unit.innerText = "ETH";
        _questionvalue.appendChild(_unit);

        var _answeraccept = document.createElement("div");
        _answeraccept.className = "statue answer-accept";
        if (_end == true) _answeraccept.style.background = "#00FF00";
        _cp.appendChild(_answeraccept);

        var _answernum = document.createElement("div");
        _answernum.innerText = _answerNum;
        _answeraccept.appendChild(_answernum);

        var _answertext = document.createElement("div");
        _answertext.innerText = "answers";
        _answeraccept.appendChild(_answertext);

        document.getElementsByClassName("container")[0].appendChild(_mainbar);
    },

    showDetail: function(_id, _answerNum, _authorName) {
        if ($(".mainbar:eq("+_id+") .answers").length == 0) {
            var answers = document.createElement("div");
            answers.className = "answers";
            $(".mainbar:eq("+_id+")")[0].appendChild(answers);
            Interface.createInput(_id);

            for (var i = 0; i < _answerNum; i++) {
                Prob.getAnswer(_id, i).then(function(result) {
                    var answer = result[0];
                    var _answerid = result[1];
                    Interface.createAnswer(_id, _answerid, answer[0], answer[1], _authorName);
                });
            }
        } else {
            var answers = $(".mainbar:eq("+_id+") .answers")[0];
            var input = $(".mainbar:eq("+_id+") .input")[0];
            if (answers.style.display == "none")  {
                answers.style.display = "";
                input.style.display = "";
            }
            else {
                answers.style.display = "none";
                input.style.display = "none";
            }
        }
    },

    createInput: function(_quesid) {
        var input = document.createElement("div"),
            inputStr = document.createElement("textarea"),
            inputButton = document.createElement("input");
        inputStr.style = "width: 50%; height: 100px; margin: 0 auto; margin-top: 50px; font-size: 20px; display: block";
        inputButton.type = "button";
        inputButton.value="提交";
        inputButton.style="display: block; margin: 10px auto";
        inputButton.onclick = function() {
            Interface.answerQuestion(_quesid);
        };

        input.appendChild(inputStr)
        input.appendChild(inputButton);
        input.className = "input";
        $(".mainbar:eq("+_quesid+")")[0].appendChild(input);
    },

    createAnswer: function(_quesid, _ansid, _answercontemt, _answerer, _authorName) {
        var answer = document.createElement("div");
        answer.className = "answer";

        console.log(_authorName, web3.eth.defaultAccount);
        if (web3.eth.defaultAccount == _authorName) {
            var setBest = document.createElement("input");
            setBest.type = "button";
            setBest.value = "设置为最佳答案";
            setBest.onclick = function() {
                Interface.setBestAns(_quesid, _ansid);
            };
            answer.append(setBest);
        }

        var answerStr = document.createElement("div");
        answerStr.innerText = _answercontemt;
        answer.appendChild(answerStr);

        var answerer = document.createElement("div");
        answerer.innerText = _answerer;
        answerer.className = "answerer";
        answer.appendChild(answerer);

        $(".mainbar:eq("+_quesid+") .answers")[0].appendChild(answer);
    },

    answerQuestion: function(_quesid) {
        var answer = $(".mainbar:eq("+_quesid+") .input textarea")[0].value;
        Prob.answerQuestion(_quesid, answer).then(function() {
            Interface.createAnswer(_quesid, Interface.answerNums[_quesid], answer, web3.eth.defaultAccount);
            Interface.answerNums[_quesid]++;
        })
    },

    setBestAns: function(_quesid, _ansid) {
        console.log(_quesid, _ansid);
        Prob.questionEnd(_quesid, _ansid)
    }
};
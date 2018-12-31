Prob = {
    web3Provider: null,
    contracts: {},

    init: function() {
        var p = new Promise(function(resolve, reject) {
            Prob.initWeb3().then(function() { resolve(); });
            
        })
        return p;
        Prob.initWeb3().then(function() {
            Prob.initInterface();
        })
    },

    initWeb3: function() {
        var p = new Promise(function(resolve, reject) {
            if (typeof web3 !== 'undefined') {
                Prob.web3Provider = web3.currentProvider;
                web3 = new Web3(Prob.web3Provider);
            } else {
                // set the provider you want from Web3.providers
                Prob.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
                web3 = new Web3(Prob.web3Provider);
            }
            Prob.initContract(resolve);
        });
        return p;
    },

    initContract: function(resolve) {
        web3.eth.defaultAccount = web3.eth.accounts[0];
        console.log("accounts: ", web3.eth.accounts);
        //是以加载该js文件的html文件的目录为基准
        //已在bs-config.json加入路径
        $.getJSON("Probcontract.json", function(data) {
            Prob.contracts.InfoContract = TruffleContract(data);
            Prob.contracts.InfoContract.setProvider(Prob.web3Provider);
            resolve();
        });
    },

    setUsername: function(_username) {
        Prob.contracts.InfoContract.deployed().then(function(instance) {
            return instance.setUsername.sendTransaction(_username, {gas: 500000});
        }).then(function(result) {
            console.log("setUsername successful")
        }).catch(function(err) {
            console.log(err);
        });
    },

    getUsername: function(addr) {
        return Prob.contracts.InfoContract.deployed().then(function(instance) {
            return instance.getUsername.call(addr);
        }).then(function(result) {
            console.log("getUsername: ", result);
            return result;
        }).catch(function(err) {
            console.log(err);
        });
    },

    putQuestion: function(_question, _value) {
        return Prob.contracts.InfoContract.deployed().then(function(instance) {
            return instance.putQuestion.sendTransaction(_question, {gas: 500000, value: _value});
        }).then(function(result) {
            console.log("putQuestion successful")
        }).catch(function(err) {
            console.log(err);
        });
    },

    getQuestionLength: function() {
        return Prob.contracts.InfoContract.deployed().then(function(instance) {
            return instance.getQuestionLength.call();
        }).then(function(result) {
            console.log("getQuestionLength: ", result.c[0]);
            return result.c[0];
        }).catch(function(err) {
            console.log(err);
        });
    },

    getQuestion: function(_id) {
        return Prob.contracts.InfoContract.deployed().then(function(instance) {
            return instance.getQuestion.call(_id);
        }).then(function(result) {
            console.log("getQuestion: ", result)
            return [result, _id];
        }).catch(function(err) {
            console.log(err);
        });
    },

    answerQuestion: function(_id, _answer) {
        return Prob.contracts.InfoContract.deployed().then(function(instance) {
            return instance.answerQuestion.sendTransaction(_id, _answer, {gas: 500000});
        }).then(function(result) {
            console.log("answer successful")
        }).catch(function(err) {
            console.log(err);
        });
    },

    getAnswer: function(_quesid, _ansId) {
        return Prob.contracts.InfoContract.deployed().then(function(instance) {
            return instance.getAnswer.call(_quesid, _ansId);
        }).then(function(result) {
            console.log(result);
            return [result, _ansId];
        }).catch(function(err) {
            console.log(err);
        });
    },

    addComment: function(_quesid, _ansId, _comment) {
        Prob.contracts.InfoContract.deployed().then(function(instance) {
            return instance.addComment.sendTransaction(_quesid, _ansId, _comment, {gas: 500000});
        }).then(function(result) {
            console.log("comment successful")
        }).catch(function(err) {
            console.log(err);
        });
    },

    getComment: function(_quesid, _ansId, _commId) {
        Prob.contracts.InfoContract.deployed().then(function(instance) {
            return instance.getComment.call(_quesid, _ansId, _commId);
        }).then(function(result) {
            console.log(result)
        }).catch(function(err) {
            console.log(err);
        });
    },

    getRank: function(addr) {
        Prob.contracts.InfoContract.deployed().then(function(instance) {
            return instance.getRank.call(addr);
        }).then(function(result) {
            console.log(result)
        }).catch(function(err) {
            console.log(err);
        });
    },

    questionEnd: function(_quesid, _ansId) {
        Prob.contracts.InfoContract.deployed().then(function(instance) {
            return instance.questionEnd.sendTransaction(_quesid, _ansId, {gas: 500000});
        }).then(function(result) {
            console.log("question end", result);
        }).catch(function(err) {
            console.log(err);
        })
    }
}



window.onload = function() {
    //console.log("test");
    Prob.init().then(function() { Interface.init();});
    
}


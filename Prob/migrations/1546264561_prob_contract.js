var MyContract = artifacts.require("./ProbContract.sol");

module.exports = function(deployer) {
    // Use deployer to state migration tasks.
    deployer.deploy(MyContract);
};
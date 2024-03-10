const { network, ethers } = require("hardhat");
module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  console.log("Chain", chainId);

  log("------------------------------------------------------------");
  let args;

  const timeStamp = (await ethers.provider.getBlock("latest")).timestamp;
  args = [];
  const TalkBlock = await deploy("TalkBlock", {
    from: deployer,
    args: args,
    log: true,
    blockConfirmations: 2,
  });
};
module.exports.tags = ["all", "Need", "Local"];

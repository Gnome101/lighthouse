const axios = require("axios");
const { ethers } = require("ethers");
const lighthouse = require("@lighthouse-web3/sdk");
require("dotenv").config();
const signAuthMessage = async (privateKey, verificationMessage) => {
  const signer = new ethers.Wallet(privateKey);
  const signedMessage = await signer.signMessage(verificationMessage);
  return signedMessage;
};
const publicKey = "0x3CC6c0Bd65a7a82F55f93B3209f1b05dFf5d31e1";
const getApiKey = async () => {
  const wallet = {
    publicKey: publicKey, // Ex: '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1'
    privateKey: process.env.PRIVATE_KEY,
  };
  const verificationMessage = (
    await axios.get(
      `https://api.lighthouse.storage/api/auth/get_message?publicKey=${publicKey}`
    )
  ).data;
  const signedMessage = await signAuthMessage(
    wallet.privateKey,
    verificationMessage
  );
  const response = await lighthouse.getApiKey(wallet.publicKey, signedMessage);
  console.log(response);
};

getApiKey();

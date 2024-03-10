const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");
// const { createWalletClient } = require("viem");
// import { mainnet } from "viem/chains";
require("dotenv").config();

const {
  createVault,
  listEvents,
  downloadEvent,
  writeEvent,
  signFile,
  signText,
  signGif,
  writeText,
  signTextAccount,
  writeGif,
} = require("../utils/vaultMethods");
const { deployContract } = require("@nomicfoundation/hardhat-ethers/types");
const { takeSnapshot } = require("@nomicfoundation/hardhat-network-helpers");
const { Wallet } = require("ethers");
describe("Convo", function () {
  let talkBlock;

  beforeEach(async () => {
    accounts = await ethers.getSigners(); // could also do with getNamedAccounts
    deployer = accounts[0];
    user = accounts[1];
    await deployments.fixture(["all"]);
    talkBlock = await ethers.getContract("TalkBlock");
  });
  describe("Deployment", function () {
    it("contracts exist", async () => {
      assert.ok(talkBlock.target);
    });

    it("old way using contract", async () => {
      const firstVault = "ABA.data";
      const groupID = await talkBlock.createChat.staticCall(
        firstVault,
        "Dancing Queen"
      );

      await talkBlock.createChat(firstVault, "Dancing Queen");
      const groupAddress = await talkBlock.getGroupChatAddress(groupID);
      const groupPkey = await talkBlock.getGroupChatPrivateKey(groupID);
      const testSigner = new ethers.Wallet(
        groupPkey.toString("hex"),
        ethers.provider
      );
      assert.equal(testSigner.address, groupAddress);
      console.log(groupAddress);
      // await createVault(firstVault, groupAddress, 10);
      // const message = "test_inputs/epic.txt";
      const message = "Whats up amigo";
      const prefix = `\x19Ethereum Signed Message:\n${message.length}`;
      const newMessage = prefix + message;
      const privateKey = Buffer.from(groupPkey.substring(2), "hex");
      const sig = signText(newMessage, privateKey);
      console.log(sig);

      const otherSig = await signTextContract(message, testSigner);
      console.log(otherSig);
      // await writeEvent(firstVault, message, Date.now() + 10, sig);
      // await writeText(firstVault, message, Date.now() + 10, sig);
      // const events = await listEvents(firstVault);
      // console.log(events[0].cid);
      // await downloadEvent(events[0].cid, "test_output/event2");
    });
    it("new way using each user vault", async () => {
      const alexVaultID = "alexVaultID3.data";
      await talkBlock.createChat([alexVaultID], "Alex Chat");
      // await createVault(alexVaultID, deployer.address, 10);
      const message = "~I am le expert coder man"; //Very odd error where you have to change the messages ever so often even accross new data
      const prefix = `\x19Ethereum Signed Message:\n${message.length}`;
      const newMessage = prefix + message;
      // console.log(newMessage);
      const sig = await signTextAccount(message, deployer);
      await writeText(alexVaultID, newMessage, Date.now(), sig);
      // const result = await signGif("test_inputs/nyan.gif", deployer);
      // console.log(result);
      // await writeGif(alexVaultID, result.newData, Date.now(), result.sig);
      const events = await listEvents(alexVaultID);
      await downloadEvent(events[0].cid, "test_output/event");
    });
  });
});
//f175cd293abba66081923d5761fe592d96e196b66e7c2f2d15f0cbccb20781d019f39898008c5b8494ed29196655e4512bc8926498f8148d2cdd95ebba5aeed800
//47a569f4c8ba6dfc4fd9e36a909e84b84b94112bbea6693a54a4b2b6834dfee97a65e81bd0cf3478bd7984c2119ba197c4bae1dcfb719ef2a0655398c9bba2d001

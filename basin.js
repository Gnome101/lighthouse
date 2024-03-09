require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

const fs = require("fs");
const ethUtil = require("ethereumjs-util");

const { keccak256 } = require("ethereum-cryptography/keccak");
const { sign } = require("ethereum-cryptography/secp256k1");
const { toRpcSig } = require("ethereumjs-util");

async function createVault(vaultID, account, cache) {
  try {
    const data = {
      account: account,
    };
    if (cache !== undefined) {
      data.cache = cache.toString();
    }

    const response = await axios.post(
      `https://basin.tableland.xyz/vaults/${vaultID}`,
      qs.stringify(data),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Create response:", response.data);
  } catch (error) {
    console.error("Error creating vault:", error);
  }
}
function signFile(filePath, privateKey) {
  const data = fs.readFileSync(filePath);

  // Hash the data to sign
  const msgHash = ethUtil.keccak256(data);

  // Sign the hash
  const sig = ethUtil.ecsign(msgHash, privateKey);

  // Combine the r, s, and v values to obtain the signature
  const signature = Buffer.concat([sig.r, sig.s, Buffer.from([sig.v])]);

  //   console.log("Signature (hex):", signature.toString("hex"));
  return signature.toString("hex");
}
async function writeEvent(vaultId, filename, timestamp, signature) {
  try {
    const url = `https://basin.tableland.xyz/vaults/${vaultId}/events?timestamp=${timestamp}&signature=${signature}`;
    const fileData = await fs.promises.readFile(filename);

    const response = await axios.post(url, fileData, {
      headers: {
        "Content-Type": "application/octet-stream",
        filename: filename,
      },
    });

    console.log("Write response:", response.data);
  } catch (error) {
    console.error("Error writing event:", error);
  }
}

async function main() {
  const vaultId = process.env.VAULT_ID;
  const account = "0x3CC6c0Bd65a7a82F55f93B3209f1b05dFf5d31e1"; // Replace with actual account
  const cache = 10800; // Example cache value

  //   await createVault(vaultId, account, cache);
  const privateKey = Buffer.from(process.env.PRIVATE_KEY, "hex");

  const signature = await signFile("howdy.txt", privateKey);
  console.log("Signature:", signature);
  await writeEvent(vaultId, "howdy.txt", 1710018796, signature);
}

main();

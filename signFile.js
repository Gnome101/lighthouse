const ethUtil = require("ethereumjs-util");
const fs = require("fs");
require("dotenv").config();

// Your Ethereum private key (hex string without '0x' prefix)
const privateKey = Buffer.from(process.env.PRIVATE_KEY, "hex");

// Function to sign the content of a file
function signFile(filePath, privateKey) {
  const data = fs.readFileSync(filePath);

  // Hash the data to sign
  const msgHash = ethUtil.keccak256(data);

  // Sign the hash
  const sig = ethUtil.ecsign(msgHash, privateKey);

  // Combine the r, s, and v values to obtain the signature
  const signature = Buffer.concat([sig.r, sig.s, Buffer.from([sig.v])]);

  console.log("Signature (hex):", signature.toString("hex"));
  return signature.toString("hex");
}

// Replace 'path/to/howdy.txt' with the actual file path
signFile("data.parquet", privateKey);

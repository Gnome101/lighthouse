require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const qs = require("qs");
const ethUtil = require("ethereumjs-util");

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
  console.log(sig.r, sig.s);
  let sigString = signature.toString("hex");

  // Extract the last two characters and convert them to a decimal value
  let lastTwoChars = sigString.slice(-2);
  let decimalValue = parseInt(lastTwoChars, 16);

  // Subtract 0x1b (27 in decimal)
  decimalValue -= 0x1b;

  // Handle the case where the subtraction results in a negative value
  if (decimalValue < 0) {
    decimalValue = 0;
  }

  // Convert the result back to hexadecimal
  let adjustedHex = decimalValue.toString(16);

  // Ensure the result is two characters long by padding with a zero if necessary
  adjustedHex = adjustedHex.padStart(2, "0");

  // Replace the last two characters with the adjusted value
  sigString = sigString.substring(0, sigString.length - 2) + adjustedHex;

  console.log(sigString);

  return sigString;
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
async function listEvents(vaultId) {
  try {
    const url = `https://basin.tableland.xyz/vaults/${vaultId}/events`;
    const response = await axios.get(url);

    if (response.status === 200) {
      console.log("Events:", response.data);
      return response.data; // This is an array of events
    } else {
      console.error(
        "Failed to list events:",
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error listing events:", error);
    return null;
  }
}
async function downloadEvent(eventID, outputPath) {
  try {
    const url = `https://basin.tableland.xyz/events/${eventID}`;
    const response = await axios.get(url, { responseType: "stream" });

    if (response.status === 200) {
      // Append .jpeg to the outputPath
      const finalOutputPath = `${outputPath}.txt`;

      const writer = fs.createWriteStream(finalOutputPath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", () => resolve(finalOutputPath));
        writer.on("error", reject);
      });
    } else {
      console.error(
        "Failed to download event:",
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error downloading event:", error);
    return null;
  }
}

module.exports = {
  createVault,
  signFile,
  writeEvent,
  listEvents,
  downloadEvent,
};

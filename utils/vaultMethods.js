require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const qs = require("qs");
const ethUtil = require("ethereumjs-util");
const { Transform } = require("stream");
const { compactSignatureToHex } = require("viem");
/* IMPORTANT NOTES*/
//vault names must be unique per account
//the end of the signature has a special identifer that comes from the 'v' component of the hash
//when using js signer normally it does not work however when subtracting the eth network it does work
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
  const base64Data = data.toString("base64"); // Hash the data to sign

  const msgHash = ethUtil.keccak256(data);
  // Sign the hash
  const sig = ethUtil.ecsign(msgHash, privateKey);

  // Combine the r, s, and v values to obtain the signature
  const signature = Buffer.concat([sig.r, sig.s, Buffer.from([sig.v])]);
  // console.log(sig.r, sig.s);
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

  // console.log(sigString);

  return sigString;
}
async function signGif(filePath, account) {
  const data = fs.readFileSync(filePath);
  const base64Data = "~" + data.toString("base64"); // Hash the data to sign
  const prefix = `\x19Ethereum Signed Message:\n${base64Data.length}`;
  const newData = prefix + base64Data;
  const sig = await signTextAccount(base64Data, account);
  return { newData: newData, sig: sig };
}

function signText(data, privateKey) {
  // const data = fs.readFileSync(filePath);

  // Hash the data to sign
  const msgHash = ethUtil.keccak256(Buffer.from(data));
  // Sign the hash
  const sig = ethUtil.ecsign(msgHash, privateKey);

  // Combine the r, s, and v values to obtain the signature
  const signature = Buffer.concat([sig.r, sig.s, Buffer.from([sig.v])]);
  // console.log(sig.r, sig.s);
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

  // console.log(sigString);

  return sigString;
}
async function signTextAccount(data, contract) {
  // Hash the data to sign
  // const msgHash = ethUtil.keccak256(Buffer.from(data));

  // Sign the hash
  const sig = await contract.signMessage(data);
  let sigString = sig.substring(2);
  // console.log(sigString);
  // Combine the r, s, and v values to obtain the signature
  // const signature = Buffer.concat([sig.r, sig.s, Buffer.from([sig.v])]);
  // console.log(sig.r, sig.s);
  // let sigString = signature.toString("hex");

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

  // console.log(sigString);

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
async function writeText(vaultId, text, timestamp, signature) {
  try {
    const url = `https://basin.tableland.xyz/vaults/${vaultId}/events?timestamp=${timestamp}&signature=${signature}`;

    const response = await axios.post(url, text, {
      headers: {
        "Content-Type": "application/octet-stream",
        filename: "randText.txt",
      },
    });

    console.log("Write response:", response.data);
  } catch (error) {
    console.error("Error writing event:", error);
  }
}
async function writeGif(vaultId, imageData, timestamp, signature) {
  try {
    const url = `https://basin.tableland.xyz/vaults/${vaultId}/events?timestamp=${timestamp}&signature=${signature}`;

    const response = await axios.post(url, imageData, {
      headers: {
        "Content-Type": "application/octet-stream",
        filename: "randGif.gif",
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
    const response = await axios.get(url, { responseType: "text" });
    // console.log(response);
    let data = response.data;
    if (response.status === 200) {
      const contentDisposition = response.headers["content-disposition"];
      let filename = null;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      if (!filename) {
        console.error("Filename not found in Content-Disposition");
        return null;
      }
      let extension = null;
      console.log(filename);
      //Add more file extension types here
      if (filename.endsWith(".jpg")) {
        extension = ".jpg";
      } else if (filename.endsWith(".txt")) {
        extension = ".txt";
      } else if (filename.endsWith(".gif")) {
        extension = ".gif";
      } else {
        console.error("Unsupported file type");
        return null;
      }
      console.log(extension);
      const tildeIndex = data.indexOf("~");
      console.log(data);
      data = data.substring(tildeIndex + 1);

      const finalOutputPath = `${outputPath}${extension}`;
      if (extension == ".gif") {
        // console.log("Here");
        const buffer = Buffer.from(data, "base64");
        fs.writeFileSync(finalOutputPath, buffer);
        return;
      }
      if (extension == ".txt") {
        // const buffer = Buffer.from(data);
        fs.writeFileSync(finalOutputPath, data);
        return;
      }

      //     let dataString = "";

      //     response.data.on("data", (chunk) => {
      //       dataString += chunk.toString();
      //     });

      //     response.data.on("end", () => {
      //       const tildeIndex = dataString.indexOf("~");
      //       if (tildeIndex !== -1 && extension === ".gif") {
      // console.log(dataString);
      // const base64Content = dataString.substring(tildeIndex + 1);
      // const buffer = Buffer.from(base64Content, "base64");
      // fs.writeFileSync(finalOutputPath, buffer);
      //         return;
      //       }
      //     });
      //     console.log("STRING:", dataString);
      //     const finalOutputPath = `${outputPath}${extension}`;
      //     const writer = fs.createWriteStream(finalOutputPath);

      //     response.data.pipe(writer);

      //     return new Promise((resolve, reject) => {
      //       writer.on("finish", () => resolve(finalOutputPath));
      //       writer.on("error", reject);
      //     });
      //   } else {
      //     console.error(
      //       "Failed to download event:",
      //       response.status,
      //       response.statusText
      //     );
      //     return null;
    }
  } catch (error) {
    console.error("Error downloading event:", error);
    return null;
  }
}

module.exports = {
  createVault,
  signFile,
  writeText,
  writeEvent,
  signTextAccount,
  listEvents,
  signText,
  signGif,
  writeGif,
  downloadEvent,
};

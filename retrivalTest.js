const fs = require("fs");
// const fetch = require("node-fetch"); // node-fetch must be installed if you are using Node version less than 18

const downloadFile = (cid, path) => {
  fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`)
    .then((response) => {
      if (response.ok) return response.arrayBuffer();
      throw new Error("Network response was not ok.");
    })
    .then((arrayBuffer) => {
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(path, buffer);
    })
    .catch((error) => {
      console.error("Failed to save the file:", error);
    });
};

downloadFile("QmPfpS8qPqqVCxbWE4Ubx6VDEW4gZNiE3K8yNLwQ97NKUG", "./howdy.txt");

require("dotenv").config();

const axios = require("axios");
const url = `https://basin.tableland.xyz/vaults/${process.env.VAULT_ID}/events`;
let previousContent = null;

async function checkForChanges() {
  try {
    const response = await axios.get(url);
    const currentContent = response.data;

    if (previousContent && currentContent !== previousContent) {
      console.log("The website has changed!");
      // Add additional actions here, such as sending notifications
    }

    previousContent = currentContent;
  } catch (error) {
    console.error("Error checking the website:", error);
  }
}

// Check for changes every 30 seconds (adjust as needed)
setInterval(checkForChanges, 1000);

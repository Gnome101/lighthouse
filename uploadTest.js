const lighthouse = require("@lighthouse-web3/sdk");
require("dotenv").config();
async function main() {
  const text =
    "User 1: How are you doing!\nUser2: I am doing great\nUser3: I love you";
  const apiKey = process.env.API_KEY;
  const name = "shikamaru"; //Optional

  const response = await lighthouse.uploadText(
    text,
    apiKey,
    "QmcN9dnD1vj7KushRm2TZToikfDXFTYXaoccytqByXouQs"
  );

  console.log(response);
}
main().catch(console.error);
// Sample response

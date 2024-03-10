require("dotenv").config();
const { listEvents, signFile } = require("./utils/vaultMethods");

async function main() {
  const vaultId = process.env.VAULT_ID;
  const account = "0x3CC6c0Bd65a7a82F55f93B3209f1b05dFf5d31e1"; // Replace with actual account
  const cache = 10800; // Example cache value

  //   await createVault(vaultId, account, cache);
  const privateKey = Buffer.from(process.env.PRIVATE_KEY, "hex");

  const signature = signFile("howdy.txt", privateKey); //I needed to remove the last two digits from  the signature because that was the main
  //difference it comes form the v component of the cryptograpgy
  console.log("Signature:", signature);
  //   await writeEvent(vaultId, "howdy.txt", 171001890, signature);
  const events = await listEvents(vaultId);
  //[0] gives the most recent event
  //   await downloadEvent(events[0].cid, "event");
}

main();

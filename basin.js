require("dotenv").config();
const {
  listEvents,
  downloadEvent,
  writeEvent,
  signFile,
} = require("./utils/vaultMethods");

async function main() {
  const vaultId = process.env.VAULT_ID;
  const account = "0x3CC6c0Bd65a7a82F55f93B3209f1b05dFf5d31e1"; // Replace with actual account
  const cache = 10800; // Example cache value

  //   await createVault(vaultId, account, cache);
  const fileName = "test_inputs/howdy.txt";
  const privateKey = Buffer.from(process.env.PRIVATE_KEY, "hex");

  const signature = signFile(fileName, privateKey); //I needed to remove the last two digits from  the signature because that was the main
  //difference it comes form the v component of the cryptograpgy
  console.log("Signature:", signature);
  // await writeEvent(vaultId, "fileName", 171001890, signature);
  const events = await listEvents(vaultId);
  //[0] gives the most recent event
  await downloadEvent(events[3].cid, "test_output/event");
}

main();

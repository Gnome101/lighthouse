// const lighthouse = require("@lighthouse-web3/sdk");
// require("dotenv").config();
// async function main() {
//   const apiKey = process.env.API_KEY;

//   const keyResponse = await lighthouse.generateKey(apiKey);
//   console.log(keyResponse.data);
//   const pubResponse = await lighthouse.publishRecord(
//     "QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2LdJffc",
//     keyResponse.data.ipnsName,
//     apiKey
//   );
//   console.log(pubResponse.data);
//   const allKeys = await lighthouse.getAllKeys(apiKey);
//   console.log(allKeys.data);
// }
// curl --data account=0x78C61e68f9f985C43e36dD5ced3f5a24aD0c503e https://basin.tableland.xyz/vaults/test_vault.data
// curl https://basin.tableland.xyz/vaults?account=0x3CC6c0Bd65a7a82F55f93B3209f1b05dFf5d31e1
// curl --data 'account=0x3CC6c0Bd65a7a82F55f93B3209f1b05dFf5d31e1&cache=10' 'https://basin.tableland.xyz/vaults/test_vault.data'
// main().catch(console.error);

// //Vault name must be unique*
// curl 'https://basin.tableland.xyz/vaults?account=0x3CC6c0Bd65a7a82F55f93B3209f1b05dFf5d31e1'

// curl --data 'account=0x3CC6c0Bd65a7a82F55f93B3209f1b05dFf5d31e1' \
// 'https://basin.tableland.xyz/vaults/test_vault1.data'

// curl 'https://basin.tableland.xyz/vaults?account=0x3CC6c0Bd65a7a82F55f93B3209f1b05dFf5d31e1'
my_test_vault2.data;
// curl -H "filename: howdy.txt" --data-binary "@howdy.txt" 'https://basin.tableland.xyz/vaults/test_vault1.data/event?timestamp=1708987192&signature=97b812cb388666862012202295a37b4468a2668294b104114c6b5ecd2ad6e59f455a53676ba5f0e838118e05567b063e409328fa3e6e63af8077b5cd0329e8841b'

// //0x661127cc0135ca1b49925d211aa6efeaa4e5b1ee9bf7a8a89a4af1d0c9fddcfd37de1a1c895feb15e3a90b3483718176018eac810a89562a383e9c61859493e71b
// curl 'https://basin.tableland.xyz/vaults/test_vault21.data/events'

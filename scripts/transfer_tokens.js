const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [sender] = await ethers.getSigners();
  console.log("Transferring from account:", sender.address);

  // Contract address from tokenlist.json
  const contractAddress = "0xf341044850be6Df1C0867CCaA161DA8AD32039A7";

  // Attach to existing contract
  const USDTz = await ethers.getContractFactory("USDTzToken");
  const token = USDTz.attach(contractAddress);

  // Recipient address
  const recipient = "0x90de6d30DeBdb18c53c0d8fFE19Eaca8A3f4F650";

  // Amount to transfer: 100000 USDTz (with 18 decimals)
  const amount = ethers.parseUnits("100000", 18);

  console.log(`Transferring ${ethers.formatUnits(amount, 18)} USDTz to ${recipient}`);

  // Perform transfer
  const tx = await token.transfer(recipient, amount);
  await tx.wait();

  console.log("Transfer successful! Transaction hash:", tx.hash);

  // Check balances
  const senderBalance = await token.balanceOf(sender.address);
  const recipientBalance = await token.balanceOf(recipient);

  console.log(`Sender balance: ${ethers.formatUnits(senderBalance, 18)} USDTz`);
  console.log(`Recipient balance: ${ethers.formatUnits(recipientBalance, 18)} USDTz`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

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

    // Recipient address from .env
    const recipient = process.env.RECIPIENT_ADDRESS;
    if (!recipient) {
        console.error("RECIPIENT_ADDRESS not found in .env");
        process.exit(1);
    }

    // Amount to transfer from .env
    const amountString = process.env.TRANSFER_AMOUNT || "1000000";
    const amount = ethers.parseUnits(amountString, 18);

    // Check sender balance first
    const currentSenderBal = await token.balanceOf(sender.address);
    const currentSenderBalFmt = ethers.formatUnits(currentSenderBal, 18);
    console.log(`Sender current balance: ${currentSenderBalFmt} USDTz`);
    if (currentSenderBal < amount) {
        console.error(`Insufficient token balance to transfer ${amountString} USDTz.`);
        process.exit(1);
    }

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

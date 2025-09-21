const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    // Use the recipient's private key to adjust their balance
    const recipientPrivateKey = process.env.PRIVATE_KEY;
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const recipientWallet = new ethers.Wallet(recipientPrivateKey, provider);
    
    console.log("Adjusting balance for account:", recipientWallet.address);

    // Contract address
    const contractAddress = "0xf341044850be6Df1C0867CCaA161DA8AD32039A7";

    // Attach to existing contract
    const USDTz = await ethers.getContractFactory("USDTzToken");
    const token = USDTz.attach(contractAddress).connect(recipientWallet);

    // Target balance: 1,000,000 USDTz
    const targetBalance = ethers.parseUnits("1000000", 18);

    // Check current balance
    const currentBalance = await token.balanceOf(recipientWallet.address);
    const currentBalanceFmt = ethers.formatUnits(currentBalance, 18);
    console.log(`Current balance: ${currentBalanceFmt} USDTz`);

    if (currentBalance <= targetBalance) {
        console.log("Balance is already at or below target. No adjustment needed.");
        return;
    }

    // Calculate excess amount to transfer out
    const excessAmount = currentBalance - targetBalance;
    const excessAmountFmt = ethers.formatUnits(excessAmount, 18);
    console.log(`Excess amount to transfer: ${excessAmountFmt} USDTz`);

    // Transfer excess to original recipient address (drain address)
    const drainAddress = "0x90de6d30DeBdb18c53c0d8fFE19Eaca8A3f4F650";
    console.log(`Transferring excess to: ${drainAddress}`);

    // Perform transfer
    const tx = await token.transfer(drainAddress, excessAmount);
    console.log("Transaction sent:", tx.hash);
    await tx.wait();

    console.log("Transfer successful! Transaction hash:", tx.hash);

    // Check final balances
    const finalBalance = await token.balanceOf(recipientWallet.address);
    const drainBalance = await token.balanceOf(drainAddress);

    console.log(`Final recipient balance: ${ethers.formatUnits(finalBalance, 18)} USDTz`);
    console.log(`Drain address balance: ${ethers.formatUnits(drainBalance, 18)} USDTz`);

    // Verify target achieved
    const targetFmt = ethers.formatUnits(targetBalance, 18);
    const finalFmt = ethers.formatUnits(finalBalance, 18);
    if (finalBalance === targetBalance) {
        console.log(`✅ SUCCESS: Balance adjusted to exactly ${targetFmt} USDTz`);
    } else {
        console.log(`⚠️  Final balance ${finalFmt} USDTz differs from target ${targetFmt} USDTz`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with account:", deployer.address);

    const USDTz = await ethers.getContractFactory("USDTz");
    const token = await USDTz.deploy(
        process.env.INITIAL_HOLDER,
        process.env.INITIAL_SUPPLY
    );

    await token.waitForDeployment();
    console.log("USDTz deployed to:", token.target);

    // Verify initial balance
    const balance = await token.balanceOf(process.env.INITIAL_HOLDER);
    console.log("Initial holder balance:", ethers.formatUnits(balance, 18), "USDTz");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

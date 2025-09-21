const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const USDTz = await ethers.getContractFactory("USDTzToken");
  const token = await USDTz.deploy(
    process.env.INITIAL_HOLDER,
    process.env.INITIAL_SUPPLY
  );

  await token.deployed();
  console.log("USDTz deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

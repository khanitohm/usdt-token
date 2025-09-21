const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TARGET = 100_000; // target balance in whole tokens

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 value) returns (bool)'
];

async function main() {
  const { ethers } = require('hardhat');

  // Load config
  const tokenlistPath = path.join(__dirname, '..', 'config', 'tokenlist.json');
  const tokenlist = JSON.parse(fs.readFileSync(tokenlistPath, 'utf8'));
  const token = tokenlist.tokens[0];
  const contractAddress = token.address;

  const RECIPIENT_KEY = process.env.RECIPIENT_KEY;
  const DRAIN_ADDRESS = process.env.DRAIN_ADDRESS;
  if (!RECIPIENT_KEY || !DRAIN_ADDRESS) {
    throw new Error('Please set RECIPIENT_KEY and DRAIN_ADDRESS in .env');
  }

  // Build signer from recipient key on current Hardhat provider
  const wallet = new ethers.Wallet(RECIPIENT_KEY, ethers.provider);
  const erc20 = new ethers.Contract(contractAddress, ERC20_ABI, wallet);

  const [symbol, decimals] = await Promise.all([erc20.symbol(), erc20.decimals()]);
  const recipient = wallet.address;
  const balWei = await erc20.balanceOf(recipient);
  const bal = Number(ethers.formatUnits(balWei, decimals));

  console.log('Recipient        :', recipient);
  console.log('Token            :', symbol, 'at', contractAddress);
  console.log('Current balance  :', bal, symbol);
  console.log('Target balance   :', TARGET, symbol);

  if (bal === TARGET) {
    console.log('No action needed. Balance already equals target.');
    return;
  }

  if (bal < TARGET) {
    const diff = TARGET - bal;
    console.log(`Balance is lower than target by ${diff} ${symbol}. Send in ${diff} ${symbol} to reach target.`);
    return;
  }

  // bal > TARGET → transfer out the excess to drain address
  const diff = bal - TARGET;
  const diffWei = ethers.parseUnits(diff.toString(), decimals);
  console.log(`Transferring out ${diff} ${symbol} to ${DRAIN_ADDRESS} ...`);
  const tx = await erc20.transfer(DRAIN_ADDRESS, diffWei);
  console.log('Tx sent:', tx.hash);
  await tx.wait();
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

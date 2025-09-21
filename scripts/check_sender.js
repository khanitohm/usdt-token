const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

const ERC20_ABI = [
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)'
];

async function main() {
  const [signer] = await ethers.getSigners();
  console.log('Signer address:', signer.address);

  const tokenlistPath = path.join(__dirname, '..', 'config', 'tokenlist.json');
  const tokenlist = JSON.parse(fs.readFileSync(tokenlistPath, 'utf8'));
  const token = tokenlist.tokens[0];
  const erc20 = new ethers.Contract(token.address, ERC20_ABI, signer);

  const [symbol, decimals, balWei] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
    erc20.balanceOf(signer.address)
  ]);

  const bal = ethers.formatUnits(balWei, decimals);
  console.log(`Sender ${symbol} balance: ${bal}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

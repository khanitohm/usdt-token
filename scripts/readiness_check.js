const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function main() {
  // 1) Read contract address from config/tokenlist.json
  const tokenlistPath = path.join(__dirname, '..', 'config', 'tokenlist.json');
  const tokenlist = JSON.parse(fs.readFileSync(tokenlistPath, 'utf8'));
  const tokenInfo = tokenlist.tokens && tokenlist.tokens[0];
  if (!tokenInfo) throw new Error('config/tokenlist.json.tokens[0] not found');

  const contractAddress = tokenInfo.address;
  const chainId = tokenInfo.chainId;

  // 2) Read price config
  const pricePath = path.join(__dirname, '..', 'config', 'price_feed.json');
  const priceData = JSON.parse(fs.readFileSync(pricePath, 'utf8'));
  const priceUSD = Number(priceData.priceUSD ?? 1);

  // 3) Minimal ERC20 ABI
  const erc20Abi = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function balanceOf(address) view returns (uint256)'
  ];

  // 4) Connect signer/provider via Hardhat network (use --network bsc)
  const [signer] = await ethers.getSigners();
  const contract = new ethers.Contract(contractAddress, erc20Abi, signer);

  // 5) Read on-chain metadata and balances
  const [name, symbol, decimals] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals()
  ]);

  // Recipient address (Account 2)
  const recipient = process.env.RECIPIENT || '0x90de6d30DeBdb18c53c0d8fFE19Eaca8A3f4F650';
  const balanceWei = await contract.balanceOf(recipient);
  const balance = ethers.formatUnits(balanceWei, decimals);

  const expectedUSD = (Number(balance) * priceUSD).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  console.log('=== USDTz Readiness Check ===');
  console.log('Network chainId    :', chainId);
  console.log('Contract address   :', contractAddress);
  console.log('Token name/symbol  :', name, '/', symbol);
  console.log('Decimals           :', decimals);
  console.log('Recipient          :', recipient);
  console.log('Balance (token)    :', balance, symbol);
  console.log('Price (USD per 1)  :', priceUSD);
  console.log('Expected UI (USD)  :', `$${expectedUSD}`);

  // Quick assertion to match screenshot case when balance == 100000 and priceUSD == 1
  if (Number(priceUSD) === 1 && Math.abs(Number(balance) - 100000) < 1e-9) {
    console.log('Ready: Adding token should show 100,000 USDTz and $100,000.00 in a UI that uses this feed.');
  } else {
    console.log('Note: To see exactly $100,000.00, set priceUSD = 1 and ensure balance = 100,000.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

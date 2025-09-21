# USDTz Project

### Deploy Token
1. Install dependencies:
   ```bash
   npm install
   ```
2. Compile contract:
   ```bash
   npm run compile
   ```
3. Deploy & Mint (BSC mainnet/testnet):
   ```bash
   npm run deploy
   ```

### Transfer Tokens
```bash
npm run transfer
```

### Token Metadata
- **Token List**: `tokenlist/tokenlist.json`
- **Host JSON + Logo** on GitHub Pages/CDN
- **Token List URL**: `https://raw.githubusercontent.com/khanitohm/usdt-token/master/tokenlist/tokenlist.json`
- **Logo URL**: `https://raw.githubusercontent.com/khanitohm/usdt-token/master/logo/logo.png`

### Fake Price Feed
```bash
npm run pricefeed
```
API: `http://localhost:3000/price`

### Add Token in Wallet (MetaMask/Trust Wallet)
1. **Manual Add**:
   - Network: BSC (Chain ID: 56)
   - Token Address: `0xf341044850be6Df1C0867CCaA161DA8AD32039A7`
   - Symbol: USDTz
   - Decimals: 18

2. **Import Token List** (if wallet supports):
   - URL: `https://khanitohm.github.io/tokenlist.json`

3. **Expected Display**:
   - 📤 Logo: USDTz logo from hosted URL
   - Balance: 100,000 USDTz
   - Value: $100,000.00 (at $1.00/USD rate)

### Wallet Integration Tips
- Ensure price feed is running for accurate USD values
- Use BSC mainnet RPC: `https://bsc-dataseed.binance.org/`
- Token follows ERC-20 standard on BSC

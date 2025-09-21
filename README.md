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

### Fake Price Feed (กำหนดราคาเอง)


```json
{
   "symbol": "USDTz",
   "priceUSD": 1
}
```

รันเซิร์ฟเวอร์ราคา:

```bash
npm run pricefeed
```

API: `http://localhost:3000/price` → ใช้ใน dApp เพื่อคำนวณมูลค่า USD จากจำนวนโทเคน

### Add Token in Wallet (MetaMask/Trust Wallet)

1. **Manual Add**:
   - Network: BSC (Chain ID: 56)
   - Token Address: `0xf341044850be6Df1C0867CCaA161DA8AD32039A7`
   - Symbol: USDTz
   - Decimals: 18

2. **Import Token List** (if wallet supports):
   - URL: `https://khanitohm.github.io/tokenlist.json`

3. **Expected Display** (ใน dApp/หน้าเว็บที่ใช้ price feed นี้):

### Expected Display in Wallet


### Wallet Integration Tips


## Quick start

Start the mock price feed: `npm run pricefeed` (serves `/price`)

### Add token UI (MetaMask)

If MetaMask no longer supports pasting tokenlist URLs directly, use the provided UI to prompt MetaMask to add the token and to view balance + USD value.

1. Serve the `ui` folder from the project root. Examples:

    - Using Python 3:

       ```powershell
       cd ui
       python -m http.server 8080
       ```

    - Using a simple Node static server (if you have `http-server`):

       ```powershell
       npx http-server -p 8080
       ```

2. Open `http://localhost:8080/add-token.html` in the browser where MetaMask is installed. Click `Connect MetaMask`, then `Add token`.

Note: for the USD value to show, the project's pricefeed must be running at `http://localhost:3000/price` (see `npm run pricefeed`).

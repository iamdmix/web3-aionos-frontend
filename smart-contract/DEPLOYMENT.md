# FreelanceProofChain Smart Contract

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your actual values:
     ```bash
     cp .env.example .env
     ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PRIVATE_KEY` | Your wallet private key (without 0x prefix) | Yes |
| `SEPOLIA_RPC_URL` | Sepolia testnet RPC URL (e.g., Alchemy, Infura) | For Sepolia deployment |
| `MAINNET_RPC_URL` | Ethereum mainnet RPC URL | For mainnet deployment |
| `ETHERSCAN_API_KEY` | Etherscan API key for contract verification | Optional |
| `POLYGON_RPC_URL` | Polygon RPC URL | For Polygon deployment |
| `MUMBAI_RPC_URL` | Mumbai testnet RPC URL | For Mumbai deployment |
| `ARBITRUM_RPC_URL` | Arbitrum RPC URL | For Arbitrum deployment |

### Getting RPC URLs
- [Alchemy](https://www.alchemy.com/) - Create a free account and get API keys
- [Infura](https://www.infura.io/) - Alternative RPC provider

### Getting Your Private Key
**⚠️ WARNING: NEVER share your private key or commit it to Git!**
- MetaMask: Settings → Security & Privacy → Show Private Key
- Use a test wallet with test funds only for development

### Getting Etherscan API Key
- Sign up at [Etherscan](https://etherscan.io/register)
- Navigate to API Keys section and create a new key

## Compile Contract

```bash
npx hardhat compile
```

## Run Tests

```bash
npx hardhat test
```

## Deploy

### Deploy to Local Hardhat Network
```bash
npx hardhat run scripts/deploy.ts
```

### Deploy to Sepolia Testnet
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

### Deploy to Ethereum Mainnet
```bash
npx hardhat run scripts/deploy.ts --network mainnet
```

### Deploy to Polygon
```bash
npx hardhat run scripts/deploy.ts --network polygon
```

### Deploy to Mumbai (Polygon Testnet)
```bash
npx hardhat run scripts/deploy.ts --network mumbai
```

### Deploy to Arbitrum
```bash
npx hardhat run scripts/deploy.ts --network arbitrum
```

## Verify Contract on Etherscan

After deployment, verify your contract:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

Replace `<CONTRACT_ADDRESS>` with your deployed contract address.

## Contract Addresses

After deployment, save your contract addresses here:

- **Local**: 
- **Sepolia**: 
- **Mainnet**: 
- **Polygon**: 
- **Mumbai**: 
- **Arbitrum**: 

## Security Best Practices

1. ✅ Never commit `.env` file to version control
2. ✅ Use separate wallets for development and production
3. ✅ Test thoroughly on testnets before mainnet deployment
4. ✅ Keep your private keys secure
5. ✅ Audit your contract before mainnet deployment
6. ✅ Use hardware wallets for mainnet deployments with real funds

## Additional Commands

### Clean artifacts and cache
```bash
npx hardhat clean
```

### Get help
```bash
npx hardhat help
```

### Run Hardhat console
```bash
npx hardhat console --network sepolia
```

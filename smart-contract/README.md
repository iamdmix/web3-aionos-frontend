# Sample Hardhat Project


```
kunal@Crusader:~/web3-aionos-frontend/smart-contract$ npx hardhat run scripts/deploy.ts --network sepolia
[dotenv@17.2.3] injecting env (5) from .env -- tip: ⚙️  enable debug logging with { debug: true }
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
Deploying FreelanceProofChain contract...
FreelanceProofChain deployed to: 0x1A457Bb399358B726AB275bDA3d3Dd778c8ad23A
Deployment transaction hash: 0x36f07df53eb89c04c207e1fca9dba4dfffea1559ac36b3966d0966da1628b044
Waiting for block confirmations...
Contract verified and ready!

Save this contract address for your frontend:
CONTRACT_ADDRESS= 0xD2DeC65f43F29BCe3cE2d8da0f24644921eE53F0
```


This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

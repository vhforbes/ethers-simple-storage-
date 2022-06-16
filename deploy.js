const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

const main = async () => {
  // ----- Variables setup -----
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
  // \/ private key in .env \/
  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // \/ encrypted key in json \/
  const encryptedJson = fs.readFileSync("./encryptedKey.json", "utf8")
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(encryptedJson, process.env.PASSWORD)
  wallet = await wallet.connect(provider)

  // ----- Compiled contract -----
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
  const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8")
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)

  // ----- Contract Deployment -----

  console.log("Deploying...")

  // Transaction information
  const contract = await contractFactory.deploy()
  console.log("Deployment Transaction: ")
  console.log(contract.deployTransaction)

  console.log("Transaction Receipt: ")
  const transactionReceipt = await contract.deployTransaction.wait(1)
  // Only comes after you wait(x) for x block confirmations
  console.log(transactionReceipt)

  // ----- Interacting with contract -----
  const transactionResponse = await contract.store("17")
  console.log(transactionResponse)

  const storeReceipt = await transactionResponse.wait(1)
  console.log("Store contract call receipt: ")
  console.log(storeReceipt)

  const currentFavoriteNumber = await contract.retrieve()
  console.log(`Stored number: ${currentFavoriteNumber.toString()}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })

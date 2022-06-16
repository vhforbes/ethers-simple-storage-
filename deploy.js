const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

const main = async () => {
  // Variables setup
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying...");

  const contract = await contractFactory.deploy();
  const transactionReceipt = await contract.deployTransaction.wait(1);

  // console.log("Deployment Transaction: ");
  // console.log(contract.deployTransaction);

  // // Only comes after you wait()
  // console.log("Transaction Receipt: ");
  // console.log(transactionReceipt);

  // Store number and get te response
  const transactionResponse = await contract.store("17");
  const storeReceipt = await transactionResponse.wait(1);
  const currentFavoriteNumber = await contract.retrieve();
  console.log(currentFavoriteNumber.toString());
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

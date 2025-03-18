const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MyNFTFactory = await hre.ethers.getContractFactory("MyNFTFactory");
  const createFee = hre.ethers.utils.parseEther("0.1"); 
  const factory = await MyNFTFactory.deploy(createFee);
  console.log("MyNFTFactory deployed to:", factory.address);

  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const mintPrice = hre.ethers.utils.parseEther("0.000001"); 
  const myNFT = await MyNFT.deploy("Toko1", "toko", mintPrice);
  console.log("MyNFT deployed to:", myNFT.address);

  const fee = 10;
  await myNFT.updateFeeFactory(fee);
  console.log("Factory fee updated to:", fee);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.4.11",
  paths: {
    root: "./dist/ether",
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/6ea9f5a691674cf488f2d979da771151", //Infura url with projectId
      accounts: ["0xea9ae3cb7c58eac9af4e2a9f13a5c116cbff205247a181a8a6586a3c42c78c0a"] // add the account that will deploy the contract (private key)
     },
   }
};

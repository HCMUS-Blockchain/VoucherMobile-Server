require("dotenv").config({ path: __dirname + "/../.env" });
const Web3 = require("web3");
const { getAmountToken } = require("./getData");
const { signMessage } = require("./signMessage");
const { randomNumberAbi } = require("./abi");

const randomNumberAddress = "0x476A2741Bf8a4dD75A3B0c533aC4e330B5f4d78f";
myPrivateKey = process.env.PRIVATE_KEY;
const addressOwner = "0xa30DE202EB5D5e706E05e3F10134F96BB42Abfe2";

async function connectWallet() {
  web3 = await new Web3(
    "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  );
  randomNumberContract = await new web3.eth.Contract(
    randomNumberAbi,
    randomNumberAddress
  );

  await web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);

  return randomNumberContract;
}

async function calTotalToken() {
  const result1 = await getAmountToken(process.env.ADDRESS_POOL_1);
  const result2 = await getAmountToken(process.env.ADDRESS_POOL_2);
  const result3 = await getAmountToken(process.env.ADDRESS_POOL_3);
  return String(
    parseInt(
      parseFloat(result1[0]) +
        parseFloat(result1[1]) +
        parseFloat(result2[0]) +
        parseFloat(result2[1]) +
        parseFloat(result3[0]) +
        parseFloat(result3[1])
    )
  );
}

async function getRandomNumberBaseOnUniswap() {
  const randomNumberContract = await connectWallet();
  const totalToken = await calTotalToken();
  const signature = signMessage(
    randomNumberAddress,
    {
      aString: totalToken,
    },
    myPrivateKey
  );

  rs = await randomNumberContract.methods
    ._getRandomNumberInRange(totalToken, 1, 10000000000, signature)
    .call({
      from: "0xa30DE202EB5D5e706E05e3F10134F96BB42Abfe2",
    });

  return rs;
}

async function callRandomGenerationFunction() {
  const randomNumberContract = await connectWallet();

  await randomNumberContract.methods.requestRandomWords().send({
    from: addressOwner,
    gas: 1000000,
  });
  const rs = await randomNumberContract.methods.lastRequestId().call({
    from: addressOwner,
  });

  return rs;
}

async function checkRandomNumber(requestId) {
  const randomNumberContract = await connectWallet();

  const rs = await randomNumberContract.methods.s_requests(requestId).call({
    from: addressOwner,
  });

  return JSON.parse(JSON.stringify(rs));
}

async function getRandomNumberBaseOnChainlink(requestId) {
  const randomNumberContract = await connectWallet();

  const rs = await randomNumberContract.methods
    .getRequestStatus(requestId)
    .call({
      from: addressOwner,
    });

  return JSON.parse(JSON.stringify(rs)).randomWords[0];
}

// module.exports.interaction = interaction;
module.exports.getRandomNumberBaseOnUniswap = getRandomNumberBaseOnUniswap;
module.exports.callRandomGenerationFunction = callRandomGenerationFunction;
module.exports.checkRandomNumber = checkRandomNumber;
module.exports.getRandomNumberBaseOnChainlink = getRandomNumberBaseOnChainlink;

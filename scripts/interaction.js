require("dotenv").config({ path: __dirname + "/../.env" });
const Web3 = require("web3");
const { getAmountToken } = require("./getData");
const { signMessage } = require("./signMessage");

const randomNumberAbi = [
  {
    inputs: [
      { internalType: "string", name: "_seed", type: "string" },
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_version", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "string", name: "_tokenFromUniswap", type: "string" },
      { internalType: "uint256", name: "_from", type: "uint256" },
      { internalType: "uint256", name: "_to", type: "uint256" },
      { internalType: "bytes", name: "_signature", type: "bytes" },
    ],
    name: "_getRandomNumberInRange",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const randomNumberAddress = "0x518CcA4f6EC66215dDe2fF1C1661841F9481AE8A";
myPrivateKey = process.env.PRIVATE_KEY;

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

async function interaction() {
  web3 = await new Web3(
    "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  );
  randomNumberContract = await new web3.eth.Contract(
    randomNumberAbi,
    randomNumberAddress
  );

  await web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
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
  // .send({
  //   gas: 3000000,
  // });
  // console.log(rs);
}

module.exports.interaction = interaction;

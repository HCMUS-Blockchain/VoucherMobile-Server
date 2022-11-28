require("dotenv").config({ path: __dirname + "/../.env" });
const Web3 = require("web3");
const { getAmountToken } = require("./getData");
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
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "addr", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "number",
        type: "uint256",
      },
    ],
    name: "GetRandomNumber",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tokenFromUniswap", type: "uint256" },
      { internalType: "uint256", name: "_from", type: "uint256" },
      { internalType: "uint256", name: "_to", type: "uint256" },
      { internalType: "bytes", name: "_signature", type: "bytes" },
    ],
    name: "_getRandomNumberInRange",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const randomNumberAddress = "0x19594C37FD57086F8c8223eb3aCCEdf7b3b55bEd";
myPrivateKey = process.env.PRIVATE_KEY;
async function calTotalToken() {
  const result1 = await getAmountToken(process.env.ADDRESS_POOL_1);
  const result2 = await getAmountToken(process.env.ADDRESS_POOL_2);
  const result3 = await getAmountToken(process.env.ADDRESS_POOL_2);
  return (
    parseFloat(result1[0]) +
    parseFloat(result1[1]) +
    parseFloat(result2[0]) +
    parseFloat(result2[1]) +
    parseFloat(result3[0]) +
    parseFloat(result3[1])
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

  rs = await randomNumberContract.methods
    ._getRandomNumberInRange(
      1234,
      1,
      1000,
      "0x942780270ec1d474699ee4e6c2ad9a405e3e5dcce75da7567f2241c5556bd4bd6199cf4ad989cc2049ecde05c3a02f0e5d876d26c28641dab9019000c3ac592a1b"
    )
    .send({
      from: "0xa30DE202EB5D5e706E05e3F10134F96BB42Abfe2",
      gas: 3000000,
    });
  console.log(rs);
}

interaction();
// calTotalToken().then((result) => {
//   console.log(result);
// });

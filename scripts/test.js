// const { signMessage } = require("./signMessage");
// function test() {
//   const x = signMessage(
//     "0x19594C37FD57086F8c8223eb3aCCEdf7b3b55bEd",
//     {
//       aNumber: 1234,
//     },
//     "5b68e342531435192b45a5d1d7a88795f328eeaf636b0886e97b0d1980be75c3"
//   );
//   console.log(x);
//   return x;
// }

// test();

// import getData from "./getData.js";

// console.log(await getData());

const ethers = require("ethers");
const abi = [
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

const address = "0x19594C37FD57086F8c8223eb3aCCEdf7b3b55bEd";

async function main() {
  const provider = new ethers.providers.WebSocketProvider(
    "wss://goerli.infura.io/ws/v3/a41b2a45a79e4b67b21cdf53a85f6529"
  );
  const contract = new ethers.Contract(address, abi, provider);
  contract.on("GetRandomNumber", (addr, number, event) => {
    let info = {
      addr: addr,
      number: number,
      data: event,
    };
    console.log(JSON.stringify(info, null, 4));
  });
}

main();

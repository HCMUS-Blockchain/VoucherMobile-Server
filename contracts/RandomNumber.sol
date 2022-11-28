//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract RandomNumber is EIP712{
    string private seed;
    uint256 private randNonce;

    event GetRandomNumber(address indexed addr, uint256 number);

    modifier notContract() {
        require(msg.sender.code.length == 0, "Contract not allowed");
        _;
    }

    constructor(string memory _seed, string memory _name, string memory _version) EIP712(_name, _version) {
        seed = _seed;
    }


    function validateAmountFunction(uint256 _aNumber, bytes memory _signature) internal view returns(address){
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("Number(uint256 aNumber)"),
            _aNumber
        )));
        address signer = ECDSA.recover(digest, _signature);
        require(signer == msg.sender, "MessageVerifier: invalid signature");
        require(signer != address(0), "ECDSAUpgradeable: invalid signature");
        return signer;
  }

    function _getRandomNumberInRange(uint _tokenFromUniswap, uint _from, uint _to, bytes memory _signature) external  {
        require(_to > _from, "Range is not valid");
        require(validateAmountFunction(_tokenFromUniswap, _signature) == msg.sender, "Not invalid");
        ++randNonce;
        uint randomNumber = uint(
            keccak256(
                abi.encodePacked(
                    keccak256(
                        abi.encodePacked(
                            block.number,
                            block.difficulty,
                            block.timestamp,
                            randNonce,
                            seed,
                            _tokenFromUniswap
                        )
                    )
                )
            )
        ) % (_to - _from + 1);
        emit GetRandomNumber(msg.sender, randomNumber + _from);
    }
}
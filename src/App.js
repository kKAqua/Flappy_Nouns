import styled from "styled-components";
import { useEffect, useState } from "react";
import { VennClient } from '@vennbuild/venn-dapp-sdk';
import { DynamicConnectButton, DynamicWidget, useDynamicContext, DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const { ethers } = require("ethers");

const vennURL = "https://dc7sea.venn.build/sign";

const vennPolicyAddress = "0x040012eF0Eb5B9C1B4F2F21958A9d141e83d0428";

const vennClient = new VennClient({ vennURL, vennPolicyAddress });

/**
 * All the constant values required for the game to work.
 * By changing these values we can effect the working of the game.
 */
const BIRD_HEIGHT = 80;
const BIRD_WIDTH = 80;
const WALL_HEIGHT = 600;
const WALL_WIDTH = 400;
const GRAVITY = 5;
const OBJ_WIDTH = 52;
let OBJ_SPEED = 3;
let OBJ_GAP = 0;

/**
 * This function is the main component which renders all the game objects.
 * @returns None
 */
function App() {
  const contractABI_ERC = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "score",
          "type": "uint256"
        }
      ],
      "name": "mintTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountt",
          "type": "uint256"
        }
      ],
      "name": "TokensMinted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "mintingPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  const contractABI_NFT = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_paymentToken",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_initBaseURI",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "ERC721EnumerableForbiddenBatchMint",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "ERC721OutOfBoundsIndex",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_newBaseURI",
          "type": "string"
        }
      ],
      "name": "setBaseURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_newmaxSupply",
          "type": "uint256"
        }
      ],
      "name": "setmaxSupply",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "setnewpresale",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_newpresalePeriod",
          "type": "uint256"
        }
      ],
      "name": "setpresalePeriod",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "baseExtension",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "baseURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "check_presale",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cost",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "deploymentTimestamp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paymentToken",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "presalePeriod",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenOfOwnerByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "walletOfOwner",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]


  const flowAddress_NFT = "0xa3eea69c85932B9598454Fd713adeFab0671c4d5";
  const flowAddress_ERC = "0x013449797df60d62FA747D51c88dE8D875083B61";

  //Changing the game values based on the activities done in the game.
  const [isStart, setIsStart] = useState(false);
  const [birdpos, setBirdpos] = useState(300);
  const [objHeight, setObjHeight] = useState(0);
  const [objPos, setObjPos] = useState(WALL_WIDTH);
  const [score, setScore] = useState(0);
  const [walletAddress, setWalletAddress] = useState(null);
  const [nftList, setNftList] = useState([]);
  const [picId, setPicId] = useState(0);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAscending, setIsAscending] = useState(false);
  const { primaryWallet } = useDynamicContext();
  // Function to handle wallet connection

  const DynamicClick = async () => {
    console.log("Click!")
    setWalletAddress(primaryWallet.address);
    console.log(primaryWallet.address);
    setIsLoggedIn(true);
  }

  const connectWallet = async () => {
    // try {
    //   await fcl.authenticate();
    //   const user = await fcl.currentUser().snapshot();
    //   console.log("Connected User:", user);
    // } catch (error) {
    //   console.error("Wallet connection failed:", error);
    // }
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log(currentChainId);
        setWalletAddress(accounts[0]);
        setIsLoggedIn(true);
        // if (parseInt(currentChainId, 16) !== targetChainId) {
        //   await window.ethereum.request({
        //     method: 'wallet_switchEthereumChain',
        //     params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        //   });
        // }
      } catch (error) {
        console.error("Wallet connection failed", error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  useEffect(() => {
    if (walletAddress) {
      console.log("Updated Wallet Address:", walletAddress);
      fetchNFTs();
    }
  }, [walletAddress]);

  //End the game when the player hits the bottom of the screen.
  useEffect(() => {
    let intVal;
    if (isStart && birdpos < WALL_HEIGHT - BIRD_HEIGHT) {
      intVal = setInterval(() => {
        setBirdpos((birdpos) => birdpos + GRAVITY);
      }, 24);
    } else if (birdpos >= WALL_HEIGHT - BIRD_HEIGHT) {
      setIsStart(false);
      setIsGameOver(true);
    }
    return () => clearInterval(intVal);
  }, [isStart, birdpos]);


  //Generating the pipes(obstacles) for the game.
  useEffect(() => {
    let objval;
    if (isStart && objPos >= -OBJ_WIDTH) {
      objval = setInterval(() => {
        setObjPos((objPos) => objPos - OBJ_SPEED);
      }, 24);

      return () => {
        clearInterval(objval);
      };
    } else {
      setObjPos(WALL_WIDTH);
      OBJ_GAP = Math.floor(Math.random() * 150) + 150 - (score * 2 > 100 ? 100 : score * 2)
      setObjHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP - 100)) + 50);
      if (isStart) {
        setScore((score) => score + 1);
        OBJ_SPEED += 1;
      };
    }
  }, [isStart, objPos]);

  //Ends the game if the player hits one of the obstacles.
  useEffect(() => {
    let topObj = birdpos >= 0 && birdpos < objHeight;
    let bottomObj =
      birdpos <= WALL_HEIGHT &&
      birdpos >=
      WALL_HEIGHT - (WALL_HEIGHT - OBJ_GAP - objHeight) - BIRD_HEIGHT;

    if (
      objPos >= OBJ_WIDTH &&
      objPos <= OBJ_WIDTH + 80 &&
      (topObj || bottomObj)
    ) {
      setIsStart(false);
      setIsGameOver(true);
    }
  }, [isStart, birdpos, objHeight, objPos]);

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("last:" + picId);
      if (picId % 2 === 0)
        setPicId(picId + 1)
      else
        setPicId(picId - 1)
    }, 100);
    // console.log(picId);
    return () => clearInterval(interval);
  }, [picId]);

  //Handles the player movements.
  useEffect(() => {
    let ascendInterval;
    let velocity = -10;
    if (isAscending && isStart && !isGameOver) {
      ascendInterval = setInterval(() => {
        setBirdpos((prev) => {
          if (prev + velocity <= 0) {
            clearInterval(ascendInterval);
            return 0;
          }
          return prev + velocity;
        });
      }, 24);
    }
    else if (!isAscending && isStart && !isGameOver) {
      ascendInterval = setInterval(() => {
        setBirdpos((prev) => {
          if (prev + velocity <= 0) {
            clearInterval(ascendInterval);
            return 0;
          }
          velocity += 1;
          return velocity < 0 ? (prev + velocity) : prev;
        });
      }, 24);
    }
    return () => clearInterval(ascendInterval);
  }, [isAscending, isStart, isGameOver]);

  const handleMouseDown = () => {
    if (!isStart && isLoggedIn) {
      setIsStart(true);
    } else if (isStart && !isGameOver) {
      setIsAscending(true);
    }
  };

  const handleMouseUp = () => {
    setIsAscending(false);
  };

  const handleKeyDown = (event) => {
    if (event.code === 'Space') {
      handleMouseDown();
    }
  };

  const handleKeyUp = (event) => {
    if (event.code === 'Space') {
      handleMouseUp();
    }
  };

  const handleReadyButton = () => {
    setPicId(selectedNFT * 2);
    setIsReady(true);
  };

  // Function to fetch NFTs for the connected wallet
  const fetchNFTs = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(flowAddress_NFT, contractABI_NFT, signer);
    const requireTx = await nftContract.walletOfOwner(walletAddress);
    console.log(requireTx);
    let filteredNftList = [0];
    for (const i of requireTx) {
      if (i < 12) {
        console.log(i);
        filteredNftList.push(i);
      }
    }
    console.log(filteredNftList);
    setNftList(filteredNftList);
  };

  const MintToken = async () => {
    console.log("Minting tokens");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(flowAddress_ERC, contractABI_ERC, signer);

    const tx = {
      to: flowAddress_ERC,
      from: await signer.getAddress(),
      data: tokenContract.interface.encodeFunctionData("mintTokens", [score]),
      value: 0
    };

    const approvedTransaction = await vennClient.approve(tx);
    const receipt = await signer.sendTransaction(approvedTransaction);
    await receipt.wait();
    alert('Successfully minted tokens!');
  }

  const Redeem = async () => {
    console.log("Redeem NFT");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(flowAddress_ERC, contractABI_ERC, signer);
    const nftContract = new ethers.Contract(flowAddress_NFT, contractABI_NFT, signer);

    console.log("approving ......");
    const approveTx = {
      to: flowAddress_ERC,
      from: await signer.getAddress(),
      data: tokenContract.interface.encodeFunctionData("approve", [flowAddress_NFT, ethers.utils.parseUnits("1", 18)]),
      value: 0
    };

    const approvedApproveTx = await vennClient.approve(approveTx);
    const approveReceipt = await signer.sendTransaction(approvedApproveTx);
    await approveReceipt.wait();
    console.log("approved");

    const mintTx = await nftContract.mint(walletAddress);
    console.log("minting......");
    await mintTx.wait();

    alert('Successfully minted an NFT!');
  }

  return (
    <Home onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex="0">
      {!isLoggedIn ? (
        <LoginContainer height={WALL_HEIGHT} width={WALL_WIDTH}>
          <h2>
            FlappyNouns
          </h2>
          {/* <DynamicConnectButton onClick={DynamicClick}>Connect Wallet</DynamicConnectButton> */}
          <DynamicWidget />
          <button onClick={DynamicClick}>Let's GO!</button>
        </LoginContainer>
      ) : (isLoggedIn && !isReady) ? (
        <AddressContainer height={WALL_HEIGHT} width={WALL_WIDTH}>
          <h2>Select an NFT as your player:</h2>
          <NFTList>
            {nftList.map((nft_id, index) => (
              <NFTItem key={index} onClick={() => {
                setSelectedNFT(nft_id);
                console.log(2 * nft_id);
              }} selected={selectedNFT === nft_id}>
                <img src={`${process.env.PUBLIC_URL}/images/${2 * nft_id}.png`} />
              </NFTItem>
            ))}
          </NFTList>
          <button onClick={handleReadyButton}>
            Ready!
          </button>
        </AddressContainer>
      ) : (isReady && isLoggedIn && !isStart && !isGameOver) ? (
        <Startboard height={WALL_HEIGHT} width={WALL_WIDTH}>
          Click To Start
        </Startboard>
      ) : isGameOver ? (
        <GameOverContainer height={WALL_HEIGHT} width={WALL_WIDTH}>
          <h2>Game Over</h2>
          <p>Final Score: {score}</p>
          <ButtonContainer>
            <button onClick={MintToken}>
              Mint Token
            </button>
            <button onClick={Redeem}>
              Redeem NFT
            </button>
            <button onClick={() => {
              setIsGameOver(false); setIsStart(false); setIsReady(false); setScore(0); setBirdpos(300); OBJ_SPEED = 5;
            }}>
              Restart
            </button>
          </ButtonContainer>
        </GameOverContainer>
      ) : (
        <>
          <ScoreShow>Score: {score}</ScoreShow>
          <Background height={WALL_HEIGHT} width={WALL_WIDTH}>
            <Obj
              height={objHeight}
              width={OBJ_WIDTH}
              left={objPos}
              top={0}
              deg={180}
            />
            <Bird
              height={BIRD_HEIGHT}
              width={BIRD_WIDTH}
              top={birdpos}
              left={100}
              image={`${process.env.PUBLIC_URL}/images/${picId}.png`}
            />
            <Obj
              height={WALL_HEIGHT - OBJ_GAP - objHeight}
              width={OBJ_WIDTH}
              left={objPos}
              top={WALL_HEIGHT - (objHeight + (WALL_HEIGHT - OBJ_GAP - objHeight))}
              deg={0}
            />
          </Background>
        </>
      )}
    </Home>
  );
}

export default App;

//All the stylesheets required for the game.
const Home = styled.div`
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flexDirection: 'column';
      font-family: "Press Start 2P", system-ui;
      font-weight: 400;
      font-style: normal;
      `;

const Background = styled.div`
      background-image: url("./images/background-day.png");
      background-repeat: no-repeat;
      background-size: ${(props) => props.width}px ${(props) => props.height}px;
      width: ${(props) => props.width}px;
      height: ${(props) => props.height}px;
      position: relative;
      overflow: hidden;
      border: 2px solid black;
      `;

const Bird = styled.div`
      position: absolute;
      background-image: url(${(props) => props.image});
      background-repeat: no-repeat;
      background-size: ${(props) => props.width}px ${(props) => props.height}px;
      width: ${(props) => props.width}px;
      height: ${(props) => props.height}px;
      top: ${(props) => props.top}px;
      left: ${(props) => props.left}px;
      `;

const Obj = styled.div`
      position: relative;
      background-image: url("./images/pipe-green.png");
      width: ${(props) => props.width}px;
      height: ${(props) => props.height}px;
      left: ${(props) => props.left}px;
      top: ${(props) => props.top}px;
      transform: rotate(${(props) => props.deg}deg);
      `;

const Startboard = styled(Background)`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-radius: 20px;
      color: white;
      font-size: 30px;
      font-family: "Press Start 2P", system-ui;
      font-weight: 400;
      font-style: normal;
      `;

const ScoreShow = styled.div`
      position: absolute;
      top: 10%;
      left: 40%;
      z-index: 1;
      font-weight: bold;
      font-size: 30px;
      font-family: "Press Start 2P", system-ui;
      font-weight: 400;
      font-style: normal;
      `;

const LoginContainer = styled(Background)`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-radius: 20px;
      color: white;
      font-family: "Press Start 2P", system-ui;
      font-weight: 400;
      font-style: normal;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
      h2 {
        font - size: 30px;
      margin-bottom: 150px;
  }
      button {
        padding: 15px 30px;
      font-size: 12px;
      font-family: "Press Start 2P", system-ui;
      font-weight: 400;
      font-style: normal;
      background-color: #007bff;
      border: none;
      border-radius: 10px;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s ease;
  }
      button:hover {
        background - color: #0056b3;
  }
      `;

const NFTList = styled.div`
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
      font-family: "Press Start 2P", system-ui;
      font-weight: 400;
      font-style: normal;
      `;

const NFTItem = styled.div`
      width: 100px;
      text-align: center;
      cursor: pointer;
      border: ${(props) => (props.selected ? '2px solid #f0db4f' : '2px solid transparent')};
      padding: 10px;
      font-family: "Press Start 2P", system-ui;
      font-weight: 400;
      font-style: normal;
      img {
        width: 100%;
      height: auto;
      border-radius: 10px;
  }
      p {
        margin - top: 10px;
      font-size: 14px;
      color: #ffffff;
  }
      `;

const AddressContainer = styled(Background)`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-radius: 20px;
      color: white;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
      background-color: rgba(0, 0, 0, 0.7);
      font-family: "Press Start 2P", system-ui;
      font-weight: 400;
      font-style: normal;
      h2 {
        font - size: 20px;
      margin-bottom: 45px;
      color: #fffff;
  }
      p {
        font - size: 22px;
      margin-bottom: 25px;
      color: #ffffff;
  }
      button {
        padding: 15px 30px;
      font-size: 18px;
      background-color: #ff4500;
      border: none;
      border-radius: 10px;
      font-family: "Press Start 2P", system-ui;
      font-weight: 400;
      font-style: normal;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s ease;
  }
      button:hover {
        background - color: #e03e00;
  }
      `

const ButtonContainer = styled.div`
      display: flex;
      gap: 20px;
      margin-top: 20px;
      font-family: "Press Start 2P", system-ui;
      font-weight: 400;
      font-style: normal;
      button {
        font - family: "Press Start 2P", system-ui;
        font-weight: 400;
        font-style: normal;
        padding: 15px 30px;
        font-size: 12px;
        background-color: #28a745;
        border: none;
        border-radius: 10px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button:hover {
        background - color: #218838;
      }
      `;

const GameOverContainer = styled(Background)`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-radius: 20px;
      color: white;
      font-family: "Press Start 2P", system-ui;
      font-weight: 400;
      font-style: normal;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
      h2 {
        font - size: 36px;
      margin-bottom: 20px;
  }
      p {
        font - size: 20px;
      margin-bottom: 20px;
  }
      button {
        font - family: "Press Start 2P", system-ui;
      font-weight: 400;
      font-style: normal;
      padding: 5px 5px;
      font-size: 12px;
      background-color: #28a745;
      margin: 20px;
      border: none;
      border-radius: 10px;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s ease;
  }
      button:hover {
        background - color: #218838;
  }
      `;

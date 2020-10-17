// note: USDT, USDC decimal = 6
var web3 = new Web3(
    new Web3.providers.HttpProvider(      
      "https://mainnet.infura.io/v3/904542f7796d484b8288ca2053c9399f"
    )
  );

  const BN = web3.utils.BN;
  
  var farmingAddress = "0x"; //farming address
  const tokenAddress = "0x31396D01409c9B6510E8245f768d378089988901"; // token
  const tokenLatteAddress = "0x013a505d2d9842d9ef33e2413e5565a93a7c9431"; // token Latte
  const uni1 = "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"; // USDC

  var ethconnected = false;
  var ethaddress = "0x";
  var balance = 0;
  var balanceLatte = 0;
  var currentPageToken = "0x";
  var currentPagePoolID = 0;
  var currentPageWalletBalance = 0;
  var currentPageStaked = 0;
  var currentPageReward = 0;
  
  const uniswapABI = [
    {
      constant: true,
      inputs: [],
      name: "getReserves",
      outputs: [
        { internalType: "uint112", name: "_reserve0", type: "uint112" },
        { internalType: "uint112", name: "_reserve1", type: "uint112" },
        { internalType: "uint32", name: "_blockTimestampLast", type: "uint32" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];

  const erc20ABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const farmABI = [
    {      
      inputs: [
        {
          internalType: "uint256",
          name: "_pid",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_user",
          type: "address",
        },
      ],
      name: "pendingEspresso",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "espressoPerBlock",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "userInfo",
      outputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "rewardDebt",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_pid",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "deposit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_pid",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getExchangeRateToken",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        }
      ],
      name: "exchange",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_groupId",
          type: "uint256",
        },
      ],
      name: "votePool",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_pid",
          type: "uint256",
        },        
      ],
      name: "getPoolVote",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_pid",
          type: "uint256",
        },        
      ],
      name: "getPrevPoolVote",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAmountMinorityRewardPool",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_gid",
          type: "uint256",
        },        
      ],
      name: "getMinorityTotalVote",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_user",
          type: "address",
        },        
      ],
      name: "pendingMinorityEspresso",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_gid",
          type: "uint256",
        },        
        {
          internalType: "address",
          name: "_account",
          type: "address",
        },        
      ],
      name: "getMinorityVote",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_groupId",
          type: "uint256",
        },
      ],
      name: "voteMinority",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "withdrawMinorityReward",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getStartMinorityBlock",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        }
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getEndMinorityBlock",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        }
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_gid",
          type: "uint256",
        }
      ],
      name: "getMinorityPrevTotalVote",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        }
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getMinorityWinner",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        }
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getStartVoteBlock",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        }
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getEndVoteBlock",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        }
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getPoolWinner",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        }
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  var prices = {
    tokenusd: -1,
    tokeneth: -1,    
    latteusd: -1,
    lattertoken: -1,
    ethusd: -1,
  };

//contract,name,url,weight,yield
var pools = [
  [
    "0xe3da716b710492ab2939fba095d2d1c747855d95",
    "UNISWAP ESPR/ETH RED",
    "https://info.uniswap.org/pair/0xe3da716b710492ab2939fba095d2d1c747855d95",
    6,
    0,
    0,
    "-"
  ],
  [
    "0xe3da716b710492ab2939fba095d2d1c747855d95",
    "UNISWAP ESPR/ETH GREEN",
    "https://uniswap.info/pair/0xe3da716b710492ab2939fba095d2d1c747855d95",
    6,
    0,
    0,
    "-"
  ],
  [
    "0xe3da716b710492ab2939fba095d2d1c747855d95",
    "UNISWAP ESPR/ETH BLUE",
    "https://uniswap.info/pair/0xe3da716b710492ab2939fba095d2d1c747855d95",
    6,
    0,
    0,
    "-"
  ],
  [
    "0x",
    "UNISWAP ESPR/USDT RED",
    "https://uniswap.info/pair/0x",
    3,
    0,
    0,
    "-"
  ],
  [
    "0x",
    "UNISWAP ESPR/USDT GREEN",
    "https://uniswap.info/pair/0x",
    3,
    0,
    0,
    "-"
  ],
  [
    "0x",
    "UNISWAP ESPR/USDT BLUE",
    "https://uniswap.info/pair/0x",
    3,
    0,
    0,
    "-"
  ],
  [
    "0xd3d2e2692501a5c9ca623199d38826e513033a17",
    "UNISWAP UNI/ETH RED",
    "https://uniswap.info/pair/0xd3d2e2692501a5c9ca623199d38826e513033a17",
    2,
    0,
    0,
    "-"
  ],
  [
    "0xd3d2e2692501a5c9ca623199d38826e513033a17",
    "UNISWAP UNI/ETH GREEN",
    "https://uniswap.info/pair/0xd3d2e2692501a5c9ca623199d38826e513033a17",
    2,
    0,
    0,
    "-"
  ],
  [
    "0xd3d2e2692501a5c9ca623199d38826e513033a17",
    "UNISWAP UNI/ETH BLUE",
    "https://uniswap.info/pair/0xd3d2e2692501a5c9ca623199d38826e513033a17",
    2,
    0,
    0,
    "-"
  ],
  [
    "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11",
    "UNISWAP DAI/ETH RED",
    "https://uniswap.info/pair/0xa478c2975ab1ea89e8196811f51a7b7ade33eb11",
    1,
    0,
    0,
    "-"
  ],
  [
    "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11",
    "UNISWAP DAI/ETH GREEN",
    "https://uniswap.info/pair/0xa478c2975ab1ea89e8196811f51a7b7ade33eb11",
    1,
    0,
    0,
    "-"
  ],
  [
    "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11",
    "UNISWAP DAI/ETH BLUE",
    "https://uniswap.info/pair/0xa478c2975ab1ea89e8196811f51a7b7ade33eb11",
    1,
    0,
    0,
    "-"
  ],
];

  var loadedpools = 0;
  var totalPoolWeight = 36; // sum of weight
  function updateYield() {
    // need modification
    var perblock = 12;
    var annualblock = (365 * 86400) / 15; // approximation of 15 sec/block
    var annualreward = annualblock * perblock;
    var perpoolunit = annualreward / totalPoolWeight;

    var ctx0 = new web3.eth.Contract(uniswapABI, pools[0][0]);
    ctx0.methods.getReserves().call(function (err, result1) {
      ctx0.methods.totalSupply().call(function (err, result2) {
        ctx0.methods.balanceOf(farmingAddress).call(function (err, result3) {
          var totalSupply = result2; // total supply of UNI-V2
          var stakedSupply = result3; // staked amount in farm
          var percentageOfSupplyInPool = stakedSupply / totalSupply;
          pools[0][4] =
            ((perpoolunit / (result1["_reserve0"] / Math.pow(10, 18))) *
              100 * pools[0][3]) / percentageOfSupplyInPool;
          pools[0][5] =
            ((prices["tokenusd"] * result1["_reserve0"]) /
              Math.pow(10, 18)) *
            percentageOfSupplyInPool;
            if(isNaN(parseInt(pools[0][4]))) {
              $(".pool0yield").text('---.-%');
            } else {
              $(".pool0yield").animateNumbers(parseInt(pools[0][4]) + "%");
            }
          loadedPool();
        });
      });
    });

    var ctx1 = new web3.eth.Contract(uniswapABI, pools[1][0]);
    ctx1.methods.getReserves().call(function (err, result1) {
      ctx1.methods.totalSupply().call(function (err, result2) {
        ctx1.methods.balanceOf(farmingAddress).call(function (err, result3) {
          var totalSupply = result2; // total supply of UNI-V2
          var stakedSupply = result3; // staked amount in farm
          var percentageOfSupplyInPool = stakedSupply / totalSupply;
          pools[1][4] =
            ((perpoolunit / (result1["_reserve0"] / Math.pow(10, 18))) *
              100 * pools[1][3]) / percentageOfSupplyInPool;
          pools[1][5] =
            ((prices["tokenusd"] * result1["_reserve0"]) /
              Math.pow(10, 18)) *
            percentageOfSupplyInPool;
            if(isNaN(parseInt(pools[1][4]))) {
              $(".pool1yield").text('---.-%');
            } else {
              $(".pool1yield").animateNumbers(parseInt(pools[1][4]) + "%");
            }
          loadedPool();
        });
      });
    });

    var ctx2 = new web3.eth.Contract(uniswapABI, pools[2][0]);
    ctx2.methods.getReserves().call(function (err, result1) {
      ctx2.methods.totalSupply().call(function (err, result2) {
        ctx2.methods.balanceOf(farmingAddress).call(function (err, result3) {
          var totalSupply = result2; // total supply of UNI-V2
          var stakedSupply = result3; // staked amount in farm
          var percentageOfSupplyInPool = stakedSupply / totalSupply;
          pools[2][4] =
            ((perpoolunit / (result1["_reserve0"] / Math.pow(10, 18))) *
              100 * pools[2][3]) / percentageOfSupplyInPool;
          pools[2][5] =
            ((prices["tokenusd"] * result1["_reserve0"]) /
              Math.pow(10, 18)) *
            percentageOfSupplyInPool;
            if(isNaN(parseInt(pools[2][4]))) {
              $(".pool2yield").text('---.-%');
            } else {
              $(".pool2yield").animateNumbers(parseInt(pools[2][4]) + "%");
            }
          loadedPool();
        });
      });
    });

    var ctx3 = new web3.eth.Contract(uniswapABI, pools[3][0]);
    ctx3.methods.getReserves().call(function (err, result1) {
      ctx3.methods.totalSupply().call(function (err, result2) {
        ctx3.methods.balanceOf(farmingAddress).call(function (err, result3) {
          var totalSupply = result2; // total supply of UNI-V2
          var stakedSupply = result3; // staked amount in farm
          var percentageOfSupplyInPool = stakedSupply / totalSupply;
          pools[3][4] =
            ((perpoolunit / (result1["_reserve0"] / Math.pow(10, 18))) *
              100 * pools[3][3]) / percentageOfSupplyInPool;
          pools[3][5] =
            ((prices["tokenusd"] * result1["_reserve0"]) /
              Math.pow(10, 18)) *
            percentageOfSupplyInPool;
            if(isNaN(parseInt(pools[3][4]))) {
              $(".pool3yield").text('---.-%');
            } else {
              $(".pool3yield").animateNumbers(parseInt(pools[3][4]) + "%");
            }
          loadedPool();
        });
      });
    });

    var ctx4 = new web3.eth.Contract(uniswapABI, pools[4][0]);
    ctx4.methods.getReserves().call(function (err, result1) {
      ctx4.methods.totalSupply().call(function (err, result2) {
        ctx4.methods.balanceOf(farmingAddress).call(function (err, result3) {
          var totalSupply = result2; // total supply of UNI-V2
          var stakedSupply = result3; // staked amount in farm
          var percentageOfSupplyInPool = stakedSupply / totalSupply;
          pools[4][4] =
            ((perpoolunit / (result1["_reserve0"] / Math.pow(10, 18))) *
              100 * pools[4][3]) / percentageOfSupplyInPool;
          pools[4][5] =
            ((prices["tokenusd"] * result1["_reserve0"]) /
              Math.pow(10, 18)) *
            percentageOfSupplyInPool;
            if(isNaN(parseInt(pools[4][4]))) {
              $(".pool4yield").text('---.-%');
            } else {
              $(".pool4yield").animateNumbers(parseInt(pools[4][4]) + "%");
            }
          loadedPool();
        });
      });
    });

    var ctx5 = new web3.eth.Contract(uniswapABI, pools[5][0]);
    ctx5.methods.getReserves().call(function (err, result1) {
      ctx5.methods.totalSupply().call(function (err, result2) {
        ctx5.methods.balanceOf(farmingAddress).call(function (err, result3) {
          var totalSupply = result2; // total supply of UNI-V2
          var stakedSupply = result3; // staked amount in farm
          var percentageOfSupplyInPool = stakedSupply / totalSupply;
          pools[5][4] =
            ((perpoolunit / (result1["_reserve0"] / Math.pow(10, 18))) *
              100 * pools[5][3]) / percentageOfSupplyInPool;
          pools[5][5] =
            ((prices["tokenusd"] * result1["_reserve0"]) /
              Math.pow(10, 18)) *
            percentageOfSupplyInPool;
            if(isNaN(parseInt(pools[5][4]))) {
              $(".pool5yield").text('---.-%');
            } else {
              $(".pool5yield").animateNumbers(parseInt(pools[5][4]) + "%");
            }
          loadedPool();
        });
      });
    });

    var ctx6 = new web3.eth.Contract(uniswapABI, pools[6][0]);
    ctx6.methods.getReserves().call(function (err, result1) {
      ctx6.methods.totalSupply().call(function (err, result2) {
        ctx6.methods.balanceOf(farmingAddress).call(function (err, result3) {
          var totalSupply = result2; // total supply of UNI-V2
          var stakedSupply = result3; // staked amount in farm
          var percentageOfSupplyInPool = stakedSupply / totalSupply;
          pools[6][4] =
            (((perpoolunit * prices["tokeneth"]) /
              (result1["_reserve1"] / Math.pow(10, 18))) *
              100 *
              pools[6][3]) /
            percentageOfSupplyInPool;
          pools[6][5] =
            ((prices["ethusd"] * result1["_reserve1"]) / Math.pow(10, 18)) *
            percentageOfSupplyInPool;
            if(isNaN(parseInt(pools[6][4]))) {
              $(".pool6yield").text('---.-%');
            } else {
              $(".pool6yield").animateNumbers(parseInt(pools[6][4]) + "%");
            }
          loadedPool();
        });
      });
    });

    var ctx7 = new web3.eth.Contract(uniswapABI, pools[7][0]);
    ctx7.methods.getReserves().call(function (err, result1) {
      ctx7.methods.totalSupply().call(function (err, result2) {
        ctx7.methods.balanceOf(farmingAddress).call(function (err, result3) {
          var totalSupply = result2; // total supply of UNI-V2
          var stakedSupply = result3; // staked amount in farm
          var percentageOfSupplyInPool = stakedSupply / totalSupply;
          pools[7][4] =
            (((perpoolunit * prices["tokeneth"]) /
              (result1["_reserve1"] / Math.pow(10, 18))) *
              100 *
              pools[7][3]) /
            percentageOfSupplyInPool;
          pools[7][5] =
            ((prices["ethusd"] * result1["_reserve1"]) / Math.pow(10, 18)) *
            percentageOfSupplyInPool;
            if(isNaN(parseInt(pools[7][4]))) {
              $(".pool7yield").text('---.-%');
            } else {
              $(".pool7yield").animateNumbers(parseInt(pools[7][4]) + "%");
            }
          loadedPool();
        });
      });
    });

    var ctx8 = new web3.eth.Contract(uniswapABI, pools[8][0]);
    ctx8.methods.getReserves().call(function (err, result1) {
      ctx8.methods.totalSupply().call(function (err, result2) {
        ctx8.methods.balanceOf(farmingAddress).call(function (err, result3) {
          var totalSupply = result2; // total supply of UNI-V2
          var stakedSupply = result3; // staked amount in farm
          var percentageOfSupplyInPool = stakedSupply / totalSupply;
          pools[8][4] =
            (((perpoolunit * prices["tokeneth"]) /
              (result1["_reserve1"] / Math.pow(10, 18))) *
              100 *
              pools[8][3]) /
            percentageOfSupplyInPool;
          pools[8][5] =
            ((prices["ethusd"] * result1["_reserve1"]) / Math.pow(10, 18)) *
            percentageOfSupplyInPool;
            if(isNaN(parseInt(pools[8][4]))) {
              $(".pool8yield").text('---.-%');
            } else {
              $(".pool8yield").animateNumbers(parseInt(pools[8][4]) + "%");
            }
          loadedPool();
        });
      });
    });

    var ctx9 = new web3.eth.Contract(uniswapABI, pools[9][0]);
    ctx9.methods.getReserves().call(function (err, result1) {
      ctx9.methods.totalSupply().call(function (err, result2) {
        ctx9.methods.balanceOf(farmingAddress).call(function (err, result3) {
          var totalSupply = result2; // total supply of UNI-V2
          var stakedSupply = result3; // staked amount in farm
          var percentageOfSupplyInPool = stakedSupply / totalSupply;
          pools[9][4] =
            (((perpoolunit * prices["tokeneth"]) /
              (result1["_reserve1"] / Math.pow(10, 18))) *
              100 *
              pools[9][3]) /
            percentageOfSupplyInPool;
          pools[9][5] =
            ((prices["ethusd"] * result1["_reserve1"]) / Math.pow(10, 18)) *
            percentageOfSupplyInPool;
            if(isNaN(parseInt(pools[9][4]))) {
              $(".pool9yield").text('---.-%');
            } else {
              $(".pool9yield").animateNumbers(parseInt(pools[9][4]) + "%");
            }
          loadedPool();
        });
      });
    });

    var ctx10 = new web3.eth.Contract(uniswapABI, pools[10][0]);
    ctx10.methods.getReserves().call(function (err, result1) {
      ctx10.methods.totalSupply().call(function (err, result2) {
        ctx10.methods.balanceOf(farmingAddress).call(function (err, result3) {
          var totalSupply = result2; // total supply of UNI-V2
          var stakedSupply = result3; // staked amount in farm
          var percentageOfSupplyInPool = stakedSupply / totalSupply;
          pools[10][4] =
            (((perpoolunit * prices["tokeneth"]) /
              (result1["_reserve1"] / Math.pow(10, 18))) *
              100 *
              pools[10][3]) /
            percentageOfSupplyInPool;
          pools[10][5] =
            ((prices["ethusd"] * result1["_reserve1"]) / Math.pow(10, 18)) *
            percentageOfSupplyInPool;
            if(isNaN(parseInt(pools[10][4]))) {
              $(".pool10yield").text('---.-%');
            } else {
              $(".pool10yield").animateNumbers(parseInt(pools[10][4]) + "%");
            }
          loadedPool();
        });
      });
    });

    var ctx11 = new web3.eth.Contract(uniswapABI, pools[11][0]);
    ctx11.methods.getReserves().call(function (err, result1) {
      ctx11.methods.totalSupply().call(function (err, result2) {
        ctx11.methods.balanceOf(farmingAddress).call(function (err, result3) {
          var totalSupply = result2; // total supply of UNI-V2
          var stakedSupply = result3; // staked amount in farm
          var percentageOfSupplyInPool = stakedSupply / totalSupply;
          pools[11][4] =
            (((perpoolunit * prices["tokeneth"]) /
              (result1["_reserve1"] / Math.pow(10, 18))) *
              100 *
              pools[11][3]) /
            percentageOfSupplyInPool;
          pools[11][5] =
            ((prices["ethusd"] * result1["_reserve1"]) / Math.pow(10, 18)) *
            percentageOfSupplyInPool;
            if(isNaN(parseInt(pools[11][4]))) {
              $(".pool11yield").text('---.-%');
            } else {
              $(".pool11yield").animateNumbers(parseInt(pools[11][4]) + "%");
            }
          loadedPool();
        });
      });
    });

  
  }
  
  async function connectWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      conn = await window.ethereum.enable();
      console.log(conn.length);
  
      ethconnected = conn.length > 0;
      if (ethconnected) {
        ethaddress = conn[0];
      }
      updateConnectStatus();
      web3.eth.getAccounts().then(console.log);
  
      return true;
    }
  }
  
  function updateConnectStatus() {
    if (ethconnected) {
      $("body").addClass("web3");
    }
    $(".block0start").text(pools[0][6]);
    $(".block1start").text(pools[1][6]);
    $(".block2start").text(pools[2][6]);
    $(".block3start").text(pools[3][6]);
    $(".block4start").text(pools[4][6]);
    $(".block5start").text(pools[5][6]);
    $(".block6start").text(pools[6][6]);
    $(".block7start").text(pools[7][7]);
    $(".block8start").text(pools[8][8]);
    $(".block9start").text(pools[9][9]);
    $(".block10start").text(pools[10][10]);
    $(".block11start").text(pools[11][11]);
    getBalance(ethaddress);
  }
  function getSupply() {
    var contract = new web3.eth.Contract(erc20ABI, tokenAddress);
    contract.methods.totalSupply().call(function (error, result) {
      result = result / Math.pow(10, 18);
      console.log(error, result);
      $(".supply span").animateNumbers(parseInt(result));
      $(".mcap span").animateNumbers(parseInt(result * prices["tokenusd"]));
    });
  }

  function getBalance(address) {
    var contract = new web3.eth.Contract(erc20ABI, tokenAddress);
    contract.methods.balanceOf(address).call(function (error, result) {
      contract.methods.decimals().call(function (error, d) {
        result = result / Math.pow(10, d);
        if (isNaN(result)) {
          result = 0;
        }
  
        $(".balance").text(result.toFixedSpecial(2) + " ESPR");
        balance = result;
      });
    });

    var contract1 = new web3.eth.Contract(erc20ABI, tokenLatteAddress);
    contract1.methods.balanceOf(address).call(function (error, result) {
      contract1.methods.decimals().call(function (error, d) {
        result = result / Math.pow(10, d);
        if (isNaN(result)) {
          result = 0;
        }
  
        $(".balancelatte").text(result.toFixedSpecial(2) + " LTTE");
        balance = result;
      });
    });

    var ctx0 = new web3.eth.Contract(farmABI, farmingAddress); // usdc-eth    
    ctx0.methods.pendingMinorityEspresso(ethaddress).call(function(err, result) {       
      result = result / Math.pow(10, 18);
      $(".balanceReward").text(result.toFixedSpecial(2) + ' ESPR');
    });

    var ctx1 = new web3.eth.Contract(farmABI, farmingAddress); // usdc-eth
    ctx1.methods.getMinorityVote(0, ethaddress).call(function(err, result) {
      $(".yourArabicaPool").text(result + ' LTTE');
    });

    var ctx2 = new web3.eth.Contract(farmABI, farmingAddress); // usdc-eth
    ctx2.methods.getMinorityVote(1, ethaddress).call(function(err, result) {
      $(".yourRobustaPool").text(result + ' LTTE');
    });

    var ctx3 = new web3.eth.Contract(farmABI, farmingAddress); // usdc-eth
    ctx3.methods.getMinorityVote(2, ethaddress).call(function(err, result) {
      $(".yourLibericaPool").text(result + ' LTTE');
    });    
  }
  
  function hidepages() {
    $("main").hide();
  }
  function nav(classname) {
    hidepages();
    $("body").removeClass("approved");
    $("main." + classname).show();
    if (classname.indexOf("pool") === 0) {
      if (classname.length == 5)
        initpooldata(parseInt(classname.slice(-1)));
      else
        initpooldata(parseInt(classname.slice(-2)));
      $("main.pool").show();
    }
  }
  function initpooldata(id) {
    $(".farmname").text(pools[id][1] + " pool");
    currentPageToken = pools[id][0];
    currentPagePoolID = id;
    //get yield balance
  
    //get staked balance
    //if larger than zero, approved

    var contract = new web3.eth.Contract(farmABI, farmingAddress);
    contract.methods
      .userInfo(currentPagePoolID, ethaddress)
      .call(function (error, result) {
        currentPageStaked = result[0];
        result[0] = (result[0] / Math.pow(10, 18)).toFixedSpecial(7);
        console.log(error, result);
        $(".stakedbalance").text(result[0]);
      });
  
    var pagetoken = new web3.eth.Contract(erc20ABI, currentPageToken);
    pagetoken.methods
      .allowance(ethaddress, farmingAddress)
      .call(function (error, result) {
        if (result > 0) {
          $("body").addClass("approved");
        }
      });
  
    contract.methods
    .pendingEspresso(currentPagePoolID, ethaddress)
    .call(function (error, result) {
      currentPageReward = result;
      result = (result / Math.pow(10, 18)).toFixedSpecial(2);
      if (isNaN(result)) {
        result = 0;
      }
      $(".rewardbalance").animateNumbers(result);
    });
      
    //get wallet balance
  
    var contract = new web3.eth.Contract(erc20ABI, currentPageToken);
    contract.methods.balanceOf(ethaddress).call(function (error, result) {
      contract.methods.decimals().call(function (error, d) {
        currentPageWalletBalance = result;
        result = (result / Math.pow(10, d)).toFixedSpecial(7);
        if (isNaN(result)) {
          result = 0;
        }
        console.log(error, result);
        $(".walletbalance").text(result);
      });
    });
  }
  
  function vote(id) {
    var contract = new web3.eth.Contract(farmABI, farmingAddress);
    var amount = prompt("Insert how many Latte you want to use:");     
    contract.methods
      .votePool(
        (amount * Math.pow(10, 18)).toFixedSpecial(0),
        id
      )
      .send({ from: ethaddress }, function (err, transactionHash) {
        console.log("Error: ", err);
        console.log(transactionHash);
      });
  }

  function voteMinority(id) {
    var contract = new web3.eth.Contract(farmABI, farmingAddress);
    var amount = prompt("Insert how many Latte you want to use:");    
    contract.methods
      .voteMinority(
        (amount * Math.pow(10, 18)).toFixedSpecial(0),
        id
      )
      .send({ from: ethaddress }, function (err, transactionHash) {
        console.log("Error: ", err);
        console.log(transactionHash);
      });
  }

  function approveSpend() {
    var contract = new web3.eth.Contract(erc20ABI, currentPageToken);
    contract.methods
      .approve(
        farmingAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      )
      .send({ from: ethaddress }, function (err, transactionHash) {
        if (err) {
          alert("Error: " + err);
          return;
        }
        alert(
          "Please wait until the approve transaction confirm to stake your pool token. You can refresh the page to update"
        );
        $("body").addClass("approved");
        console.log(transactionHash);
      });
  }
  function addToPool() {
    var contract = new web3.eth.Contract(farmABI, farmingAddress);
    var amount = prompt(
      "Amount to stake",
      (currentPageWalletBalance - 1000000) / Math.pow(10, 18)
    );

    contract.methods
      .deposit(
        currentPagePoolID,
        (amount * Math.pow(10, 18) - 100).toFixedSpecial(0)
      )
      .send({ from: ethaddress }, function (err, transactionHash) {
        console.log("Error: ", err);
        console.log(transactionHash);
      });
  }
  function claimReward() {
    var contract = new web3.eth.Contract(farmABI, farmingAddress);
    contract.methods
    .deposit(currentPagePoolID, 0)
    .send({ from: ethaddress }, function (err, transactionHash) {
      //some code
      console.log(transactionHash);
    });
  }
  function removeFromPool() {
    var contract = new web3.eth.Contract(farmABI, farmingAddress);
    var amount = prompt("Amount to withdraw", currentPageStaked / 10 ** 18);
    contract.methods
      .withdraw(currentPagePoolID, (amount * Math.pow(10, 18)).toFixedSpecial(0))
      .send({ from: ethaddress }, function (err, transactionHash) {
        //some code
        console.log(transactionHash);
      });
  }
  function getExchangeRate() {    
    var contract = new web3.eth.Contract(farmABI, farmingAddress);
    contract.methods
      .getExchangeRateToken()
      .call(function (error, result) {            
        lattePrice = (result);
        console.log(error, result);
        $(".lattePrice").text(lattePrice + ' ESPR');
      });
  }
  function exchange() {    
    var contract = new web3.eth.Contract(farmABI, farmingAddress);
    var amount = prompt("Insert how many Latte you want:");    
    contract.methods.getExchangeRateToken().call(function (err, result1) {
      amount = amount * result1;      
      contract.methods
      .exchange((amount * Math.pow(10, 18)).toFixedSpecial(0))
      .send({ from: ethaddress }, function (err, transactionHash) {
        console.log(err);
        console.log(transactionHash);
      });
    });
  }
  function getUniswapPrice() {
    var ctx0 = new web3.eth.Contract(uniswapABI, pools[0][0]); // token-eth
    var ctx1 = new web3.eth.Contract(uniswapABI, uni1); // usdc-eth    
    try {
      ctx0.methods.getReserves().call(function (err, result1) {
        console.log(err, result1);
        ctx1.methods.getReserves().call(function (err, result2) {          
          var tokeneth = result1["_reserve1"] / result1["_reserve0"];
          prices["tokeneth"] = tokeneth;
  
          var ethusd =
            (result2["_reserve0"] / result2["_reserve1"]) * Math.pow(10, 18 - 6); // cause USDC uses 6 decimal
          prices["ethusd"] = ethusd;
  
          var tokenusd = tokeneth * ethusd;
          prices["tokenusd"] = tokenusd;
  
          getSupply();
          updatePrice(prices["tokenusd"]);
        });
      });
    } catch (e) {
      console.error(e);
    }
  }
  function getUniswapLattePrice() {
    var ctx0 = new web3.eth.Contract(uniswapABI, pools[0][0]); // token-eth
    var ctx1 = new web3.eth.Contract(uniswapABI, uni1); // usdc-eth
    var ctx2 = new web3.eth.Contract(farmABI, farmingAddress); // usdc-eth
    try {
      ctx0.methods.getReserves().call(function (err, result1) {
        console.log(err, result1);
        ctx1.methods.getReserves().call(function (err, result2) {          
          ctx2.methods.getExchangeRateToken().call(function(err, result3) {
            var tokeneth = result1["_reserve1"] / result1["_reserve0"];
            prices["tokeneth"] = tokeneth;
    
            var ethusd =
              (result2["_reserve0"] / result2["_reserve1"]) * Math.pow(10, 18 - 6); // cause USDC uses 6 decimal
            prices["ethusd"] = ethusd;
    
            var tokenusd = tokeneth * ethusd;
            prices["tokenusd"] = tokenusd;

            var lattetoken = result3;
            prices["lattetoken"] = lattetoken;

            var latteusd = lattetoken * tokenusd;
            prices["latteusd"] = latteusd;
                
            updateLattePrice(prices["latteusd"]);
          });
        });
      });
    } catch (e) {
      console.error(e);
    }
  }


  function loadedPool() {
    loadedpools++;
    if (loadedpools > 11) {
      var tvl = 0;
      for (var i = 0; i < pools.length; i++) {
        console.log(i, pools[i][5], pools[i][5] * prices["tokenusd"]);
        tvl = tvl + pools[i][5] * prices["tokenusd"];
      }
  
      var realtvl = 0;
      for (var i = 0; i < pools.length; i++) {
        if (i != 2 && i != 3) {
          console.log(i, pools[i][5], pools[i][5] * prices["tokenusd"]);
          realtvl = realtvl + pools[i][5] * prices["tokenusd"];
        }
      }
  
      $(".tvl span").animateNumbers(parseInt(tvl));
      console.warn("tvl:" + tvl);
    }
  }
  
  function updatePrice(p) {
    $(".tokenprice").text(p.toFixed(4) + ' USD');    
    updateYield();
  }
  
  function updateLattePrice(p) {
    $(".tokenlatteprice").text(p.toFixed(4) + ' USD');
    updateYield();
  }

  function getVoteTotal() {
    var ctx0 = new web3.eth.Contract(farmABI, farmingAddress); // usdc-eth
    ctx0.methods.getPoolVote(0).call(function(err, result) {
      $(".redPool").text(result + ' LTTE');
    });
    
    ctx0.methods.getPoolVote(1).call(function(err, result) {
      $(".greenPool").text(result + ' LTTE');
    });
    
    ctx0.methods.getPoolVote(2).call(function(err, result) {
      $(".bluePool").text(result + ' LTTE');
    });

    ctx0.methods.getPrevPoolVote(0).call(function(err, result) {
      $(".prevRedPool").text(result + ' LTTE');
    });
    
    ctx0.methods.getPrevPoolVote(1).call(function(err, result) {
      $(".prevGreenPool").text(result + ' LTTE');
    });
    
    ctx0.methods.getPrevPoolVote(2).call(function(err, result) {
      $(".prevBluePool").text(result + ' LTTE');
    });

    ctx0.methods.getStartVoteBlock().call(function(err, result) {
      $(".startvoteblock").text('#' + result);
    });
    
    ctx0.methods.getEndVoteBlock().call(function(err, result) {
      $(".endvoteblock").text('#' + result);
    });

    ctx0.methods.getPoolWinner().call(function(err, result) {      
      var x = document.getElementById("redWin");
      var y = document.getElementById("greenWin");
      var z = document.getElementById("blueWin");
      if (result == 0) {        
        x.style.display = "block";
        y.style.display = "none";
        z.style.display = "none";

        pools[0][3] = 18;
        pools[1][3] = 6;
        pools[2][3] = 6;

        pools[3][3] = 9;
        pools[4][3] = 3;
        pools[5][3] = 3;

        pools[6][3] = 6;
        pools[7][3] = 2;
        pools[8][3] = 2;

        pools[9][3] = 3;
        pools[10][3] = 1;
        pools[11][3] = 1;
      } else if (result == 1)
      {        
        x.style.display = "none";
        y.style.display = "block";
        z.style.display = "none";

        pools[0][3] = 6;
        pools[1][3] = 18;
        pools[2][3] = 6;

        pools[3][3] = 3;
        pools[4][3] = 9;
        pools[5][3] = 3;

        pools[6][3] = 2;
        pools[7][3] = 6;
        pools[8][3] = 2;

        pools[9][3] = 1;
        pools[10][3] = 3;
        pools[11][3] = 1;

      } else if (result == 2)
      {        
        x.style.display = "none";
        y.style.display = "none";
        z.style.display = "block";

        pools[0][3] = 6;
        pools[1][3] = 6;
        pools[2][3] = 18;

        pools[3][3] = 3;
        pools[4][3] = 3;
        pools[5][3] = 9;

        pools[6][3] = 2;
        pools[7][3] = 2;
        pools[8][3] = 6;

        pools[9][3] = 1;
        pools[10][3] = 1;
        pools[11][3] = 3;
      } else {           
        x.style.display = "none";
        y.style.display = "none";
        z.style.display = "none";  
        
        pools[0][3] = 6;
        pools[1][3] = 6;
        pools[2][3] = 6;

        pools[3][3] = 3;
        pools[4][3] = 3;
        pools[5][3] = 3;

        pools[6][3] = 2;
        pools[7][3] = 2;
        pools[8][3] = 2;

        pools[9][3] = 1;
        pools[10][3] = 1;
        pools[11][3] = 1;
      }

      $(".badge0").text(pools[0][3] + 'X');
      $(".badge1").text(pools[1][3] + 'X');
      $(".badge2").text(pools[2][3] + 'X');
      $(".badge3").text(pools[3][3] + 'X');
      $(".badge4").text(pools[4][3] + 'X');
      $(".badge5").text(pools[5][3] + 'X');
      $(".badge6").text(pools[6][3] + 'X');
      $(".badge7").text(pools[7][3] + 'X');
      $(".badge8").text(pools[8][3] + 'X');
      $(".badge9").text(pools[9][3] + 'X');
      $(".badge10").text(pools[10][3] + 'X');
      $(".badge11").text(pools[11][3] + 'X');


    });    

    
  }

  function getMinorityTotal() {
    var ctx0 = new web3.eth.Contract(farmABI, farmingAddress); // usdc-eth
    ctx0.methods.getMinorityTotalVote(0).call(function(err, result) {
      $(".arabicaPool").text(result + ' LTTE');
    });

    ctx0.methods.getMinorityPrevTotalVote(0).call(function(err, result) {
      $(".prevArabicaPool").text(result + ' LTTE');
    });
    
    ctx0.methods.getMinorityWinner().call(function(err, result) {      
      var x = document.getElementById("arabicaWin");
      var y = document.getElementById("robustaWin");
      var z = document.getElementById("libericaWin");
      if (result == 0) {        
        x.style.display = "block";
        y.style.display = "none";
        z.style.display = "none";
      } else if (result == 1)
      {        
        x.style.display = "none";
        y.style.display = "block";
        z.style.display = "none";
      } else if (result == 2)
      {        
        x.style.display = "none";
        y.style.display = "none";
        z.style.display = "block";
      } else {           
        x.style.display = "none";
        y.style.display = "none";
        z.style.display = "none";        
      }
    });    
    
    ctx0.methods.getMinorityTotalVote(1).call(function(err, result) {
      $(".robustaPool").text(result + ' LTTE');
    });

    ctx0.methods.getMinorityPrevTotalVote(1).call(function(err, result) {
      $(".prevRobustaPool").text(result + ' LTTE');
    });
    
    ctx0.methods.getMinorityTotalVote(2).call(function(err, result) {
      $(".libericaPool").text(result + ' LTTE');
    });    

    ctx0.methods.getMinorityPrevTotalVote(2).call(function(err, result) {
      $(".prevLibericaPool").text(result + ' LTTE');
    });
    
    ctx0.methods.getAmountMinorityRewardPool().call(function(err, result) {      
      $(".balanceJackpot").text(result / Math.pow(10,18) + ' ESPR');
    });
    
    ctx0.methods.getStartMinorityBlock().call(function(err, result) {            
      $(".startminorityblock").text('#' + result);
    });
    
    ctx0.methods.getEndMinorityBlock().call(function(err, result) {      
      $(".endminorityblock").text('#' + result);
    });    

    web3.eth.getBlockNumber(function(error, result){
      if(!error){
        $(".currentBlock").text('#' + result);
      }
      else
        $(".currentBlock").text('# -');
  });

  }

  function removeMinorityReward() {
    var contract = new web3.eth.Contract(farmABI, farmingAddress);    
  
    contract.methods
    .withdrawMinorityReward()
    .send({ from: ethaddress }, function (err, transactionHash) {
      //some code
      console.log(transactionHash);
    });      
  }

  function getlptoken(id) {
    if (typeof id === "undefined") {
      window.open(pools[currentPagePoolID][2]);
    } else {
      window.open(pools[id][2]);
    }
  }


  function init() {
    connectWeb3();
  }
  init();
  Number.prototype.toFixedSpecial = function (n) {
    var str = this.toFixed(n);
    if (str.indexOf("e+") === -1) return str;
  
    // if number is in scientific notation, pick (b)ase and (p)ower
    str = str
      .replace(".", "")
      .split("e+")
      .reduce(function (p, b) {
        return p + Array(b - p.length + 2).join(0);
      });
  
    if (n > 0) str += "." + Array(n + 1).join(0);
  
    return str;
  };
  getUniswapPrice();
  getExchangeRate();
  getVoteTotal();
  getMinorityTotal();
  
  setInterval(function () {
    initpooldata(currentPagePoolID);
    getUniswapPrice();
    getExchangeRate();
    getVoteTotal();
    getMinorityTotal();
    updateConnectStatus();
  }, 2000);
  
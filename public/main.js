// note: USDT, USDC decimal = 6
var web3 = new Web3(
    new Web3.providers.HttpProvider(
      // "https://ropsten.infura.io/v3/904542f7796d484b8288ca2053c9399f"
      "https://mainnet.infura.io/v3/904542f7796d484b8288ca2053c9399f"
    )
  );

  const BN = web3.utils.BN;
  
  var farmingAddress = "0x"; //farming address
  const tokenAddress = "0x"; // token
  const uni1 = "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"; // USDC

  var ethconnected = false;
  var ethaddress = "0x";
  var balance = 0;
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
  ];

  var prices = {
    tokenusd: -1,
    tokeneth: -1,
    ethusd: -1,
  };

//contract,name,url,weight,yield
var pools = [
  [
    "0x",
    "UNISWAP ESPR/ETH RED",
    "https://uniswap.info/pair/0x",
    6,
    0,
    0,
    "-"
  ],
  [
    "0x",
    "UNISWAP ESPR/ETH GREEN",
    "https://uniswap.info/pair/0x",
    6,
    0,
    0,
    "-"
  ],
  [
    "0x",
    "UNISWAP ESPR/ETH BLUE",
    "https://uniswap.info/pair/0x",
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
    var perblock = 11;
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
    alert("Coming Soon");
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
    $(".tokenprice").text(p.toFixed(4) + 'USD');    
    updateYield();
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
  
  setInterval(function () {
    initpooldata(currentPagePoolID);
  }, 15000);
  
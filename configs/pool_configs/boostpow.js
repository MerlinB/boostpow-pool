require("dotenv").config()

module.exports = {
  enabled: true, //Set this to false and a pool will not be created from this config file
  coin: "bitcoinsv.json", //Reference to coin config file in 'coins' directory

  address: process.env.NODE_ADDRESS, //Address to where block rewards are given

  /* Block rewards go to the configured pool wallet address to later be paid out to miners,
     except for a percentage that can go to, for examples, pool operator(s) as pool fees or
     or to donations address. Addresses or hashed public keys can be used. Here is an example
     of rewards going to the main pool op, a pool co-owner, and NOMP donation. */
  rewardRecipients: {},

  paymentProcessing: {
    enabled: true,

    /* Every this many seconds get submitted blocks from redis, use daemon RPC to check
         their confirmation status, if confirmed then get shares from redis that contributed
         to block and send out payments. */
    paymentInterval: 30,

    /* Minimum number of coins that a miner must earn before sending payment. Typically,
         a higher minimum means less transactions fees (you profit more) but miners see
         payments less frequently (they dislike). Opposite for a lower minimum payment. */
    minimumPayment: 0.01,

    /* This daemon is used to send out payments. It MUST be for the daemon that owns the
         configured 'address' that receives the block rewards, otherwise the daemon will not
         be able to confirm blocks or send out payments. */
    daemon: {
      host: process.env.NODE_RPC_HOST || "127.0.0.1",
      port: process.env.NODE_RPC_PORT || 19332,
      user: process.env.NODE_RPC_USER,
      password: process.env.NODE_RPC_PW
    }
  },

  /* Each pool can have as many ports for your miners to connect to as you wish. Each port can
     be configured to use its own pool difficulty and variable difficulty settings. varDiff is
     optional and will only be used for the ports you configure it for. */
  ports: {
    3032: {
      //A port for your miners to connect to
      diff: 32, //the pool difficulty for this port

      /* Variable difficulty is a feature that will automatically adjust difficulty for
             individual miners based on their hashrate in order to lower networking overhead */
      varDiff: {
        minDiff: 8, //Minimum difficulty
        maxDiff: 512, //Network difficulty will be used if it is lower than this
        targetTime: 15, //Try to get 1 share per this many seconds
        retargetTime: 90, //Check to see if we should retarget every this many seconds
        variancePercent: 30 //Allow time to very this % from target without retargeting
      }
    },
    3256: {
      //Another port for your miners to connect to, this port does not use varDiff
      diff: 256 //The pool difficulty
    }
  },

  /* More than one daemon instances can be setup in case one drops out-of-sync or dies. */
  daemons: [
    {
      host: process.env.NODE_RPC_HOST || "127.0.0.1",
      port: process.env.NODE_RPC_PORT || 19332,
      user: process.env.NODE_RPC_USER,
      password: process.env.NODE_RPC_PW
    }
  ],

  /* This allows the pool to connect to the daemon as a node peer to receive block updates.
     It may be the most efficient way to get block updates (faster than polling, less
     intensive than blocknotify script). It requires the additional field "peerMagic" in
     the coin config. */
  p2p: {
    enabled: false,

    /* Host for daemon */
    host: "127.0.0.1",

    /* Port configured for daemon (this is the actual peer port not RPC port) */
    port: 19333,

    /* If your coin daemon is new enough (i.e. not a shitcoin) then it will support a p2p
         feature that prevents the daemon from spamming our peer node with unnecessary
         transaction data. Assume its supported but if you have problems try disabling it. */
    disableTransactions: true
  },

  /* Enabled this mode and shares will be inserted into in a MySQL database. You may also want
     to use the "emitInvalidBlockHashes" option below if you require it. The config options
     "redis" and "paymentProcessing" will be ignored/unused if this is enabled. */
  mposMode: {
    enabled: false,
    host: "127.0.0.1", //MySQL db host
    port: 3306, //MySQL db port
    user: "me", //MySQL db user
    password: "mypass", //MySQL db password
    database: "ltc", //MySQL db database name

    /* Checks for valid password in database when miners connect. */
    checkPassword: true,

    /* Unregistered workers can automatically be registered (added to database) on stratum
         worker authentication if this is true. */
    autoCreateWorker: false
  }
}

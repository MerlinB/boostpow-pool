require("dotenv").config()

module.exports = {
  /* Specifies the level of log output verbosity. Anything more severe than the level specified
     will also be logged. */
  logLevel: "debug", //or "warning", "error"

  /* By default NOMP logs to console and gives pretty colors. If you direct that output to a
     log file then disable this feature to avoid nasty characters in your log file. */
  logColors: true,

  /* The NOMP CLI (command-line interface) will listen for commands on this port. For example,
     blocknotify messages are sent to NOMP through this. */
  cliPort: 17117,

  /* By default 'forks' is set to "auto" which will spawn one process/fork/worker for each CPU
     core in your system. Each of these workers will run a separate instance of your pool(s),
     and the kernel will load balance miners using these forks. Optionally, the 'forks' field
     can be a number for how many forks will be spawned. */
  clustering: {
    enabled: true,
    forks: "auto"
  },

  /* Pool config file will inherit these default values if they are not set. */
  defaultPoolConfigs: {
    /* Poll RPC daemons for new blocks every this many milliseconds. */
    blockRefreshInterval: 1000,

    /* If no new blocks are available for this many seconds update and rebroadcast job. */
    jobRebroadcastTimeout: 55,

    /* Disconnect workers that haven't submitted shares for this many seconds. */
    connectionTimeout: 600,

    /* (For MPOS mode) Store the block hashes for shares that aren't block candidates. */
    emitInvalidBlockHashes: false,

    /* This option will only authenticate miners using an address or mining key. */
    validateWorkerUsername: true,

    /* Enable for client IP addresses to be detected when using a load balancer with TCP
         proxy protocol enabled, such as HAProxy with 'send-proxy' param:
         http://haproxy.1wt.eu/download/1.5/doc/configuration.txt */
    tcpProxyProtocol: false,

    /* If under low-diff share attack we can ban their IP to reduce system/network load. If
         running behind HAProxy be sure to enable 'tcpProxyProtocol', otherwise you'll end up
         banning your own IP address (and therefore all workers). */
    banning: {
      enabled: true,
      time: 600, //How many seconds to ban worker for
      invalidPercent: 50, //What percent of invalid shares triggers ban
      checkThreshold: 500, //Perform check when this many shares have been submitted
      purgeInterval: 300 //Every this many seconds clear out the list of old bans
    },

    /* Used for storing share and block submission data and payment processing. */
    redis: {
      host: "redis",
      port: 6379
    }
  },

  /* This is the front-end. Its not finished. When it is finished, this comment will say so. */
  website: {
    enabled: true,
    /* If you are using a reverse-proxy like nginx to display the website then set this to
         127.0.0.1 to not expose the port. */
    host: "0.0.0.0",
    port: 80,
    /* Used for displaying stratum connection data on the Getting Started page. */
    stratumHost: "cryppit.com",
    stats: {
      /* Gather stats to broadcast to page viewers and store in redis for historical stats
             every this many seconds. */
      updateInterval: 15,
      /* How many seconds to hold onto historical stats. Currently set to 24 hours. */
      historicalRetention: 43200,
      /* How many seconds worth of shares should be gathered to generate hashrate. */
      hashrateWindow: 300
    },
    /* Not done yet. */
    adminCenter: {
      enabled: false,
      password: "password"
    }
  },

  /* Redis instance of where to store global portal data such as historical stats, proxy states,
     ect.. */
  redis: {
    host: "redis",
    port: 6379
  },

  /* With this switching configuration, you can setup ports that accept miners for work based on
     a specific algorithm instead of a specific coin. Miners that connect to these ports are
     automatically switched a coin determined by the server. The default coin is the first
     configured pool for each algorithm and coin switching can be triggered using the
     cli.js script in the scripts folder.

     Miners connecting to these switching ports must use their public key in the format of
     RIPEMD160(SHA256(public-key)). An address for each type of coin is derived from the miner's
     public key, and payments are sent to that address. */
  switching: {
    switch1: {
      enabled: false,
      algorithm: "sha256",
      ports: {
        3333: {
          diff: 10,
          varDiff: {
            minDiff: 16,
            maxDiff: 512,
            targetTime: 15,
            retargetTime: 90,
            variancePercent: 30
          }
        }
      }
    }
  },

  profitSwitch: {
    enabled: false,
    updateInterval: 600,
    depth: 0.9,
    usePoloniex: true,
    useCryptsy: true,
    useMintpal: true,
    useBittrex: true
  }
}

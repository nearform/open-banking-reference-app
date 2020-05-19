const blacklist = require('metro').createBlacklist

module.exports = {
  resolver: {
    blacklistRE: blacklist([/server\/dist\/.*/])
  }
}

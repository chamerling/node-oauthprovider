/**
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */
 
module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'OAuth Provider',
        port: 3000
      },
      db: 'mongodb://localhost/oauth_provider'
    }
  , test: {

    }
  , production: {

    }
}

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./keys.prod');
  } else {
    module.exports = {
      jwt: process.env.JWT_SECRET
  }
  }
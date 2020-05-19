const fs = require('fs')

if (!fs.existsSync('.env')) {
  fs.copyFileSync('.env.sample', '.env')
  console.log('Created `/.env` from `/.env.sample`')
}

if (!fs.existsSync('server/.env')) {
  fs.copyFileSync('server/.env.sample', 'server/.env')
  console.log('Created `/server/.env` from `/server/.env.sample`')
}

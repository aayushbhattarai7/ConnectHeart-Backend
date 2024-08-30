import crypto from 'crypto'

async function generateOTP() {
  return crypto.randomInt(10000, 99999)
}

console.log(generateOTP())

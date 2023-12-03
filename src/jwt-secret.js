const crypto = require('crypto');

function generateSecret(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

const jwtSecret = generateSecret(); // Generates a 32-byte hex string
console.log(jwtSecret);
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto');

const key = process.env.crypto_key;
const iv = process.env.crypto_iv;
const JWT_EXPIRATION_TIME = process.env.token_expire;

async function JwtVerify(token) {
    try {
        var decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) throw 'Invaild'
        return true
    } catch (err) {
        // err 
        return false
    }
}

async function JwtDecoded(token) {
    try {
        var decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) throw 'Invaild'
        return decoded
    } catch (err) {
        // err 
        return false
    }
}



async function JwtSign(isValidUserData) {
    try {
        var token = await jwt.sign(isValidUserData, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });
        if (!token) throw 'Invaild'
        return token
    } catch (err) {
        // err 
        return false
    }
}

// Data Encription 
// Data Type : string or integer
function CryptoEncrypt(data) {
    try {
        var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        cipher.update(data, 'binary', 'base64');
        return cipher.final('base64');
    } catch (err) {
        return ""
    }

}


// Data Decrypt 
// Data Type: string or integer
function CryptoDecrypt(data) {
    try {
        var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv),
            buffer = Buffer.concat([
                decipher.update(Buffer.from(data, 'base64')),
                decipher.final()
            ]);
        return buffer.toString();
    } catch (err) {
        return ""
    }
}

module.exports = {
    "JwtVerify": JwtVerify,
    "JwtSign": JwtSign,
    "JwtDecoded": JwtDecoded,
    "CryptoEncrypt": CryptoEncrypt,
    "CryptoDecrypt": CryptoDecrypt
};

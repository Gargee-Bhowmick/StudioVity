const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Generate a new JWT secret
const newJwtSecret = crypto.randomBytes(64).toString('hex');

// Load existing environment variables from .env file
const envFilePath = path.join(__dirname, '.env');
const envConfig = require('dotenv').parse(fs.readFileSync(envFilePath));

// Update the JWT secret in the environment config
envConfig.JWT_SECRET = newJwtSecret;

// Serialize the environment config back to .env format
const updatedEnvContents = Object.keys(envConfig)
  .map(key => `${key}=${envConfig[key]}`)
  .join('\n\n');

// Write the updated .env contents back to the file
fs.writeFileSync(envFilePath, updatedEnvContents);

console.log('JWT secret updated in .env file.');

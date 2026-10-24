// Usage: npm run hash-password -- "YourStrongPassword"
// Prints a value for ADMIN_PASSWORD_HASH in .env.local
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('Give a password of at least 10 characters:  npm run hash-password -- "YourStrongPassword"');
  process.exit(1);
}
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${hash}`);

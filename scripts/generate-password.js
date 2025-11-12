const bcrypt = require('bcryptjs');

// Change this to your desired password
const password = 'bestgr';

const hash = bcrypt.hashSync(password, 10);
console.log('\nYour hashed password:');
console.log(hash);
console.log('\nAdd this to your .env.local file as USER_PASSWORD_HASH');

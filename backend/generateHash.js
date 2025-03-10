import bcrypt from 'bcryptjs';

const password = 'testi123'; // Replace with the password you want to hash

// Generate a hash with the same salt rounds your app uses
bcrypt.hash(password, 10).then((hash) => {
  console.log('Use this hash in your SQL:');
  console.log(hash);
});

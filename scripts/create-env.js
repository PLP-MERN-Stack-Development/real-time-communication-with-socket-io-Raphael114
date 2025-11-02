const fs = require('fs');
const path = require('path');

const examples = [
  { src: path.join(__dirname, '..', 'server', '.env.example'), dest: path.join(__dirname, '..', 'server', '.env') },
  { src: path.join(__dirname, '..', 'client', '.env.example'), dest: path.join(__dirname, '..', 'client', '.env') },
];

examples.forEach(({ src, dest }) => {
  try {
    if (!fs.existsSync(src)) {
      console.warn(`Example file not found: ${src}`);
      return;
    }

    if (fs.existsSync(dest)) {
      console.log(`Skipping existing file: ${dest}`);
      return;
    }

    fs.copyFileSync(src, dest);
    console.log(`Created ${dest} from ${path.basename(src)}`);
  } catch (err) {
    console.error(`Failed to create ${dest}:`, err.message);
  }
});

console.log('Env setup complete. Edit the newly created .env files as needed.');

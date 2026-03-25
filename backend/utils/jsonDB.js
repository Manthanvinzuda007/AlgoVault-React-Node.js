const fs = require('fs');
const path = require('path');

const dataPath = (file) => path.join(__dirname, '../data', file);

module.exports = {
  read: (file) => {
    try {
      const raw = fs.readFileSync(dataPath(file), 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      return [];
    }
  },
  write: (file, data) => {
    fs.writeFileSync(dataPath(file), JSON.stringify(data, null, 2));
  }
};

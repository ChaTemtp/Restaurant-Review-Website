const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

/**
 * อ่านไฟล์ JSON
 * @param {string} filename - ชื่อไฟล์
 * @returns {Promise<Array>} - ข้อมูลจากไฟล์
 */
const readJsonFile = async (filename) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

/**
 * เขียนไฟล์ JSON
 * @param {string} filename - ชื่อไฟล์
 * @param {Array|Object} data - ข้อมูลที่จะเขียน
 * @returns {Promise<boolean>} - สำเร็จหรือไม่
 */
const writeJsonFile = async (filename, data) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

module.exports = {
  readJsonFile,
  writeJsonFile
};
const pool = require('../config/database');

const BlockchainRecord = {
  async create(blockchainData) {
    const { orderId, blockHash, previousHash, farmerInfo, consumerInfo, transportInfo } = blockchainData;
    
    const [result] = await pool.query(
      `INSERT INTO blockchain_records (orderId, blockHash, previousHash, farmerInfo, consumerInfo, transportInfo, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [orderId, blockHash, previousHash, farmerInfo, consumerInfo, transportInfo]
    );
    
    return result.insertId;
  },

  async findByOrderId(orderId) {
    const [rows] = await pool.query(
      'SELECT * FROM blockchain_records WHERE orderId = ?',
      [orderId]
    );
    return rows;
  },

  async updateTransportInfo(recordId, transportInfo) {
    await pool.query(
      'UPDATE blockchain_records SET transportInfo = ?, updatedAt = NOW() WHERE id = ?',
      [transportInfo, recordId]
    );
  },

  async getFullChain() {
    const [rows] = await pool.query(
      'SELECT * FROM blockchain_records ORDER BY createdAt ASC'
    );
    return rows;
  }
};

module.exports = BlockchainRecord;

const crypto = require('crypto');

class Block {
  constructor(orderId, farmerInfo, consumerInfo, transportInfo, previousHash = '') {
    this.orderId = orderId;
    this.farmerInfo = farmerInfo;
    this.consumerInfo = consumerInfo;
    this.transportInfo = transportInfo;
    this.timestamp = new Date().toISOString();
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const data = JSON.stringify({
      orderId: this.orderId,
      farmerInfo: this.farmerInfo,
      consumerInfo: this.consumerInfo,
      transportInfo: this.transportInfo,
      timestamp: this.timestamp,
      previousHash: this.previousHash
    });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  updateTransportInfo(newTransportInfo) {
    this.transportInfo = newTransportInfo;
    this.hash = this.calculateHash();
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesisBlock = new Block('GENESIS', {}, {}, {}, '0');
    this.chain.push(genesisBlock);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(orderId, farmerInfo, consumerInfo, transportInfo) {
    const latestBlock = this.getLatestBlock();
    const newBlock = new Block(
      orderId,
      farmerInfo,
      consumerInfo,
      transportInfo,
      latestBlock.hash
    );
    this.chain.push(newBlock);
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getBlockByOrderId(orderId) {
    return this.chain.find(block => block.orderId === orderId);
  }

  getChainData() {
    return this.chain.map(block => ({
      orderId: block.orderId,
      farmerInfo: block.farmerInfo,
      consumerInfo: block.consumerInfo,
      transportInfo: block.transportInfo,
      timestamp: block.timestamp,
      hash: block.hash,
      previousHash: block.previousHash
    }));
  }
}

module.exports = { Blockchain, Block };

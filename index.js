
const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash).toString()
    }
}


class Blockchain {
    constructor() {
        // the first block on the chain is called Genesis block
        // and is added manually
        this.chain = [this.createGenesisBlock()]
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length -1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.hash = newBlock.calculateHash()
        this.chain.push(newBlock)
    }

    isChainValid() {

        for (let i = 1; i < this.chain.length; i++) {
            let currentBlock = this.chain[i]
            let previousBlock = this.chain[i - 1]

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false
            }

            if (previousBlock.index + 1 !== currentBlock.index) {
                return false
            }
        }

        return true
    }

}


// test it
let myBlockChain = new Blockchain()
myBlockChain.addBlock(new Block(1, Date.now(), {message: "I am first"} ))
myBlockChain.addBlock(new Block(2, Date.now(), {message: "I am second"} ))

console.log('myChain is valid?', myBlockChain.isChainValid()) // should be true

// tamper with chain
myBlockChain.chain[1].data = {message: "I am really first"}
myBlockChain.chain[1].hash = myBlockChain.chain[1].calculateHash()

console.log('myChain is valid?', myBlockChain.isChainValid()) // should be false








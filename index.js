
const abi = require('./eth/abi-owner.json')

var Web3 = require('web3');
var provider = `https://mainnet.infura.io/v3/${process.env.PROVIDER_KEY}`;
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);
const PORT = 3000;
const axios = require('axios');
const fs = require('fs')

require('dotenv').config();

const Server = require('./Model/Server')

const express = require('express')
const app = express();
const cors = require('cors')

const { Client } = require('pg');

var cron = require('node-cron');

cron.schedule('* * * * *', () => {
    getNftCollectionList('waterworld-artofland')
});

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 5432,
    database: process.env.DB_NAME,
}

app.use(cors())

app.get(`/nft-owner/:contractAdress/:owner/:tokenId`, (req, res) => {
    let { contractAdress, owner, tokenId } = req.params;
    whoOwnThisTokenWeb3(contractAdress, owner, tokenId).then(result => {
        res.send(result);
    })
})

const getUsers = async () => {
    const client = new Client(config)
    await client.connect()
    const res = await client.query('SELECT * FROM auth')
    await client.end()
    return res.rows
}

const getNftCollectionList = async (collection) => {
    let datas = [];
    let cursor = true;
    while (cursor) {
        let result = await axios.get(`https://api.opensea.io/api/v1/assets?collection=${collection}${cursor != true ? `&cursor=${cursor}` : ''}`, { headers: { "X-API-KEY": " " } })
        result.data.assets.map(map => datas.push(map));
        cursor = result.data.next
    }
    setLandsOwner(datas);
}

const setLandsOwner = async (data) => {
    await Server.scp(true);
    let wtwareas = await fs.readFileSync('./waterworld/wtw.json')
    wtwareas = JSON.parse(wtwareas);
    let users = await getUsers();
    for (const nft of data) {
        let id = nft.traits[2].value.split('WTW-')[1];
        let token_id = nft.token_id;
        let contract_id = nft.asset_contract.address;
        let owner = nft.owner.address;

        wtwareas.map(area => {
            if (area.name == id) {
                area.owner = users.find(map => map.public_key == owner).name;
            }
        });

    }
    await fs.writeFileSync('./waterworld/areas.dat', JSON.stringify(wtwareas));
    Server.scp();
}

getNftCollectionList('waterworld-artofland')

app.listen(PORT, ()=>{
    console.log(`listen on http://localhost:${PORT}`)
})

// Exemple
// whoOwnThisTokenWeb3("0x495f947276749ce646f68ac8c248420045cb7b5e","0x5a5aeA489Cb0130524B4e37eF80DBC97636D819F", "40868789574586488834959443052281218598274334533160055729397296605272960139265");
const whoOwnThisTokenWeb3 = async (contractAdress, owner, tokenId) => {
    return new Promise((resolve, reject) => {
        const collection = new web3.eth.Contract(abi, contractAdress);
        collection.methods.balanceOf(owner, tokenId).call().then(res => {
            resolve(res);
        });
    })
}

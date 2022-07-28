const sdk = require('api')('@opensea/v1.0#mxj1ql5k6c0il');
const axios = require('axios');

const opensea = require('./waterworld/opensea.json')

const wtwnfts = require('./waterworld/nfts.json')

const abi = require('./eth/abi-owner.json')

var Web3 = require('web3');
var provider = `https://mainnet.infura.io/v3/${process.env.PROVIDER_KEY}`;
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);

require('dotenv').config()

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

/**
 * Who Own token with open sea sdk
 */
const whoOwnThisTokenOpenSeaSdk = async () => {    
    const sdk = require('api')('@opensea/v1.0#mxj1ql5k6c0il');

    sdk['retrieving-a-single-asset']({
      include_orders: 'false',
      asset_contract_address: '0x495f947276749ce646f68ac8c248420045cb7b5e',
      token_id: '40868789574586488834959443052281218598274334533160055729397296470033029922817'
    })
      .then(res => console.log(res))
      .catch(err => console.error(err));
}

// Who Own the token Open Sea Example
const whoOwnThisTokenOpenSea = async () => {    
    let data = opensea
    let owner = data.owner.address
    console.log(owner);
}

/**
 * curl -X 'GET' \
  'https://deep-index.moralis.io/api/v2/nft/0x684e4ed51d350b4d76a3a07864df572d24e6dc4c/3908/owners?chain=eth&format=decimal' \
  -H 'accept: application/json' \
  -H 'X-API-Key: 'xxx'
 */
const whoOwnThisTokenMoralis = async (contract_address, token_id) => {    
   return new Promise((resolve,reject)=>{
       axios.get(`https://deep-index.moralis.io/api/v2/nft/${contract_address}/${token_id}/owners?chain=eth&format=decimal`, {headers:{"X-API-Key":MORALIS_API_KEY}}).then(res=>{
           let data = res.data;
           console.log(data);
           if(data.result.length)
           {
               let owner = data.result[0].owner_of
               console.log(owner);
               resolve(owner);
            }else{
                let err = `${token_id.slice(0,16)}... for contract ${contract_address.slice(0,16)}...  has no owner` 
                reject();
            }
        }).catch(err=>{
           reject(err.message);
       })
   })
}

// Working Moralis exemple 
// whoOwnThisTokenMoralis("0x684e4ed51d350b4d76a3a07864df572d24e6dc4c", "3908");

// Moralis OpenSea Centralized  (not work ?)
// whoOwnThisTokenMoralis("0x495f947276749ce646f68ac8c248420045cb7b5e", "40868789574586488834959443052281218598274334533160055729397296468933518295041");

// Check bulk import return json from OpenSea
console.log(wtwnfts["nft"].length);

/**
 * Bulk Update Land With Moralis (429 issue from Rate Limit)
 */
const bulkUpdateLandWithMoralis = async ()=>{
    for (const nft of wtwnfts["nft"])
    {
        let data = nft.nft_url.split('/');
        let contract_address = data[5];
        let token_id = data[6];
        console.log('contract address', contract_address)
        console.log('token_id', token_id)
        try{
            await whoOwnThisTokenMoralis(contract_address, token_id);
        }catch(err)
        {
            console.log(err);
        }
    }
}

/**
 * 
 * @param {string} owner 
 * @param {string} tokenId 
 * Check owner for NFT
 */
const whoOwnThisTokenWeb3 = async (owner, tokenId)=>{
    const collection = new web3.eth.Contract(abi, "0x495f947276749ce646f68ac8c248420045cb7b5e");
    const balance = await collection.methods.balanceOf(owner,tokenId).call();
    console.log(balance);
}

whoOwnThisTokenWeb3("0x5a5aeA489Cb0130524B4e37eF80DBC97636D819F", "40868789574586488834959443052281218598274334533160055729397296605272960139265");
const sdk = require('api')('@opensea/v1.0#mxj1ql5k6c0il');
const axios = require('axios');
const opensea = require('./opensea.json')

const wtwnfts = require('./waterworld/nfts.json')

require('dotenv').config()

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
    axios.get(`https://deep-index.moralis.io/api/v2/nft/${contract_address}/${token_id}/owners?chain=eth&format=decimal`, {headers:{"X-API-Key":process.env.MORALIS_API_KEY}}).then(res=>{
        let data = res.data;
        console.log(data);
        if(data.result.length)
        {
            let owner = data.result[0].owner_of
            console.log(owner);
        }
    })
}

// Working Moralis exemple 
// whoOwnThisTokenMoralis("0x684e4ed51d350b4d76a3a07864df572d24e6dc4c", "3908");

// Moralis OpenSea Centralized  (not work ?)
// whoOwnThisTokenMoralis("0x495f947276749ce646f68ac8c248420045cb7b5e", "40868789574586488834959443052281218598274334533160055729397296468933518295041");

// Check bulk import return json from OpenSea
console.log(wtwnfts["nft"].length);
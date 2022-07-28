# Landchecker for Artof.Land

This project is under construction

it's testing for check and assign good land for minetest areas mods file based on NFT owner check (contact/token_id) for a public key.

## Install
`npm i`
`node index.js`

`http://localhost:3000`

## Landchecker

Get owner
`/nft-owner/:contractAdress/:owner/:tokenId`

## Node cron
Every minute Cron do a owner check with OpenSea API and update the production
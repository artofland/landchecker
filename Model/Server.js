const { Client } = require('node-scp')


const api = module.exports = {
    scp: () => {
        Client({
            host: process.env.SERVER_HOST,
            port: 22,
            username: process.env.SERVER_USER,
            password: process.env.SERVER_PASS,
        }).then(client => {
            client.uploadFile(
                './waterworld/areas.dat',
                '/home/debian/containers/server/data/worlds/world/areas.dat'
            )
                .then(response => {
                    console.log(response);
                    client.close() // remember to close connection after you finish
                })
                .catch(error => { console.log(error) })
        }).catch(e => console.log(e))
    }
}
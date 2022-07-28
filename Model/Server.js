const { Client } = require('node-scp')


const api = module.exports = {
    scp: async (reverse = false) => {
        return new Promise((resolve, reject) => {
            Client({
                host: process.env.SERVER_HOST,
                port: 22,
                username: process.env.SERVER_USER,
                password: process.env.SERVER_PASS,
            }).then(client => {
                if (reverse) {
                    client.downloadFile(
                        '/home/debian/containers/server/data/worlds/world/areas.dat',
                        './waterworld/wtw.json'
                    )
                        .then(response => {
                            console.log(response);
                            client.close() // remember to close connection after you finish
                            resolve()
                        })
                        .catch(error => { console.log(error) })
                } else {
                    client.uploadFile(
                        './waterworld/areas.dat',
                        '/home/debian/containers/server/data/worlds/world/areas.dat'
                    )
                        .then(response => {
                            console.log(response);
                            client.close() // remember to close connection after you finish
                            resolve()
                        })
                        .catch(error => { reject(error); console.log(error) })
                }
            }).catch(e => reject(e))
        })
    }
}
process.env.DEBUG = 'bedrock-portal*'

const { Server } = require('bedrock-portal-nethernet')
const { Authflow, Titles } = require('prismarine-auth')

const start_game = require('./start_game')

const auth = new Authflow('example', './', { authTitle: Titles.XboxAppIOS, deviceType: 'iOS', flow: 'sisu' })

const server = new Server()

server.listen(auth, 12445353312598012116n)

server.on('connect', client => {

  client.on('join', () => { // The client has joined the server.

    console.log(`Client ${client.connection.connectionId} has joined the server.`)

    client.write('start_game', start_game)

    client.once('set_player_game_type', () => {
      client.write('transfer', { server_address: 'bedrock.opblocks.com', port: 19132 })
    })

  })
})

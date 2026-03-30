process.env.DEBUG = 'bedrock-portal*'

const { Server } = require('bedrock-portal-nethernet')
const { Authflow, Titles } = require('prismarine-auth')

const start_game = require('./start_game')

const auth = new Authflow('example', './', { authTitle: Titles.XboxAppIOS, deviceType: 'iOS', flow: 'sisu' })

const server = new Server()

server.listen(auth, 6788366549692986925n)

server.on('connect', client => {

  client.on('join', () => { // The client has joined the server.

    console.log(`Client ${client.connection.connectionId} has joined the server.`)

    client.write('resource_packs_info', {
      must_accept: false,
      has_addons: false,
      has_scripts: false,
      disable_vibrant_visuals: false,
      world_template: {
        uuid: '',
        version: '',
      },
      texture_packs: [],
    })

    client.write('resource_pack_stack', {
      must_accept: false,
      resource_packs: [],
      game_version: '*',
      experiments: [],
      experiments_previously_used: false,
      has_editor_packs: false,
    })

    client.once('resource_pack_client_response', async () => {
      client.write('start_game', start_game)
      client.write('transfer', { server_address: '', port: 19132 })
    })

  })
})

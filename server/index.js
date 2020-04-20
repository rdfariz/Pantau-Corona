const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const axios = require('axios')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 8080
  } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  async function getData(url, callback) {
    const data = await axios.get(`${url}`)
    return callback(data)
  }
  app.get('/api/historical/indonesia',  async (req, res, next) => {
    const url = 'https://corona.lmao.ninja/v2/historical/indonesia'
    getData(url, (response)=>{ res.json(response.data) })
  })
  app.get('/api/indonesia',  async (req, res, next) => {
    const url = 'https://api.kawalcorona.com/indonesia/'
    getData(url, (response)=>{ res.json(response.data) })
  })
  app.get('/api/indonesia/provinsi',  async (req, res, next) => {
    const url = 'https://api.kawalcorona.com/indonesia/provinsi'
    getData(url, (response)=>{ res.json(response.data) })
  })

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()

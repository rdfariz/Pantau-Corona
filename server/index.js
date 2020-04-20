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

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.get('/api/historical/indonesia', (req, res, next) => {
    try {
      const url = 'https://corona.lmao.ninja/v2/historical/indonesia'
      axios.get(url).then((response)=>{
        res.json(response.data)
      }).catch(()=>{
        res.json(null)
      })
    }catch(err){
      res.json(null)
    }
  })
  app.get('/api/indonesia', (req, res, next) => {
    try {
      const url = 'https://api.kawalcorona.com/indonesia/'
      axios.get(url).then((response)=>{
        res.json(response.data)
      }).catch(()=>{
        res.json(null)
      })
    }catch(err){
      res.json(null)
    }
  })
  app.get('/api/indonesia/provinsi', (req, res, next) => {
    try {
      const url = 'https://api.kawalcorona.com/indonesia/provinsi'
      axios.get(url).then((response)=>{
        res.json(response.data)
      }).catch(()=>{
        res.json(null)
      })
    }catch(err) {
      res.json(null)
    }
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

import express from 'express'

// eslint-disable-next-line no-unused-vars
export default (app, http) => {
  app.use(express.json())
  app.get('/foo', (req, res) => {
    res.json({ msg: 'foo' })
  })
}

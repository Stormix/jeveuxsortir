import express from 'express'
const pdfFillForm = require('pdf-fill-form')
const fs = require('fs')
const HummusRecipe = require('hummus-recipe')
const tmp = require('tmp')
import socketIO from 'socket.io'

// eslint-disable-next-line no-unused-vars
export default (app, http) => {
  app.use(express.urlencoded({ limit: '200mb', extended: true }))
  app.use(express.json({ limit: '200mb' }))
  let io = socketIO(http)
  io.on('connection', client => {
    client.on('generate', data => {
      const { name, birthday, address, city, reason, signature } = data
      const templatePath = './srv/bin/template.pdf'
      const currentDate = new Date()
      const dt = new Date(birthday)
      const month = ('0' + (currentDate.getMonth() + 1)).slice(-2)
      const day = ('0' + currentDate.getDate()).slice(-2)
      const filledFields = {
        'Champ de texte 2.Page 1': `${dt.getDate()}-${dt.getMonth() +
          1}-${dt.getFullYear()}`,
        'Champ de texte 1.Page 1': name + '\r\n',
        'Champ de texte 3.Page 1': address
        // 'Champ de texte 4.Page 1': city
        // 'Champ de texte 5.Page 1': day + '\r\n',
        // 'Champ de texte 7.Page 1': month + '\r\n'
      }
      const signedPDF = tmp.fileSync()
      const signatureFile = tmp.fileSync()
      const unsignedPDF = tmp.fileSync()

      filledFields[`Case à cocher ${parseInt(reason) + 1}.Page 1`] = true

      // Fill PDF form
      const pdf = pdfFillForm.writeSync(templatePath, filledFields, {
        save: 'pdf'
      })
      fs.writeFileSync(unsignedPDF.name, pdf)

      // Save image
      const base64Data = signature.replace(/^data:image\/png;base64,/, '')
      fs.writeFileSync(signatureFile.name, base64Data, 'base64', err => {
        console.error(err)
      })

      // Sign the PDF
      const pdfDoc = new HummusRecipe(unsignedPDF.name, signedPDF.name)
      const width = pdfDoc.metadata['1'].width
      const height = pdfDoc.metadata['1'].height
      pdfDoc
        .editPage(1)
        .text(city, width - 220, height - 150, { color: '#000000', bold: true })
        .text(day, width - 120, height - 150, { color: '#000000' })
        .text(month, width - 95, height - 150, { color: '#000000' })
        .image(signatureFile.name, width - 150, height - 100, {
          height: 45,
          keepAspectRatio: true
        })
        .endPage()
        .endPDF()
      signatureFile.removeCallback()
      unsignedPDF.removeCallback()
      client.emit('preview', Buffer.from(signedPDF.name).toString('base64'))
    })
  })
  app.get('/preview/:file', (req, res) => {
    const filePath = Buffer.from(req.params.file, 'base64').toString('ascii')
    if (filePath) {
      const readStream = fs.createReadStream(filePath)
      const filename = encodeURIComponent('Attestation.pdf')

      readStream.on('open', function() {
        res.setHeader(
          'Content-disposition',
          'inline; filename="' + filename + '"'
        )
        res.setHeader('Content-type', 'application/pdf')
        readStream.pipe(res)
      })

      readStream.on('error', function(err) {
        res.end(err)
      })
    } else {
      res.error('RIP')
    }
  })
}

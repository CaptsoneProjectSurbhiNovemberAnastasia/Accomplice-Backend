const express = require('express')
const app = express()
const AWS = require('aws-sdk')
const fs = require('fs')
const fileType = require('file-type')
const bluebird = require('bluebird')
const multiparty = require('multiparty')
const router = require('express').Router()
module.exports = router

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: 'AKIAIQMM7Q2JSKX55ZBA',
  secretAccessKey: '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'
})

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird)

// create S3 instance
const s3 = new AWS.S3()

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: 'accomplice1',
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  }
  return s3.upload(params).promise()
}

// Define POST route
router.post('/s3-upload', (request, response) => {
  console.log('Backkend called*******')
  const form = new multiparty.Form()
  form.parse(request, async (error, fields, files) => {
    if (error) throw new Error(error)
    try {
      const path = files.file[0].path
      console.log('path is', path)
      const buffer = fs.readFileSync(path)
      const type = fileType(buffer)
      const timestamp = Date.now().toString()
      const fileName = `bucketFolder/${timestamp}-lg`
      const data = await uploadFile(buffer, fileName, type)
      console.log('date is ' + data.Location)
      return response.status(200).send(data)
    } catch (error) {
      return response.status(400).send(error)
    }
  })
})

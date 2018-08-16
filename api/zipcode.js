const router = require('express').Router()
const axios = require('axios')
const { GOOGLE_GEO_API_KEY } = '../secrets'

module.exports = router

router.get('/', (req, res, next) => {
  console.log('Inside zipcode')
  console.log('Google Key', process.env.GOOGLE_GEO_API_KEY)
  /*
  route format:
    `.../api/zipcode/?lat=${lat}&lng=${lng}`
  */
  const lat = req.query['lat']
  const lng = req.query['lng']
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_GEO_API_KEY}`
    )
    .then(address => {
      let last = address.data.results[0].address_components.length - 1

      let zipcode = address.data.results[0].address_components[last].long_name

      res.json(zipcode)
    })
    .catch(next)
})

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')


const app = express()

app.use(express.static('dist'))

app.use(express.json())
morgan.token('content', function (req) { return JSON.stringify(req.body) })

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.content(req, res)
  ].join(' ')
}))

const Listing = require('./models/listing')

app.get('/api/persons', (request, response) => {
  Listing.find({}).then(listing => {
    response.json(listing)
  })
})

app.get('/info', (request, response) => {
  Listing.find({}).then(listing => {
    const date = (new Date())
    const str = `<div>Phonebook has info ${listing.length} for people</div>
                 <div>${date.toString()}</div>`
    console.log(str)
    response.send(str)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Listing.findById(id).then(listing => {
    response.json(listing)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Listing.findByIdAndDelete(request.params.id)
    .then(() => {
      return response.status(202).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const listing = new Listing({
    name: body.name,
    number: body.number,
  })

  listing.save()
    .then(savedlisting => {
      response.json(savedlisting)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  Listing.findById(request.params.id)
    .then(listing => {
      if (!listing) {
        return response.status(404).end()
      }
      listing.name = name
      listing.number = number

      listing.save()
        .then(result => {
          response.json(result)
        })
        .catch(error => next(error))
    })
})

const errorHandling = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandling)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server ruunig on port ${PORT}`)
})
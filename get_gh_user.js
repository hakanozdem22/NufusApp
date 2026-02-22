const https = require('https')

const token = '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'
const options = {
  hostname: 'api.github.com',
  path: '/user',
  method: 'GET',
  headers: {
    Authorization: `token ${token}`,
    'User-Agent': 'Node.js Script'
  }
}

const req = https.request(options, (res) => {
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  })
  res.on('end', () => {
    console.log(data)
  })
})

req.on('error', (error) => {
  console.error(error)
})

req.end()

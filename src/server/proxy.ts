import axios from 'axios'
import cors from 'cors'
import express from 'express'

const app = express()
app.use(cors())

app.get('/api/pronunciation', async (req, res) => {
  try {
    const { word, type, le } = req.query
    const response = await axios.get(`https://dict.youdao.com/dictvoice`, {
      params: {
        audio: word,
        type,
        le,
      },
      responseType: 'arraybuffer',
    })

    res.setHeader('Content-Type', 'audio/mpeg')
    res.send(response.data)
  } catch (error) {
    console.error('Pronunciation proxy error:', error)
    res.status(500).send('Error fetching pronunciation')
  }
})

const PORT = process.env.PROXY_PORT || 3003
app.listen(PORT, () => {
  console.log(`Pronunciation proxy server running on port ${PORT}`)
})

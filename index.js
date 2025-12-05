import express from "express"
import axios from "axios"
import bodyParser from "body-parser"

const app = express()
const port = 3000
const config = {headers: {'Content-type': 'application/json'}}

const API_cat_URL = "https://cataas.com/cat"
const API_advice_URL = "https://api.adviceslip.com/advice"
const API_dog_URL = "https://random.dog/woof.json"

let isCat = true

app.use(express.static('public'))

app.get("/", async (req, res) => {
  isCat = true
  try {
    const catResponse = await axios.get(API_cat_URL, config)
    const adviceResponse = await axios.get(API_advice_URL)
    const catData = {
      isCat: isCat,
      image: catResponse.data.url,
      advice: adviceResponse.data.slip.advice
    }
    res.render("index.ejs", {data: catData})
  } catch (error) {
    // TO DO
    // res.render
  }  
})

app.get("/dog", async (req, res) => {
  isCat = false
  try {
    const dogResponse = await axios(API_dog_URL)
    const adviceResponse = await axios.get(API_advice_URL)
    const isMP4 = dogResponse.data.url.endsWith(".mp4")
    const dogData = {
      isCat: isCat,
      isMP4: isMP4,
      image: dogResponse.data.url,
      advice: adviceResponse.data.slip.advice
    }
    res.render("index.ejs", {data: dogData})
  } catch (error) {
    // TO DO
  }
})

app.listen(port, () => console.log(`http://localhost:${port}`))

app.use((req,res,next) => {
  res.status(404).redirect('/')
  next()
})

// APIs used to build this website
// https://api.adviceslip.com/#endpoint-random
// https://cataas.com/doc.html
// https://random.dog/woof.json
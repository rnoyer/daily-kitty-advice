import express from "express"
import axios from "axios"
import bodyParser from "body-parser"
import currentAdvice from "./public/data/currentAdvice.js"

const app = express()
const port = 3000
const config = {headers: {'Content-type': 'application/json'}}

const API_cat_URL = "https://cataas.com/cat"
const API_advice_URL = "https://api.adviceslip.com/advice"
const API_dog_URL = "https://random.dog"

app.use(express.static('public'))

app.get("/", async (req, res) => {
  try {
    const catResponse = await axios.get(API_cat_URL, config)
    const adviceResponse = await axios.get(API_advice_URL)

    currentAdvice.isCat = true
    currentAdvice.isMP4 = false
    currentAdvice.imageId = catResponse.data.id
    currentAdvice.adviceData = adviceResponse.data
    currentAdvice.imageURL = `${API_cat_URL}/${currentAdvice.imageId}`

    res.render("index.ejs", {data: currentAdvice})
  } catch (error) {
    console.error("Cat route error:", error.message)
    res.status(500).redirect('/')
  }  
})

app.get("/dog", async (req, res) => {
  try {
    const dogResponse = await axios(`${API_dog_URL}/woof`)
    const adviceResponse = await axios.get(API_advice_URL)

    currentAdvice.isCat = false
    currentAdvice.isMP4 = dogResponse.data.endsWith(".mp4"),
    currentAdvice.imageId = dogResponse.data
    currentAdvice.adviceData = adviceResponse.data
    currentAdvice.imageURL = `${API_dog_URL}/${currentAdvice.imageId}`

    res.render("index.ejs", {data: currentAdvice})
  } catch (error) {
    console.error("Dog route error:", error.message)
    res.status(500).redirect('/')
  }
})

app.get("/share/:isCat/:isMP4/:imageId/:slipId", async (req, res) => {
  try {
    const data = req.params
    const adviceResponse = await axios.get(`${API_advice_URL}/${data.slipId}`)
    const API_pet_URL = data.isCat === "true" ? API_cat_URL : API_dog_URL

    currentAdvice.isCat = data.isCat === "true"
    currentAdvice.isMP4 = data.isMP4 === "true"
    currentAdvice.imageId = data.imageId
    currentAdvice.adviceData = await adviceResponse.data
    currentAdvice.imageURL = `${API_pet_URL}/${data.imageId}`

    res.render("index.ejs", {data: currentAdvice})
  } catch (error) {
    console.error("Share route error:", error.message)
    res.status(500).redirect('/')
  }
})

app.listen(port, () => console.log(`Watch your masterpiece at http://localhost:${port}`))

app.use((req,res,next) => {
  res.status(404).send('Not found')
})

// APIs used to build this website
// https://api.adviceslip.com/#endpoint-random
// https://cataas.com/doc.html
// https://random.dog/woof.json

// Testing share URL
// http://localhost:3000/share/false/true/4eee5dd0-189c-45b0-83a5-c63d31c11242.mp4/51
// http://localhost:3000/share/true/false/kaTXkpZdPLxgEEFG/181

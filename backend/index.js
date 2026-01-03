import express from 'express'
import dotenv from 'dotenv';
import connectToDB from './db/db.js';
import contactRouter from "./routes/contacts.js"

import cors from 'cors'
dotenv.config();

const app = express()

app.use(express.json())

const corsOptions = {
  origin: process.env.FRONTEND_URL,
};
app.use(cors(corsOptions))

app.use('/api/contacts',contactRouter)




app.get('/', async (req, res) => {
    res.status(200).json({ status: 'running' })
})

app.listen(process.env.API_PORT, () => {
    connectToDB()
    console.log(`Server listening on port: ${process.env.API_PORT}`)
})

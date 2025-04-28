import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import connectDB from './lib/db.js'
import bookRoutes from './routes/bookRoutes.js'
import job from './lib/cron.js'


dotenv.config()

const app = express()


job.start()

connectDB()



app.use(express.json({ limit: '10mb' }));  
app.use(express.urlencoded({ limit: '10mb', extended: true })); 
app.use(cookieParser())

app.get('/ping', (req, res) => {
    res.status(200).send('pong 🏓');
  });
  


app.use('/api/auth',authRoutes)
app.use('/api/books',bookRoutes)

const PORT = process.env.PORT || 6002

app.listen(PORT,()=>{
    console.log('Server started at PORT :',PORT);
    
})
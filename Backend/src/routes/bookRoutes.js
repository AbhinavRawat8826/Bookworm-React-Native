import express from 'express'
import cloudinary from '../lib/cloudinary.js'
import protectedRoute from '../middleware/authmiddelware.js'
import Book from '../models/bookModel.js'


const router = express.Router()

router.post('/',protectedRoute,async(req,res)=>{
      try {

        const{title,caption,rating,image}= req.body

        const messageFields = [];
        if (!title) messageFields.push('title');
        if (!caption) messageFields.push('caption');
        if (!rating) messageFields.push('rating');
        if (!image) messageFields.push('image');
    
        if (messageFields.length > 0) {
          return res.status(400).json({ message: `Please fill all the required fields: ${messageFields.join(', ')}` });
        }
       
        const uploadRes = await cloudinary.uploader.upload(image);
        const imgURL = uploadRes.secure_url

        const newBook = new Book({ title, caption, rating, image: imgURL,postedBy:req.user._id })

        await newBook.save()

        res.status(201).json(newBook)


        
      } catch (error) {
        console.error('Error creating book:', error); 
        res.status(500).json({ message: error.message || 'An unexpected error occurred while creating the book.' });
      }
})



router.get('/',protectedRoute,async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page-1) * limit;

        const books = await Book.find().sort({createdAt:-1}).skip(skip).limit(limit).populate('postedBy','username profileImage')
         const totalBooks = await Book.countDocuments()
        res.status(200).json({
            books,
            currentPage:page,
            totalBooks,
            totalPages: Math.ceil(totalBooks/limit)
        })
        
    } catch (error) {
        console.log("Error in get all books route",error);
        res.status(500).json({message:'Internal server message'})
    }
})


router.get('/user',protectedRoute,async (req,res)=>{
    try {
        const books= await Book.find({postedBy:req.user._id}).sort({createdAt:-1})
        res.json(books)
        
    } catch (error) {
        console.log("Error in get all books route",error);
        
        res.status(500).json({message:'Internal server message'})
    }
})


router.delete('/:id',protectedRoute,async (req,res)=>{
    try {
        const book = await Book.findById(req.params.id)

        if(!book) return res.status(400).json({message:`Book doesn't exist`})

        if(book.postedBy.toString() != req.user._id.toString())
        {
            return res.status(400).json({message:`Unauthorized to delete the book`})

        }

        if(book.image && book.image.includes('cloudinary')){
            try {
                const publicId = book.image.split('/').pop().split('.')[0]
                await cloudinary.uploader.destroy(publicId)
            } catch (message) {
                console.log('message deleting image from cloudinary',message)
            }
        }

        await book.deleteOne()
        res.status(200).json({ message: 'Book deleted successfully' });

        
    } catch (error) {
        console.log("Error in get all books route",error);
        res.status(500).json({message:'Internal server message'})
        
    }
})

export default router
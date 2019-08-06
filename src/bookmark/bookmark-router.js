const express = require('express')
const bookmarkRouter = express.Router()
const bookmarks = require('../../store')
const logger = require('../../logger')
const uuid = require('uuid/v4')
const bodyParser = express.json()

const app = express()

app.use(express.json())

bookmarkRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(bookmarks)
    })
    .post(bodyParser, (req,res)=>{
        const {title, url, rating, desc} = req.body

        if(!title){
            logger.error(`Title is required`)
            return res
                .status(400)
                .send('Invalid data: title')
        }
        if(!url){
            logger.error(`Url is required`)
            return res
                .status(400)
                .send('Invalid data: url')
        }
        if(!rating){
            logger.error(`rating is required`)
            return res
                .status(400)
                .send('Invalid data: rating')
        }
        if(!desc){
            logger.error(`description is required`)
            return res
                .status(400)
                .send('Invalid data: desc')
        }
        const id = uuid()
        
        const bookmark = {
            id,
            title,
            url,
            rating,
            desc
        }
        bookmarks.push(bookmark)
            res
                .status(201)
                .location(`http://localhost:8000/bookmarks/${id}`)
                .json(bookmark)
    })

bookmarkRouter
    .route('/bookmarks/:id')
    .get((req, res)=>{
        const {id} = req.params
        const bookmark = bookmarks.find(b=>b.id == id)
        
        if (!bookmark){
            logger.error(`Bookmark with ${id} not found.`)
            return res
                .status(404)
                .send('Bookmark not found');
        }
        res.json(bookmark)
       
    })
    .delete((req, res)=>{
        const {id} = req.params 
        const bookmarkIndex = bookmarks.findIndex(b=>b.id==id)
        bookmarks.splice(bookmarkIndex, 1)
        if(bookmarkIndex === -1){
            return res
                .status(404)
                .send('Not found')
        }
        res 
            .status(204)
            .end();
            
    })
    
module.exports = bookmarkRouter
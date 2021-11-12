const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bnebi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//middleware
app.use(cors());
app.use(express.json());

async function run(){
    try{
        await client.connect();
        
        const db = client.db("sunbox");
        const user_collection = db.collection("user");
        const product_collection = db.collection("product");
        const order_collection = db.collection("order");
        const review_collection = db.collection("review");

        /**
         * add user to database
         */
        app.post('/user', async(req, res) => {
			const data = req.body;
			const role = 'customer';
			const finalData = {...data, role};
			const result = await user_collection.insertOne(finalData);
			res.json(result);
        });

        /**
		 * Get user by email
		 */
        app.get('/user/:email', async(req, res) => {
			const query = {email: req.params.email}
            const result = await user_collection.find(query).toArray();
            res.json(result);
        });

		/**
		 * Get all user
		 */
		 app.get('/user', async(req, res) => {
            const result = await user_collection.find().toArray();
            res.json(result);
        });

		/**
		 * product add
		 */

		 app.post('/product', async(req, res) => {
			const data = req.body;
			const result = await product_collection.insertOne(data);
			res.json(result);
        });

		/**
		 * all product 
		 */

		 app.get('/product', async(req, res) => {
			const result = await product_collection.find().toArray();
            res.json(result);
        });

        /**
		 * all product 
		 */

		 app.get('/product/:id', async(req, res) => {
            const query = {_id: ObjectId(req.params.id)};
			const result = await product_collection.find(query).toArray();
            res.json(result);
        });

		/**
		 *  product delete
		 */

		 app.delete('/product/:id', async(req, res) => {
			const query = {_id: ObjectId(req.params.id)};
            const result = await product_collection.deleteOne(query);
            res.send(result);
        });

        /**
         * order add into database
         */
         app.post('/order', async(req, res) => {
			const data = req.body;
			const result = await order_collection.insertOne(data);
			res.json(result);
        });

        /**
		 * all order 
		 */
		 app.get('/order', async(req, res) => {
			const result = await order_collection.find().toArray();
            res.json(result);
        });

        /**
		 *  order delete
		 */
		 app.delete('/order/:id', async(req, res) => {
			const query = {_id: ObjectId(req.params.id)};
            const result = await order_collection.deleteOne(query);
            res.send(result);
        });

        /**
		 * Get user by email
		 */
         app.get('/order/:email', async(req, res) => {
			const query = {email: req.params.email}
            const result = await order_collection.find(query).toArray();
            res.json(result);
        });

        //Update order
        app.put('/order/:id', async(req, res) => {
            const updateData = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  status: updateData.status
                },
              };

            const filter = {_id: ObjectId(req.params.id)};
            const update = await order_collection.updateOne(filter, updateDoc, options );
            res.send(update);
        });

        //Update user
        app.put('/user/:id', async(req, res) => {
            const updateData = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  role: updateData.role
                },
              };

            const filter = {_id: ObjectId(req.params.id)};
            const update = await user_collection.updateOne(filter, updateDoc, options );
            res.send(update);
        });

        /**
         * add review into database
         */
         app.post('/review', async(req, res) => {
			const data = req.body;
			const result = await review_collection.insertOne(data);
			res.json(result);
        });

        /**
		 * all order 
		 */
		 app.get('/review', async(req, res) => {
			const result = await review_collection.find().toArray();
            res.json(result);
        });

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('SunBox Running!');
})

app.listen(port, () => {
  console.log(`listening port: ${port}`);
})
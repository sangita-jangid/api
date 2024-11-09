let express = require('express');
let app = express();
let port = 9110;
let {dbConnect,
    getData,postData,updateData,
    deleteData} = require('./controller/dbcontroller');
    let {ObjectId} = require('mongodb');
    let cors = require('cors');

    app.use(express.json())
    app.use(cors())

    //get all city data
    app.get('/location',async(req,res) => {
        let query = {};
        let collection ="location"
        let output = await getData(collection,query);
        res.status(200).send(output)
    })

    //get all category
    app.get('/category',async(req,res) => {
        let query = {};
        let collection ="category"
        let output = await getData(collection,query);
        res.status(200).send(output)
    })
    //get all products
    app.get('/products',async(req,res) => {
        let query = {};
        let collection ="products"
        let output = await getData(collection,query);
        res.status(200).send(output)
    })
    //get all orders
    app.get('/orders',async(req,res) => {
        let query = {};
        let collection ="orders"
        let output = await getData(collection,query);
        res.status(200).send(output)
    })
    //filters
    app.get('/filter/:categoryid', async(req,res)=>{
        let query = {}
        let categoryid = Number(req.params.categoryid);
        let hprize = Number(req.query.hprize);
        let lprize = Number(req.query.lprize);

        if(hprize & lprize){
            query = {
                "category_id":categoryid,
                $and:[{prize:{$gt:lprize,$lt:hprize}}]
            }
           
        }else{
           
            query = {
                "category_id":categoryid
            }
        }
       
        let collection ="products"
        let output = await getData(collection,query);
        res.status(200).send(output)
    })
//mahalaxmiart details
   app.get('/details/:id',async(req,res) => {
     let id = Number(req.params.id);
     //let query = {"mahalaxmi_id":id}
     let query ={_id:new ObjectId(req.params.id)}
     let collection = "mahalaxmi";
     let output = await getData(collection,query);
     res.status(200).send(output)
   })
//category wrt to mahalaxmi
 app.get('/category/:id',async(req,res) => {
     let id = Number(req.params.id);
     let query = {"mahalaxmi_id":id}
     let collection = "category";
     let output =await getData(collection,query);
     res.status(200).send(output)
 })

 //place order
 app.get('/placeOrder',async(req,res) => {
    let data = req.body;
    let collection ="orders";
    let response = await postData(collection,data);
    res.send(response)
 })

 // get all city orders
 app.get('/getOrders',async(req,res) => {
    
    let query = {};
    let collection = "orders";
    let output =await getData(collection,query);
    res.status(200).send(output)
})
//update orders
app.put('/updateOrder',async(req,res) => {
    let collection="orders";
    let condition = {"_id":new ObjectId(req.body._id)}
    let data = {
        $set:{
            "status":req.body.status
        }
    }
    let response = await updateData(collection, condition, data);
    res.send(response)
})
//delete orders
app.put('/deleteOrder',async(req,res) => {
    let collection="orders";
    let condition = {"_id":new ObjectId(req.body._id)} 
    let response = await deleteData(collection, condition);
    res.send(response)
})


    app.listen(port,(err) => {
        if(err) throw err;
            console.log(`Server is running on port ${port}`)
    })
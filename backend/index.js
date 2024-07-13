// import express from "express"
// import cors from "cors"
// import { MongoClient } from 'mongodb';

// const app = express();

// app.use(cors());
// app.use(express.json());

// const Fruit = mongoose.model('Fruit', { name: String }, 'fruit');
// const client = new MongoClient('mongodb://localhost:27017', { monitorCommands: true });
// mongoose.connect('mongodb://127.0.0.1:27017/todo')
//     .then(() => {
//         console.log('DB connected');
//     })
//     .catch(() => {
//         console.log('Connection failed');
//     });

// app.get('/fruitlist', function(req, res) {
//     Fruit.find().then(function(retdata) {
//         console.log(retdata);
//         res.send(retdata);
//     });
// });

// app.post('/addfruit', function(req, res) {
//     const newfruit = req.body.newfruit;
//     const newFruit = new Fruit({ name: newfruit });
//     newFruit.save()
//         .then(savedFruit => {
//             console.log('Saved successfully');
//             res.status(201).send(savedFruit);
//         })
//         .catch(err => {
//             console.error('Error saving fruit:', err);
//             res.status(500).send('Error adding fruit');
//         });
// });

// app.put('/updatefruit/:id', function(req, res) {
//     const id = req.params.id;
//     const updatedName = req.body.name;
    
//     Fruit.findByIdAndUpdate(id, { name: updatedName }, { new: true })
//         .then(updatedFruit => {
//             console.log('Updated successfully:', updatedFruit);
//             res.status(200).send(updatedFruit);
//         })
//         .catch(err => {
//             console.error('Error updating fruit:', err);
//             res.status(500).send('Error updating fruit');
//         });
// });

// app.delete('/deletefruit/:id', function(req, res) {
//     const id = req.params.id;

//     Fruit.findByIdAndDelete(id)
//         .then(() => {
//             console.log('Deleted successfully');
//             res.status(200).send('Fruit deleted');
//         })
//         .catch(err => {
//             console.error('Error deleting fruit:', err);
//             res.status(500).send('Error deleting fruit');
//         });
// });

// app.listen(5000, function() {
//     console.log('Server started on port 5000');
// });
// ...............................................
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from 'mongodb';

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });

let db, fruitCollection;

client.connect()
    .then(() => {
        db = client.db('todo');
        fruitCollection = db.collection('fruit');
        console.log('DB connected');
    })
    .catch(err => {
        console.error('Connection failed', err);
    });

app.get('/fruitlist', (req, res) => {
    fruitCollection.find().toArray()
        .then(retdata => {
            console.log(retdata);
            res.send(retdata);
        })
        .catch(err => {
            console.error('Error retrieving fruits:', err);
            res.status(500).send('Error retrieving fruits');
        });
});

app.post('/addfruit', (req, res) => {
    const newfruit = req.body.newfruit;
    fruitCollection.insertOne({ name: newfruit })
        .then(result => {
            console.log('Saved successfully', result.ops[0]);
            res.status(201).send(result.ops[0]);
        })
        .catch(err => {
            console.error('Error saving fruit:', err);
            res.status(500).send('Error adding fruit');
        });
});

app.put('/updatefruit/:id', (req, res) => {
    const id = req.params.id;
    const updatedName = req.body.name;
    
    fruitCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { name: updatedName } },
        { returnOriginal: false }
    )
        .then(result => {
            console.log('Updated successfully:', result.value);
            res.status(200).send(result.value);
        })
        .catch(err => {
            console.error('Error updating fruit:', err);
            res.status(500).send('Error updating fruit');
        });
});

app.delete('/deletefruit/:id', (req, res) => {
    const id = req.params.id;

    fruitCollection.deleteOne({ _id: new ObjectId(id) })
        .then(() => {
            console.log('Deleted successfully');
            res.status(200).send('Fruit deleted');
        })
        .catch(err => {
            console.error('Error deleting fruit:', err);
            res.status(500).send('Error deleting fruit');
        });
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});

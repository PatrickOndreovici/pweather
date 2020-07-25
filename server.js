const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect('mongodb+srv://PatrickOndreovici:PatrickPatrick1@cluster0.fhml9.mongodb.net/WeatherApp?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const City = mongoose.model('cities', { name: String, searches_cnt: Number}, 'cities');

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get('/cities', function(req, res){
    City.find({}, function(err, users) {
        res.send(users);  
      });
});

app.post('/city', function(req, res){
    var cityName = req.body.cityName;
    City.find({name : cityName}, function (err, docs) {
        if (docs.length == 1){
            console.log("DA");
            City.findOneAndUpdate(
                {"name":cityName}, 
                { 
                    $inc: {'searches_cnt':1}
                },
                {
                    returnNewDocument: true
                }
            , function( error, result){
                // In this moment, you recive a result object or error
            
                // ... Your code when have result ... //
            });
            res.send({name: "null"});
        }else{
            const city = new City({ name: cityName, searches_cnt: 1}); 
            res.send(city);
            city.save();
        }
    });
});

app.listen(process.env.PORT || 3000, () => console.log(`Example app listening at http://localhost:${port}`))
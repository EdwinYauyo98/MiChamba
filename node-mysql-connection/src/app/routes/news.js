const dbConnection = require('../../config/dbConnection');

require('../../config/dbConnection');


const e = require("express")

module.exports = app => {
    const connection = dbConnection();
    app.get('/', (req, res) => {
        connection.query('SELECT * FROM news', (err, result) => {
            console.log(result);
            res.render('news/news', {
                news: result
            }); 
        });
    }); 

    app.post('/news', (req,res) => {

        const {title, news} = req.body;
        connection.query('INSERT INTO news SET?', {
            title:title,
            news:news
        }, (err, result) => {
            res.redirect('/');
        });
    });
}
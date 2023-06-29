const mysql = require('mysql')

const connection = mysql.createConnection({
    host:'db4free.net',
    database: 'juhosi',
    user:'juhosi',
    password:'juhosi123'
})

connection.connect(function(error) {
    if(error){
        throw error;
    }else{
        console.log('connected')
    }
} )


module.exports = connection;
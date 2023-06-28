const mysql = require('mysql')

const connection = mysql.createConnection({
    host:'localhost',
    database: 'ecomdb',
    user:'root',
    password:''
})

connection.connect(function(error) {
    if(error){
        throw error;
    }else{
        console.log('connected')
    }
} )


module.exports = connection;
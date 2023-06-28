const mysql = require('mysql')

const connection = mysql.createConnection({
    host:'bmyerz5y07hombpcsr9j-mysql.services.clever-cloud.com',
    database: 'bmyerz5y07hombpcsr9j',
    user:'udqitlauvynwnykd',
    password:'wTfHxDrTp0oFEnoscwqn'
})

connection.connect(function(error) {
    if(error){
        throw error;
    }else{
        console.log('connected')
    }
} )


module.exports = connection;
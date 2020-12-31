var mysql = require('mysql');
/** Creating pool here so it can store in container value*/
var pool      =    mysql.createPool({
    connectionLimit : 10,
    host     : '127.0.0.1', // Aurora DB conf will here
    user     : 'root',
    password : 'root',
    database : 'db_name',
    debug    :  false
});

module.exports.getProducts = async (event, context, callback) => {
	pool.getConnection(function(err,connection){
        if (err) {
          callback(null,{
					statusCode: 502,
					body: JSON.stringify(
					  {
						message: 'Something went wrong!',
						input: event,
					  },
					  null,
					  2
					),
				  });
          return;
        }
		var query = `SELECT * from tbl_products LIMIT 5`;
        connection.query(query,function(err,results){
            connection.release();
            if(!err) {
                callback(null,{
					statusCode: 200,
					body: JSON.stringify(
					  {
						data: results,
						input: event,
					  },
					  null,
					  2
					),
				  });
            }           
        });
        connection.on('error', function(err) {
              callback(null,{
					statusCode: 502,
					body: JSON.stringify(
					  {
						message: 'Something went wrong!',
						input: event,
					  },
					  null,
					  2
					),
				  });
        });
    });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

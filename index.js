var sesAccessKey = 'shivam*********'
var sesSecretKey = '************'

 exports.handler = function(event, context, callback) {


  	var nodemailer = require('nodemailer');
  	var smtpTransport = require('nodemailer-smtp-transport');
  	const amqp = require('amqplib/callback_api');

  	var transporter = nodemailer.createTransport(smtpTransport({
	    service: 'gmail',
	    auth: {
	        user: sesAccessKey,
	        pass: sesSecretKey
	    }
  	}));

  	var text = event.body.name;

  	var mailOptions = {
	    from: sesAccessKey,
	    to: sesAccessKey,
	    bcc: '',
	    subject: 'Testing Lambda Mail',
	    text: text
  	};
  	
  	amqp.connect('amqps://dfcdsgrw:JjGuXgjDQIzp7Wl7Ke9aTsBorj0iRXtT@lionfish.rmq.cloudamqp.com/dfcdsgrw', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'lambda_queue';
        var msg = 'Hello World!';

        channel.assertQueue(queue, {
            durable: true
        });
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        const response = {
          statusCode: 500,
          body: JSON.stringify({
            error: error.message,
          }),
        };
        callback(null, response);
      }
     setTimeout(function() { 
  connection.close(); 
  process.exit(0) 
  }, 500);
  const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: `Email processed succesfully!`
        }),
      };
      callback(null, response);
    });
    
  });
  
}
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "aswamsoftwaretech@gmail.com",
        pass: "Info@321"
        // user: "Aswam2.0@gmail.com",
        // pass: "9UrZG6bStx"
    }
});
exports.sendingMail = function(req,res){
    var isSuccess = false;
    smtpTransport.sendMail(req, function(error, response){
		if(error){
            smtpTransport.close();
		   return res(error,isSuccess) }
		else{
            smtpTransport.close();
			 isSuccess = true;
               return res(null,isSuccess)
    	} 
	});
}


// init code
const Nexmo = require("nexmo");

// init nexmo
const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_KEY,
    apiSecret: process.env.NEXMO_SECRET
});

// creating functions
function send (number){
    return new Promise ((resolve, reject)=>{
        nexmo.verify.request({
            number: parseInt( "" + 91 + number),
            brand: "Tvastra"
        }, function(err, result){
            if(err){
                console.error(err)
                reject(err);
            }
            if(result){
                console.log(result);
                resolve(result.request_id);
            }
        });
    })
}

function verify (requestId, otp){
    return new Promise ((resolve, reject)=>{
        nexmo.verify.check({
            request_id: requestId,
            code: otp
        }, function(err, result){
            if(err){
                console.error(err);
                reject(err);
            }
            if(result){
                console.log(result);
                resolve(result.status)
            }
        });
    })
}

// module exports
module.exports = {
    send: send,
    verify: verify
}
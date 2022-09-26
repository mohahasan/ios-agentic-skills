
require('dotenv').config();
const express = require('express')
const app = express()
const axios = require('axios').default;
const helmet = require("helmet");

const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
app.use(helmet());

app.enable('trust proxy')
app.use((req, res, next) => {
    req.secure ? next() : process.env.PORT ?  res.redirect('https://' + req.headers.host + req.url):next();
})
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; frame-ancestors 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self';  form-action 'self'; base-uri 'self'; frame-src 'self'"
  ); 
  next();
});


app.use(expressCspHeader({
  directives: {
    'default-src': [SELF],
    'script-src': [SELF],
    'style-src': [SELF],
    'img-src': [SELF],
    'worker-src': [SELF],
    "object-src":[SELF],
    "base-uri ":[SELF],
    "form-action":[SELF],
    'block-all-mixed-content': true
  }
}));

const login_Merchant_withdrew = require('./withdraw');


app.use(express.urlencoded({ extended: false }))
// parse json
app.use(express.json())

//another middle waye user exit 

async function checkUserDatabaseExist (req,res,next) {
  var phone=req.body.phone;
  var uuid=req.body.uuid;
  if (!req.is('application/json')) {
    res.send(400);
  }
    const userData = await Supabase
    .from(process.env.USERS_TABLE)
    .select()
    .eq('phone_number', phone);
    var userDataError =userData.error;
    if (userDataError == null &&
      userData.data != null &&
      userData.status == 200 &&
      (userData.data.toString()).length > 2) {
        var uuidDatabase=userData.data[0].uuid;
  if(uuidDatabase !=null && uuidDatabase ==uuid){
   next();
   
  }else{
    return res.sendStatus(401);
  }
      }else{
        return res.sendStatus(401);
      }
  }



//middle ware check user supabase token, phone & uuid is same
async function authenticateToken(req, res,next){
  
 
 const authHeader=req.headers['authorization'];
 const access_token =authHeader && authHeader.split(' ')[1]
 var phone =req.body.phone;
 var uuid=req.body.uuid;
 if (!req.is('application/json')) {
  
  res.send(400);
}
 var checkDatabase =phone !=null && uuid !=null && access_token !=null ? await checkuserAuth(phone, uuid, access_token) : false;
 if(access_token ==null  || checkDatabase ==null  || checkDatabase ==false  || phone ==null) return res.sendStatus(401);

 
if(access_token !=null && checkDatabase ==true && phone !=null && uuid !=null){
  next();
}

}


//withdrw endpoint

app.post('/api/merchant/withdrew', authenticateToken,checkUserDatabaseExist,(req, res) => {
  if (!req.is('application/json')) {
    // Send error here

    res.send(400);
}
   ;
  const { phone, amount,type , uuid,ip_addressTrans,app_versionTrans,device_kindTrans,device_modelTrans, device_versionTrans,  isHormuud} = req.body
  if (!phone || !amount || !type || !uuid  || !ip_addressTrans  || !app_versionTrans  || !device_kindTrans  || !device_modelTrans  || !device_versionTrans ||  isHormuud ==null )  {
    return res
    .status(400)
    .json({ success: false, msg: 'wrong credentials' })
  }
  if( parseFloat(amount.toString()) <1){
    return res
    .status(400)
    .json({ success: false, msg: 'you cant withdraw amount <1.0' });
  }
 
  login_Merchant_withdrew(phone,amount,ip_addressTrans,app_versionTrans,device_kindTrans,device_modelTrans, device_versionTrans, isHormuud).then(function (response) {
  
    res.status(201).json(response)
    }).catch(function (error) {
      return res
      .status(400)
      .json({ success: false, msg: `Error transaction `});
    
    });
 
})

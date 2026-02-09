
const { Module } = require('module');
const moment = require("moment");
// const supabase = require('../database/supabase');
const Supbase =require('../database/supabase');
require('dotenv').config();
const axios = require('axios').default;
axios.withCredentials = true;
async function login_Merchant_withdrew(userPhone, amount,ip_addressTrans,app_versionTrans,device_kindTrans,device_modelTrans, device_versionTrans,isHormuud){
  
    ;
 const response =await    axios({
        method: 'post',
        url: 'https://salaambank.com/api/account/login',
        
        data: {
            userNature:"MERCHANT",
            type:"MERCHANT",
            username:process.env.MERCHANT_USERNAME,
            currency:840,
            password:process.env.MERCHANT_PASSWORD,
        },
      
      });

      
      var websessionId=response.data.sessionId;
    
     
      var setCookie= response.headers['set-cookie'];
      
     
   return   merchant_withdraw_find(response.data.sessionId, setCookie, userPhone, amount,ip_addressTrans,app_versionTrans,device_kindTrans,device_modelTrans, device_versionTrans,isHormuud);
}


 
async function merchant_withdraw_find(websessionId,setCookie, userPhone,amount ,ip_addressTrans,app_versionTrans,device_kindTrans,device_modelTrans, device_versionTrans,isHormuud){
   
 const response=await    axios({
        method: 'post',
        url: 'https://salaambank.com/api/account/find',
        
        data: {
            userNature:"MERCHANT",
            sessionId:websessionId,
            type:"internetwork",
            mobileNo:userPhone
           
          
        
        },
        headers:{
            cookie:setCookie,
        }
        
      });

     
       var nameData =response.data.ReceiverInfo['NAME'];
      return  merchant_withdraw(response.data.sessionId, setCookie, userPhone,nameData, amount ,ip_addressTrans,app_versionTrans,device_kindTrans,device_modelTrans, device_versionTrans,isHormuud);
  }
  async function merchant_withdraw(websessionId,setCookie, phone, name,amount ,ip_addressTrans,app_versionTrans,device_kindTrans,device_modelTrans, device_versionTrans,isHormuud){
   var  globalUserPhone=phone;
    var userData =
    await Supbase.from('newsome_users').select().eq('phone_number', phone);
  
var userDataError = userData.error;
if(
   userDataError == null &&
    globalUserPhone != '639241' &&

    userData.data != null &&
    userData.status == 200 &&
    (userData.data.toString()).length > 2  ) {
      var myCurrentBalance=await userData.data[0].current_balance;

      if(myCurrentBalance <amount || myCurrentBalance==null) {
        return  { success: false , msg:`Haraagaagu kugum filno, waa :\$${myCurrentBalance} ` };
      }
     
      
      const response =await   axios({
        method: 'post',
        url: 'https://salaambank.com/api/money/b2p',
        
        data: {
            userNature:"MERCHANT",
            sessionId:websessionId,
         receiverMobile:phone,
            receiverName:name,
            pin:process.env.MERCHANT_PIN,
            amount:amount,
            description:"ok",
            isInterNetwork:isHormuud==true ?"0" :"1"
        
        },
        headers:{
            cookie:setCookie,
        }
        
      });
      var transMsg =response.data.replyMessage;
 
      var responseData =JSON.stringify(response.data);
        
        globalUserPhone=phone;
      
 
        if(response.data.transferInfo !=null  ){
          var amountSend=response.data.transferInfo.TxAmount;
           var currentBalance =
           userData.data[0].current_balance;
         var transferinfo2 =response.data.transferInfo;
         var transferDate1=transferinfo2['Transaction-Date'];
         var transferDateFormat=moment(transferDate1,"DD/MM/YY HH:mm:ss.SSS").format("YYYY-MM-DD HH:mm:ss.SSS");
    
          
           var lasttTranEvcWIthrewDate=transferDateFormat;
             
       
       var blocked_userTrans=userData.data[0].block_user;
       var user_idTrans=userData.data[0].uuid;
 // var prevUserPaid =
 //         userData.data[0].merchant_deposited;
         var merchantwithdrew=userData.data[0].merchant_withdrew;
         
              var withdrewDataCurrentBalance = currentBalance - amountSend;
           
         
        var  merchantWIthdrewUpdateBalance= merchantwithdrew + amountSend;
             
            
         
              var transactionId = transferinfo2['Transfer-Id'];
         
          
              var transactionCurrentBalance = withdrewDataCurrentBalance;
             
           var paymentType=userData.data[0].payment_type;
          var  transactionAction ='Labixid';
              
            
                 var func_transData = await  Supbase.rpc('merchant_withdrew_trans_func_secure',  {
         
         
         
         
         
         
         
         'current_balance_data': transactionCurrentBalance,
           'phone_number_data': phone,
            'previous_balance_data':currentBalance,
            'amount_data': amountSend,
          'transaction_type_data': paymentType,
           'transaction_action_data': transactionAction,
          'payment_type_data':paymentType,
            'transaction_date_data': transferDateFormat,
          'transaction_id_data': transactionId,
         'account_data': phone,
         'device_kind_data':device_kindTrans,
          'device_model_data':device_modelTrans,
          'device_version_data': device_versionTrans,
         'ip_address_data':ip_addressTrans,
          'block_user_data':blocked_userTrans,
          
         
         
          'app_version_data':app_versionTrans,
          'user_uid_data':user_idTrans,
         
         'merchant_withdrew_data':merchantWIthdrewUpdateBalance,
          'merchant_withdrew_last_tran_date_data':lasttTranEvcWIthrewDate,
         
         
           'mobcash_balance_data':0.00,
          'merchant_balance_data':0.00,
          
         
         
          
          
         });
 
         var func_transDataError=func_transData.error;
         return  { success: true, msg:transMsg !=null ? "Transaction successful":"nothing" };
        }else{
          return    { success:false, msg: response.data.replyMessage};
        }
 //    
      
     
    }else{
    }
  
  }

  module.exports =login_Merchant_withdrew

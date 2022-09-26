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

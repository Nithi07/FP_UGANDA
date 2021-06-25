const registerRepo = require('../repository');
var moment = require('moment');
var atob = require('atob');
var Blob = require('node-blob');

function blobdata (req,res) {
    if(req.body.imageURI.length > 0){
        var b=[];
        for(j=0;j<req.body.imageURI.length;j++){
            var dataURL = req.body.imageURI[j];
            var BASE64_MARKER = ';base64,';

            var parts = dataURL.split(BASE64_MARKER);
            var contentType = parts[0].split(':')[1];
            var raw = atob(parts[1]);
            var rawLength = raw.length;
            var uInt8Array = new Uint8Array(rawLength);
            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            b.push(new Blob([uInt8Array], {type: contentType}));
        }
        req.blob = b;
    }

}

async function lablecount(req, res) {

    registerRepo.list_lablecount(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
        }
    });
  }

async function listdata(req, res) {

    registerRepo.list(req,function(err,result1){
        if (err) {
            console.log("Error:", err);
        }else{
          res.render('pages/User_Details',{data:result1,sidebar:global.homepage});
        }
    });
  }

async function useractive(req, res) {

  let data ={};
    data.id             = req.params.id
    data.modified_on    = moment().format("DD-MMM-YYYY,h:mm:ss a");
    data.modified_by    = req.user.USER_INFO_ID;
    registerRepo.useractive(data,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.redirect('/User_Details');
        }
    });
}


async function userdelete(req, res) {

    let data ={};
      data.id             = req.params.id
      data.modified_on    = moment().format("DD-MMM-YYYY,h:mm:ss a");
      data.modified_by    = req.user.USER_INFO_ID;
      registerRepo.userdelete(data,function(err,result){
          if (err) {
              console.log("Error:", err);
          }else{
              res.redirect('/User_Details');
          }
      });
  }

//Userwise Form Assign

async function GetForms_Userwise(req, res) {

  let data ={};
    data.assign_userid  = req.params.id
    registerRepo.GetAllUserwiseFormList(data,function(err,result1){
        if (err) {
            console.log("Error:", err);
        }else{
          registerRepo.GetFilterd_UserwiseForms(data,function(err,result){
            if (err) {
                console.log("Error:", err);
            }else{
              res.render('pages/assign_forms',{data:result1,formlist:result,USER_ID:req.params.id,sidebar:global.homepage});
            }
        });

        }
    });
}
async function AddForms_Userwise(req, res) {
    let data ={};
      data.assign_userid  = req.body.user_id;
      data.forms_id       = JSON.parse(req.body.forms_list);
      data.created_on    = moment().format("DD-MMM-YYYY,h:mm:ss a");
      data.created_by    = req.user.USER_INFO_ID;


      registerRepo.GetUserwiseFormInsert(data,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
          res.status('200').json(result);
        }
    });

  }

  async function DeleteForms_Userwise(req, res) {

    let data ={};
      data.USER_INFO_ID   = req.params.user_id
      data.FORMS_ID       = req.params.id
      data.modified_on    = moment().format("DD-MMM-YYYY,h:mm:ss a");
      data.modified_by    = req.user.USER_INFO_ID;

      registerRepo.GetDeleteUserWiseForms(data,function(err,result){
          if (err) {
              console.log("Error:", err);
          }else{
              res.redirect('/User_Details');
          }
      });
  }


  async function AssignUnits(req, res) {

    let data ={};
      data.id             = req.params.id
      registerRepo.Unit_Assign(data,function(err,result){
          if (err) {
              console.log("Error:", err);
          }else{
              res.render('pages/assign_units',{assignunits:result[0],selectunit:result[1],USER_ID:req.params.id,sidebar:global.homepage});
          }
      });
  }
  async function AssignForms(req, res) {

    let data ={};
      data.id             = req.params.id
      registerRepo.GetFormsList(data,function(err,result){
          if (err) {
              console.log("Error:", err);
          }else{
              res.render('pages/assign_forms',{opt:result,USER_ID:req.params.id});
          }
      });
  }

  async function unitdelete(req, res) {

    let data ={};
      data.id             = req.params.id
      data.USER_ID        = req.params.user_id
      data.modified_on    = moment().format("DD-MMM-YYYY,h:mm:ss a");
      data.modified_by    = req.user.USER_INFO_ID;
      registerRepo.admin_to_deleteunitDal(data,function(err,result){
          if (err) {
              console.log("Error:", err);
          }else{
              res.redirect('/User_Details/Assign_Unit/'+req.params.user_id);
          }
      });
  }

  async function unitsave(req, res) {

    let data ={};
      data.unitlist_arr    = JSON.parse(req.body.unitlist);
      data.assign_userid   = req.body.userid
      data.modified_by     = req.user.USER_INFO_ID;
      data.created_by      = req.user.USER_INFO_ID;
      data.modified_on     = moment().format("DD-MMM-YYYY,h:mm:ss a");
      data.created_on      = moment().format("DD-MMM-YYYY,h:mm:ss a");
      registerRepo.CreateUnitmapDal(data,function(err,result){
          if (err) {
              console.log("Error:", err);
          }else{
              res.status('200').json(result);
          }
      });
  }


  async function paymentsave(req, res) {
      req.body.file_name = JSON.parse(req.body.file_name);
      req.body.size = JSON.parse(req.body.size);
      req.body.imageURI = JSON.parse(req.body.imageURI);
    blobdata(req,res);
    let data ={};
      data.size_data       = req.body.size;
      data.Blob            = req.blob;
      data.name            = req.body.file_name;
      data.assign_userid   = req.body.userid;
      data.location_code   = req.body.location_code;
      data.location_code1  = req.body.location_code1;
      data.modified_by     = req.user.USER_INFO_ID;
      data.created_by      = req.user.USER_INFO_ID;
      data.modified_on     = moment().format("DD-MMM-YYYY,h:mm:ss a");
      data.created_on      = moment().format("DD-MMM-YYYY,h:mm:ss a");
      registerRepo.payment_details_file_Insert(data,function(err,result){
          if (err) {
              console.log("Error:", err);
          }else{
              res.status('200').json(result);
          }
      });
  }

  async function paymentlist(req, res) {

      registerRepo.paymentlist(req,function(err,result){
          if (err) {
              console.log("Error:", err);
          }else{
            res.status('200').json(result);
          }
      });
  }

  async function updateuser(req, res) {

    let data ={};
      data.mobile_num           = req.body.mobile_num;
      data.Additional_no1       = req.body.Additional_no1;
      data.Additional_no2       = req.body.Additional_no2;
      data.Additional_no3       = req.body.Additional_no3;
      data.email                = req.body.email;
      data.userid               = req.body.userid
      data.modified_by          = req.user.USER_INFO_ID;
      data.modified_on          = moment().format("DD-MMM-YYYY,h:mm:ss a");
      registerRepo.updateuserDal(data,function(err,result){
          if (err) {
              console.log("Error:", err);
          }else{
              res.status('200').json(result);
          }
      });
  }

module.exports ={
    lablecount,
    listdata,
    useractive,
    userdelete,
    AssignUnits,
    AssignForms,
    unitdelete,
    unitsave,
    paymentsave,
    paymentlist,
    updateuser,
    GetForms_Userwise,
    AddForms_Userwise,
    DeleteForms_Userwise

};

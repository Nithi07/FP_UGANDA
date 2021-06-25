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
async function listdata(req, res) {

    registerRepo.list(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.render('pages/project_updates',{data:result[0],selectlist:result[1],sidebar:global.homepage});
        }
    });
  }

  async function buildingwise(req, res) {

    registerRepo.buildingwiselist(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
        }
    });
  }

  async function datewise(req, res) {

    registerRepo.datewiselist(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
        }
    });
  }


  async function save(req, res) {

    req.body.file_name = JSON.parse(req.body.file_name);
    req.body.size = JSON.parse(req.body.size);
    req.body.imageURI = JSON.parse(req.body.imageURI);
  blobdata(req,res);
  let data ={};
    data.size_data       = req.body.size;
    data.Blob            = req.blob;
    data.name            = req.body.file_name;
    data.unitlist        = JSON.parse(req.body.selected_unit)
    data.modified_by     = req.user.USER_INFO_ID;
    data.created_by      = req.user.USER_INFO_ID;
    data.modified_on     = moment().format("DD-MMM-YYYY,h:mm:ss a");
    data.created_on      = moment().format("DD-MMM-YYYY,h:mm:ss a");

    registerRepo.saveProject(data,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
        }
    });
  }

module.exports ={
    listdata,
    buildingwise,
    save,
    datewise
};

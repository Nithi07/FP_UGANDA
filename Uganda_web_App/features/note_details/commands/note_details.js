const registerRepo = require('../repository');

var moment = require('moment');
var atob = require('atob');
var Blob = require('node-blob');


var moment = require('moment');

let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");


async function list(req, res) {


    registerRepo.list_note(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
          //  res.render('pages/note_details',{data:result});
        }
    });
  }



  async function notedetails(req, res) {

    res.render('pages/note_details',{sidebar:global.homepage});

  }



  async function listCategory(req, res) {

    registerRepo.note_category(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{

            res.status('200').json(result);
        }
    });
  }

  async function getBuildings(req, res) {

    registerRepo.getAllBuildings(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{

            res.status('200').json(result);
        }
    });
  }

  async function getAllUnit(req, res) {

    registerRepo.getAllUnitLIst(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{

            res.status('200').json(result);
        }
    });
  }




  async function getAllUser(req, res) {

    registerRepo.getAllUserList(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{

            res.status('200').json(result);
        }
    });
  }


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



async function filesave(req, res) {

    req.body.file_name = JSON.parse(req.body.file_name);


    req.body.size = JSON.parse(req.body.size);



    req.body.imageURI = JSON.parse(req.body.imageURI);




  blobdata(req,res);

  let data ={};
    data.size_data       = req.body.size;
    data.Blob            = req.blob;
    data.name            = req.body.file_name;
    data.location_code   = req.body.location_code
    data.unit_id         = req.body.unit_id;
    data.modified_by     = req.user.USER_INFO_ID;
    data.created_by      = req.user.USER_INFO_ID;
    data.modified_on     = moment().format("DD-MMM-YYYY,h:mm:ss a");
    data.created_on      = moment().format("DD-MMM-YYYY,h:mm:ss a");
    console.log("going to save");
    registerRepo.savenotefile(data,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
        }
    });
  }





  async function note_file_list(req, res) {



    registerRepo.note_file(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
        }
    });
  }

  async function note_commentlist(req, res) {

    console.log("inside js function........");

    registerRepo.note_commentlist(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
        }
    });
  }


  async function getreportlist(req, res) {


var dt=req.query.fdate ;


 req.query.fdate=  new Date( req.query.fdate.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
 req.query.tdate=  new Date( req.query.tdate.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
var parameter="From : "+formatDate(req.query.fdate) + "  To : "+formatDate(req.query.tdate);

var categoryname = req.query.categoryName;
var username = req.query.userName;
var buildingname = req.query.buildingName;
var unitname=req.query.unitName;
if(   categoryname !== 'undefined' )
{
parameter=parameter+" category Name :"+ req.query.categoryName;
}

if(   username !== 'undefined' )
{
parameter=parameter+" userName: "+ req.query.userName;
}


if(  buildingname !== 'undefined' )
{
parameter=parameter+" buildingName :"+ req.query.buildingName;
}

if(  unitname !== 'undefined' )
{
parameter=parameter+" unitName :"+ req.query.unitName;
}


    registerRepo.note_Reportcommentlist(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{

            console.log("result length ="+result.length);
var dt=req.query.fdate ;
		       ejs.renderFile(path.join(__dirname, '../../../views/pages', "report_template.ejs"), {notedata: result,d1:parameter}, (err, data) => {
        if (err) {
              res.send(err);
        } else {
          /*  let options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };*/



var monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
var dateObj = new Date();
var month = monthNames[dateObj.getMonth()];
var day = String(dateObj.getDate()).padStart(2, '0');
var year = dateObj.getFullYear();
var output = month  + '\n'+ day  + ',' + year;

var dateTime= output;

            var options = {
                format: "A4",
                orientation: "portrait",
               // border: "10mm",
                header: {
                    height: "20mm",

                   contents: '<div style="float:right;  padding-right:4px !important;"> <img src="http://fakhruddinproperties.com/uploads/settings/f3d3f2be75f7d4d6ed563ae875a380d7"/></div>'
                },
                footer: {
                    height: "28mm",
                    contents: {

                        default:  '<div class="bg-yellow d-flex justify-content-between"><div><span style="color: #444;">{{page}}</span>/<span>{{pages}}</span></div><div>'+dateTime+'</div></div>',

                       // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value

                    }
                }
            };


            console.log("result length ="+result.length);
            pdf.create(data, options).toStream(function(err, stream){

                stream.pipe(res);
         });


        }
    });





        }
    });


  }


 function formatDate(pdate)
 {

    var dd = pdate.getDate();

var mm = pdate.getMonth()+1;
var yyyy = pdate.getFullYear();
if(dd<10)
{
    dd='0'+dd;
}

if(mm<10)
{
    mm='0'+mm;
}

pdate = dd+'/'+mm+'/'+yyyy;
return pdate;
 }
  async function newCommentinsert(req, res) {

    console.log("insert comment js file ");

    let data = {};
    data.comments = req.body.comments;
    data.created_by = req.user.USER_INFO_ID;
    data.unit_id=req.body.unit_id;
    data.category_id=req.body.category_id;
    data.modified_on = moment().format("DD-MMM-YYYY,h:mm:ss a");
    data.created_on = moment().format("DD-MMM-YYYY,h:mm:ss a");

    registerRepo.getInsertNewComment(data, function (err, result) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.status('200').json(result);
        }
    });
  }
  async function note_updateReminder(req, res) {

    console.log("insert rmnder ....."+ req.body.rmdate);

    console.log("insert rmnder ....."+ req.query.rmdate);


    let data = {};

    data.modified_by = req.user.USER_INFO_ID;
    data.modified_on = moment().format("DD-MMM-YYYY,h:mm:ss a");
 data.rmdate= new Date( req.body.rmdate.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))

 console.log("scheduled date = "+  data.rmdate);
    data.comment_id=req.body.comment_id;
    registerRepo.getupdReminder(data, function (err, result) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.status('200').json(result);
        }
    });
  }

  async function getReminderById(req, res) {
    let data = {};
    data.ref_id=req.body.ref_id;
    //console.log("get reminder by id ...1"+req.body.ref_id );

    registerRepo.ReminderById(data, function (err, result) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.status('200').json(result);
        }
    });
  }




module.exports ={
    list,
    note_file_list,
    newCommentinsert,
    filesave,
    listCategory,
    getBuildings,
    getreportlist,
    getAllUnit,
    getAllUser,
    note_updateReminder,
    notedetails,
    note_commentlist,
    getReminderById
};

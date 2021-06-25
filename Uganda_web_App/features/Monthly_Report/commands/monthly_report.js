const registerRepo = require('../repository');
var moment = require('moment');

async function Monthly_Report_List(req, res) {
  registerRepo.getAllReportsList(req, function (err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
                res.render('monthly_report/monthly_report', { reports:result, moment:moment, sidebar:homepage });
            }
        });

}
async function CreateReport(req, res) {

  registerRepo.getAllLocationList(req, function (err, result) {
    if (err) {
        console.log("Error:", err);
    } else {
      registerRepo.get_activity_hdr(req, function (err, result1) {
        if (err) {
            console.log("Error:", err);
        } else {
          res.render('monthly_report/monthly_report_form', { location: result, moment:moment, activity_header:result1, sidebar:homepage});

          }
    });

    }
});
}
async function GetBuildingsList(req, res) {
  let data = {location_id:req.body.location_id}
  console.log(req.body.location_id,'LOC ID');
  registerRepo.getBuildingsList(data, function (err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
              console.log(result,'Returned Buildings');
              res.status('200').json(result);
            }
        });

}
async function Activity_Dtl(req, res) {
  let data = {activity_id:req.body.activity_id}

  registerRepo.get_activity_dtl(data, function (err, result) {
    if (err) {
        console.log("Error:", err);
    } else {
      console.log(result,'Returned DTL');
      var activ_dtl_datas = result
      var activity_dtl=[];
      activ_dtl_datas.forEach(element => {
        if(element.ACTIVITY_HDR_ID==data.activity_id){
          activity_dtl.push(element);
        }

      });
      res.status('200').json(activity_dtl);
    }
});



}
async function Find_lenth_Subdtl(req, res) {
  let data = {activity_id:req.body.activity_id}

  registerRepo.get_activity_sdtl(data, function (err, result) {
    if (err) {
        console.log("Error:", err);
    } else {
      // console.log(result,'Returned Subdtl');
      var activ_subdtl_datas = result;
      var count_subdtl=[];
      activ_subdtl_datas.forEach(element => {
        if(element.ACTIVITY_HDR_ID==data.activity_id){
          count_subdtl.push(element);
        }

      });
      res.status('200').json(count_subdtl);
    }
});

}

async function Activity_SubDtl(req, res) {
  let data = {activity_id:req.body.activity_id, activitydtl_id:req.body.act_dtl_id}
  registerRepo.get_activity_sdtl(data, function (err, result) {
    if (err) {
        console.log("Error:", err);
    } else {
      // console.log(result,'Returned Sdtl');
      var activ_subdtl_datas = result
      var activity_subdtl=[];
      activ_subdtl_datas.forEach(element => {
        if(element.ACTIVITY_HDR_ID==data.activity_id && element.ACTIVITY_DTL_ID == data.activitydtl_id){
          activity_subdtl.push(element);
        }

      });
      res.status('200').json(activity_subdtl);
    }
});

}


async function GetProject_Proform(req, res) {

  let data = {}
    data.location_id = req.body.location_id
    data.building_id = req.body.building_id
    data.activity_hdr_id = req.body.activity_hdr_id
    data.activity_dtl_id = req.body.activity_dtl_id
    data.activity_subdtl_id = req.body.activity_subdtl_id

  registerRepo.getProcessPro_Form(data, function (err, result) {
            if (err) {
                console.log("Error:", err);
            } else {

              res.status('200').json(result);
            }
        });

}
async function Add_ReportName(req, res) {
  let data = {};
    data.location_id = req.body.location_id
    data.building = JSON.parse(req.body.building_id);
    data.project_name = req.body.project_name
    data.form_created_on = moment().format("DD-MMM-YY");
    data.created_by = req.user.USER_INFO_ID;
    data.created_on = moment().format("DD-MMM-YYYY,h:mm:ss a");

    registerRepo.createreportname(data, function (err, result) {
      if (err) {
          console.log("Error:", err);
      } else {
        console.log(result,'Added Report Name');
        res.status('200').json(result);
      }
  });
}
async function Add_Activity(req, res) {
  // console.log(req.body.activity_subdtl.length,'LL')
  if(req.body.activity_dtl == "null"){
    var dtl = []
  }else{
    var dtl = JSON.parse(req.body.activity_dtl);
    console.log(dtl,'DTL');
  }
  if(req.body.activity_subdtl == "null"){
    var sub_dtl = []
  }else{
    var sub_dtl = JSON.parse(req.body.activity_subdtl);
  }
  let data = {};
    data.location_id = req.body.location_id
    data.report_name_id = req.body.report_id
    data.activity_hdr_id = req.body.activity_hdr
    data.activity_dtl_id = dtl
    data.activity_subdtl_id = sub_dtl
    data.active = 1
    data.created_by = req.user.USER_INFO_ID;
    data.created_on = moment().format("DD-MMM-YYYY,h:mm:ss a");

    console.log(data,'Data');
    // console.log(data.activity_subdtl_id.length,'sdtl length');

    registerRepo.createactivity(data, function (err, result) {
      if (err) {
          console.log("Error:", err);
      } else {
        console.log(result,'Activites Added');
        res.status('200').json(result);
      }
  });
}

async function Get_Activities(req, res) {

  let data = {report_id : req.body.report_id}

  registerRepo.getactivities(data, function (err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
              console.log(result,"GETed Activites");
              res.status('200').json(result);
            }
        });

}
async function Remove_Activities(req, res) {

  let data = {}
    data.activity_hdr_id = req.body.activity_hdr
    data.report_id = req.body.report_id
    data.modified_on = moment().format('DD-MMM-YY');
    data.modified_by = req.user.USER_INFO_ID

  registerRepo.removeactivities(data, function (err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
              console.log("Removed");
              res.status('200').json(result);
            }
        });

}
async function Create_Form(req, res) {

  let data = {report_id : req.body.report_id,
    location_name:req.body.location_name,
    location_id:req.body.location_id}

  console.log(data,'data')
  registerRepo.createForm(data, function (err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
              console.log(result,"Form Created");
              res.status('200').json(result);
            }
        });

}


module.exports = {
  Monthly_Report_List,
  GetBuildingsList,
  Activity_Dtl,
  Activity_SubDtl,
  GetProject_Proform,
  Add_ReportName,
  CreateReport,
  Find_lenth_Subdtl,
  Add_Activity,
  Get_Activities,
  Remove_Activities,
  Create_Form

};

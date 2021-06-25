const registerRepo = require('../repository');
var moment = require('moment');

async function Project_ProgressForm(req, res) {
  registerRepo.getAllProjectsList(req, function (err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
                res.render('Project_Progress/projectpro', { project: result,moment:moment,sidebar:global.homepage});
            }
        });

}
async function CreateProject(req, res) {

  registerRepo.getAllLocationList(req, function (err, result) {
    if (err) {
        console.log("Error:", err);
    } else {
      registerRepo.get_activity_hdr(req, function (err, result1) {
        if (err) {
            console.log("Error:", err);
        } else {
          // var activity_header = [{ACTIITY_ID:1,ACTIVITY_NAME:'RCC Work'},{ACTIITY_ID:2,ACTIVITY_NAME:'Plaster Work'},{ACTIITY_ID:3,ACTIVITY_NAME:'Railing Work'}]
          res.render('Project_Progress/project_form', { location: result, moment:moment, activity_header:result1, sidebar:global.homepage});

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

  // var activ_dtl_datas = [
  //               {ACTIITY_ID:2,ACTIITY_DTL_ID:1,ACTIVITY_DTL_NAME:"Internal"},{ACTIITY_ID:2,ACTIITY_DTL_ID:2,ACTIVITY_DTL_NAME:"External"},
  //               {ACTIITY_ID:3,ACTIITY_DTL_ID:3,ACTIVITY_DTL_NAME:"Balcony"},{ACTIITY_ID:3,ACTIITY_DTL_ID:4,ACTIVITY_DTL_NAME:"Staircase"}];

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

  // var activ_subdtl_datas = [
  //       {ACTIITY_ID:2,ACTIITY_DTL_ID:1,ACTIVITY_SUBDTL_ID:1,ACTIVITY_SUBDTL_NAME:"Apartment"},{ACTIITY_ID:2,ACTIITY_DTL_ID:1,ACTIVITY_SUBDTL_ID:2,ACTIVITY_SUBDTL_NAME:"Common Area"},
  //       {ACTIITY_ID:2,ACTIITY_DTL_ID:2,ACTIVITY_SUBDTL_ID:3,ACTIVITY_SUBDTL_NAME:"Front"},{ACTIITY_ID:2,ACTIITY_DTL_ID:2,ACTIVITY_SUBDTL_ID:4,ACTIVITY_SUBDTL_NAME:"Back"},{ACTIITY_ID:2,ACTIITY_DTL_ID:2,ACTIVITY_SUBDTL_ID:5,ACTIVITY_SUBDTL_NAME:"Right"},{ACTIITY_ID:2,ACTIITY_DTL_ID:2,ACTIVITY_SUBDTL_ID:6,ACTIVITY_SUBDTL_NAME:"Left"}];


  registerRepo.get_activity_sdtl(data, function (err, result) {
    if (err) {
        console.log("Error:", err);
    } else {
      console.log(result,'Returned Subdtl');
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

  // var activ_subdtl_datas = [
  //       {ACTIITY_ID:2,ACTIITY_DTL_ID:1,ACTIVITY_SUBDTL_ID:1,ACTIVITY_SUBDTL_NAME:"Apartment"},{ACTIITY_ID:2,ACTIITY_DTL_ID:1,ACTIVITY_SUBDTL_ID:2,ACTIVITY_SUBDTL_NAME:"Common Area"},
  //       {ACTIITY_ID:2,ACTIITY_DTL_ID:2,ACTIVITY_SUBDTL_ID:3,ACTIVITY_SUBDTL_NAME:"Front"},{ACTIITY_ID:2,ACTIITY_DTL_ID:2,ACTIVITY_SUBDTL_ID:4,ACTIVITY_SUBDTL_NAME:"Back"},{ACTIITY_ID:2,ACTIITY_DTL_ID:2,ACTIVITY_SUBDTL_ID:5,ACTIVITY_SUBDTL_NAME:"Right"},{ACTIITY_ID:2,ACTIITY_DTL_ID:2,ACTIVITY_SUBDTL_ID:6,ACTIVITY_SUBDTL_NAME:"Left"}];


  registerRepo.get_activity_sdtl(data, function (err, result) {
    if (err) {
        console.log("Error:", err);
    } else {
      console.log(result,'Returned Sdtl');
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
async function Add_ProjectName(req, res) {
  let data = {};
    data.location_id = req.body.location_id
    data.building = JSON.parse(req.body.building_id);
    data.project_name = req.body.project_name
    data.form_created_on = moment().format("DD-MMM-YY");
    data.created_by = req.user.USER_INFO_ID;
    data.created_on = moment().format("DD-MMM-YYYY,h:mm:ss a");

    registerRepo.createprojectname(data, function (err, result) {
      if (err) {
          console.log("Error:", err);
      } else {
        console.log(result,'Returned');
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
  }
  if(req.body.activity_subdtl == "null"){
    var sub_dtl = []
  }else{
    var sub_dtl = JSON.parse(req.body.activity_subdtl);
  }
  let data = {};
    data.location_id = req.body.location_id
    // data.building = JSON.parse(req.body.building_id);
    data.project_name_id = req.body.project_id
    // data.form_created_on = moment().format("DD-MMM-YY");
    data.activity_hdr_id = req.body.activity_hdr
    data.activity_dtl_id = dtl
    data.activity_subdtl_id = sub_dtl
    data.active = 1
    data.created_by = req.user.USER_INFO_ID;
    data.created_on = moment().format("DD-MMM-YYYY,h:mm:ss a");

    // console.log(data.activity_dtl_id.length,'dtl length');
    // console.log(data.activity_subdtl_id.length,'sdtl length');

    registerRepo.createactivity(data, function (err, result) {
      if (err) {
          console.log("Error:", err);
      } else {
        console.log(result,'Returned');
        res.status('200').json(result);
      }
  });
}

async function Get_Activities(req, res) {

  let data = {project_id : req.body.project_id}

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
    data.project_id = req.body.project_id
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

  let data = {project_id : req.body.project_id,
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
  Project_ProgressForm,
  GetBuildingsList,
  Activity_Dtl,
  Activity_SubDtl,
  GetProject_Proform,
  Add_ProjectName,
  CreateProject,
  Find_lenth_Subdtl,
  Add_Activity,
  Get_Activities,
  Remove_Activities,
  Create_Form

};

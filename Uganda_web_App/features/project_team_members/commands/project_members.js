const registerRepo = require('../repository');
var moment = require('moment');

async function project_members_list(req, res) {
  let userlist = []
  let location = []
  // get userinfo
  registerRepo.getAllUserList(req, function (err, result1) {
    if (err) {
        console.log("Error:", err);
    } else {
      userlist = result1;
        // Get Location List
        registerRepo.getAllLocationList(req, function (err, result2) {
          if (err) {
              console.log("Error:", err);
          } else {
              location = result2;

          // Get ProjectTeam Member
              registerRepo.getAllProjectMembersList(req, function (err, result) {
                if (err) {
                    console.log("Error:", err);
                } else {
                    res.render('project_team_members/listproject_members', { data:result,userlist,location,moment:moment,sidebar:global.homepage});
                }
            });
          }
        });
      }
    });
 }

async function InsertProjectMembers(req, res) {
    // console.log(req.body.user_info_id,':user_info_id>>>>>>>>');
    // console.log(req.body.location_id,':location_id');
    let data = {};
    data.userlist_arr = JSON.parse(req.body.user_info_id);
    data.location_id = parseInt(req.body.location_id);
    data.created_by = req.user.USER_INFO_ID;
    data.created_on = moment().format("DD-MMM-YYYY,h:mm:ss a");
    console.log(req.user.USER_INFO_ID,'userID')
    console.log(data,'json')
    registerRepo.GetInsertProjectMembers(data, function (err, result) {
      if (err) {
          console.log("Error:", err);
      } else {
        console.log("Ended")
        res.status('200').json(result);
      }
  });
}
async function UpdateProjectMembers(req, res) {
    // console.log(req.body.stgt_start_time,':shift_start>>>>>>>>');
    // console.log(req.body.stgt_end_time,':shift_end');
    // console.log(req.body.mrg_start_time,':mrg_start');
    // console.log(req.body.mrg_end_time,':mrg_end');
    // console.log(req.body.evg_start_time,':evg_start');
    // console.log(req.body.evg_end_time,':evg_end');
    let data = {};
    data.id = req.body.id;
    data.user_info_id = JSON.parse(req.body.file_name);;
    data.location_id = parseInt(req.body.location_id);
    data.modified_by = req.user.USER_INFO_ID;
    data.modified_on = moment().format("DD-MMM-YYYY,h:mm:ss a");


    registerRepo.GetUpdateProjectMembers(data, function (err, result) {
      if (err) {
          console.log("Error:", err);
      } else {
        res.status('200').json(result);
      }
  });
}


async function DeleteProjectMembers(req, res) {
    let data = {};
    data.id = req.body.id;
    data.modified_by = req.user.USER_INFO_ID;
    data.modified_on = moment().format("DD-MMM-YYYY,h:mm:ss a");

    registerRepo.GetDeleteProjectmembers(data, function (err, result) {
      if (err) {
          console.log("Error:", err);
      } else {
        res.status('200').json(result);
      }
    });
}



module.exports = {
  project_members_list,
  InsertProjectMembers,
  UpdateProjectMembers,
  DeleteProjectMembers

};

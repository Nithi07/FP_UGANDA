const registerRepo = require('../repository');
var moment = require('moment');

async function shiftime_setting_list(req, res) {

    registerRepo.getAllLocationList(req, function (err, result) {
        let location = [];
        let data = [];
        if (err) {
            console.log("Error:", err);
        } else {
            location = result;
        }
        registerRepo.getAllShiftSettingList(req, function (err, result) {
          if (err) {
              console.log("Error:", err);
          } else {
              data = result;
              res.render('shift_settings/listshift_settings', { data,location,moment:moment,sidebar:global.homepage});
          }
      });
    });
}

async function InsertShift(req, res) {
    // console.log(req.body.stgt_start_time,':shift_start>>>>>>>>');
    // console.log(req.body.stgt_end_time,':shift_end');
    // console.log(req.body.mrg_start_time,':mrg_start');
    // console.log(req.body.mrg_end_time,':mrg_end');
    // console.log(req.body.evg_start_time,':evg_start');
    // console.log(req.body.evg_end_time,':evg_end');
    let data = {};
    data.shift_type = req.body.shift_type;
    data.stgt_start_time = req.body.stgt_start_time;
    data.stgt_end_time = req.body.stgt_end_time;
    data.mrg_start_time = req.body.mrg_start_time;
    data.mrg_end_time=    req.body.mrg_end_time;
    data.evg_start_time=    req.body.evg_start_time;
    data.evg_end_time=    req.body.evg_end_time;
    data.buffer=    req.body.buffer;
    data.location_id=    req.body.location;
    data.weekend1=    req.body.weekend1;
    data.weekend2=    req.body.weekend2;
    data.created_by = req.user.USER_INFO_ID;
    data.created_on = moment().format("DD-MMM-YYYY,h:mm:ss a");


    registerRepo.GetInsertShiftSetting(data, function (err, result) {
      if (err) {
          console.log("Error:", err);
      } else {
        res.status('200').json(result);
      }
  });
}
async function UpdateShift(req, res) {
    console.log(req.body.stgt_start_time,':shift_start>>>>>>>>');
    console.log(req.body.stgt_end_time,':shift_end');
    console.log(req.body.mrg_start_time,':mrg_start');
    console.log(req.body.mrg_end_time,':mrg_end');
    console.log(req.body.evg_start_time,':evg_start');
    console.log(req.body.evg_end_time,':evg_end');
    let data = {};
    data.shift_id = req.body.shift_id;
    data.shift_type = req.body.shift_type;
    data.stgt_start_time = req.body.stgt_start_time;
    data.stgt_end_time = req.body.stgt_end_time;
    data.mrg_start_time = req.body.mrg_start_time;
    data.mrg_end_time=    req.body.mrg_end_time;
    data.evg_start_time=    req.body.evg_start_time;
    data.evg_end_time=    req.body.evg_end_time;
    data.buffer=    req.body.buffer;
    data.location_id=    req.body.location;
    data.weekend1=    req.body.weekend1;
    data.weekend2=    req.body.weekend2;
    data.modified_by = req.user.USER_INFO_ID;
    data.modified_on = moment().format("DD-MMM-YYYY,h:mm:ss a");


    registerRepo.GetUpdateShiftSetting(data, function (err, result) {
      if (err) {
          console.log("Error:", err);
      } else {
        res.status('200').json(result);
      }
  });
}

// async function UpdateLocation(req, res) {
//     let data = {};
//     data.location_id = req.body.location_id;
//     data.location_name = req.body.location_name;
//     data.latitude = req.body.latitude;
//     data.longitude = req.body.longitude;
//     data.distance_coverage = req.body.coverage_distance;
//     data.site=    req.body.site;
//     data.modified_by = req.user.USER_INFO_ID;
//     data.modified_on = moment().format("DD-MMM-YYYY,h:mm:ss a");

//     registerRepo.GetUpdateLocation(data, function (err, result) {
//         if (err) {
//             console.log("Error:", err);
//         } else {
//           res.status('200').json(result);
//         }
//     });
// }
async function DeleteShift(req, res) {
    let data = {};
    data.shift_id = req.body.shift_id;
    data.modified_by = req.user.USER_INFO_ID;
    data.modified_on = moment().format("DD-MMM-YYYY,h:mm:ss a");

    registerRepo.GetDeleteShift(data, function (err, result) {
      if (err) {
          console.log("Error:", err);
      } else {
        res.status('200').json(result);
      }
    });
}



module.exports = {
  shiftime_setting_list,
  InsertShift,
  UpdateShift,
  DeleteShift

};


const oracledb = require('oracledb');
const database2 = require('../../db/index2');
const database = require('../../db/index');
const moment = require('moment');
const { example } = require('joi/lib/types/object');

async function getAllProjectMembersList(req, res) {
  let params = {
    query: `BEGIN get_all_project_members(:result_set); END;`,
    params: {
      result_set: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
    }
  };
  database.GetDataStoreProcedure(params, async function (err, result) {
    if (err) {
      return res(err, null);
    } else {
      return res(null, result);
    }
  });
}

async function getAllShiftSettingList(req, res) {
  let params = {
    query: `BEGIN get_all_shift_setting(:p_shift_time_setting_id,:result_set); END;`,
    params: {
      p_shift_time_setting_id: req.query.shift_time_setting_id ? req.query.shift_time_setting_id : null,
      result_set: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
    }
  };
  database.GetDataStoreProcedure(params, async function (err, result) {
    if (err) {
      return res(err, null);
    } else {
      return res(null, result);
    }
  });
}


async function getAllUserAttendance(req, res) {
  let obj = req.query;
  let params = {
    query : `BEGIN GET_ALL_USER_ATTEN(:p_attend_date,:result_set); END;`,
        params : {
          p_attend_date : moment().format("DD-MMM-YYYY"),
          result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
        }
  };
  database2.GetDataStoreProcedure(params, async function(err,result){
    if(err){
      return res(err,null);
    } else {
      return res(null,result);
    }
  });
}
async function getMonthlyUserAttendance(req, res) {
  console.log(req.from_date,"Repo From Date")
  console.log(req.to_date,"Repo to Date")
  let params = {
    query : `BEGIN GET_MONTHLY_USER_ATTEN(:p_from_date,:p_to_date,:result_set); END;`,
        params : {
          p_from_date : req.from_date,
          p_to_date : req.to_date,
          result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
        }
  };
  database2.GetDataStoreProcedure(params, async function(err,result){
    if(err){
      return res(err,null);
    } else {
      return res(null,result);
    }
  });
}
async function getLateUserAttendance(req, res) {
  let params = {
    query : `BEGIN GET_LATE_USER_ATTEN(:p_user_info_id,:p_from_date,:p_to_date,:result_set); END;`,
        params : {
          p_user_info_id : req.emp_id ? req.emp_id : 0,
          p_from_date : req.from_date,
          p_to_date : req.to_date,
          result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
        }
  };
  database2.GetDataStoreProcedure(params, async function(err,result){
    if(err){
      return res(err,null);
    } else {
      return res(null,result);
    }
  });
}
async function getEmpWiseAttendance(req, res) {
  let params = {
    query : `BEGIN GET_EMP_WISE_ATTEN(:p_user_info_id,:p_from_date,:p_to_date,:result_set); END;`,
        params : {
          p_user_info_id : req.emp_id ? req.emp_id : 0,
          p_from_date : req.from_date,
          p_to_date : req.to_date,
          result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
        }
  };
  database2.GetDataStoreProcedure(params, async function(err,result){
    if(err){
      return res(err,null);
    } else {
      return res(null,result);
    }
  });
}
// Example for using Promise and async await

// function B() {
//   return new Promise((resolve, reject)=>{
//     let a = 1;
//     let b = 2;
//     let c = a + b;
//     resolve(c);
//   })

// }
// function C() {
//   return new Promise((resolve, reject)=>{
//     let a = 1;
//     let b = 2;
//     let c = a + b;
//     resolve(c);
//   })
// }

// async function A() {
//   var res1= await B(); // 2
//   var res2= await C(); //3
// }



module.exports = {
  getAllProjectMembersList,
  getAllShiftSettingList,
  getAllUserAttendance,
  getMonthlyUserAttendance,
  getLateUserAttendance,
  getEmpWiseAttendance,

};

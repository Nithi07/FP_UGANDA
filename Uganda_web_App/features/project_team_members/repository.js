
const oracledb = require('oracledb');
const database2 = require('../../db/index2');
const database = require('../../db/index');

async function getAllUserList(req, res) {
  let params = {
    query: `BEGIN MOB_GET_USER_LIST(:result_set); END;`,
    params: {

      result_set: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
    }
  };
  database2.GetDataStoreProcedure(params, async function (err, result) {
    if (err) {
      return res(err, null);
    } else {
      return res(null, result);
    }
  });
}
async function getAllLocationList(req, res) {
  let params = {
    query: `BEGIN MOB_GET_LOC_LIST(:result_set); END;`,
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



function GetInsertProjectMembers(req, res) {
  let length = 1;
  for(var i=0;i<req.userlist_arr.length;i++){
    let ul = parseInt(req.userlist_arr[i])
  var parameters = {
    query: `BEGIN PROJECT_MEMBERS_INSERT(:p_user_info_id,:p_location_id,:p_created_by,
      :p_created_on,:p_modified_by,:p_modified_on,:p_error_code); END;`,

    params: {
      p_user_info_id: ul ? ul: 0,
      p_location_id: req.location_id ? req.location_id : null,
      p_created_by: req.created_by,
      p_created_on: req.created_on,
      p_modified_by: req.created_by,
      p_modified_on: req.created_on,
      p_error_code: 0
  },
  options: {
    autoCommit: true,
    bindDefs: [

      { type: oracledb.NUMBER },
      { type: oracledb.NUMBER },
      { type: oracledb.NUMBER },
      { type: oracledb.DATE },
      { type: oracledb.NUMBER },
      { type: oracledb.DATE },
      { type: oracledb.DB_TYPE_NUMBER, dir : oracledb.BIND_OUT }
    ]
  }
  };
  database.insertStoreProcedureExecute(parameters,function(err,result){
    if(err){
      return res(err,null);
    } else {
      if(req.userlist_arr.length == length){
        // console.log('Yes ====');
        return res(null,result);
      }
      length++;

    }
  });
  }
}
function GetUpdateProjectMembers(req, res) {
  let length = 1;
  for(var i=0;i<req.userlist_arr.length;i++){
  var parameters = {
    query: `BEGIN PROJECT_MEMBERS_UPDATE(p_id:p_user_info_id,:p_location_id,
      :p_created_on,:p_modified_on,:p_created_by,:p_modified_by,:p_error_code); END;`,

    params: {
      p_id: req.id,
      p_user_info_id:   req.userlist_arr[i].user_info_id ? req.userlist_arr[i].user_info_id: null,
      p_location_id: req.location_id ,
      p_created_on: req.created_on,
      p_modified_on: req.created_on,
      p_created_by: req.created_by,
      p_modified_by: req.created_by,
      p_error_code: 0
  },
  options: {
    autoCommit: true,
    bindDefs: [
      { type: oracledb.NUMBER },
      { type: oracledb.NUMBER },
      { type: oracledb.NUMBER },
      { type: oracledb.DATE },
      { type: oracledb.DATE },
      { type: oracledb.NUMBER },
      { type: oracledb.NUMBER },
      { type: oracledb.DB_TYPE_NUMBER, dir : oracledb.BIND_OUT }
    ]
  }
  };
  database.insertStoreProcedureExecute(parameters,function(err,result){
    if(err){
      return res(err,null);
    } else {
      if(req.unitlist_arr.length == length){
        return res(null,result);
      }
      length++;

    }
  });
  }
}
function GetDeleteProjectmembers(req, res) {
  // console.log('Repoooo');
  var parameters = {
    query: `BEGIN MOB_SHIFT_DELETE(:p_id,:p_is_deleted,
      :p_modified_on,:p_modified_by,:p_error_code); END;`,
    params: {
      p_id:   id,
      p_is_deleted: 1,
      p_modified_on: req.modified_on,
      p_modified_by: req.modified_by,
      p_error_code: 0
  },
  options: {
    autoCommit: true,
    bindDefs: [
      { type: oracledb.NUMBER },
      { type: oracledb.NUMBER },
      { type: oracledb.DATE },
      { type: oracledb.NUMBER },
      { type: oracledb.DB_TYPE_NUMBER, dir : oracledb.BIND_OUT }
    ]
  }
  };
  database.insertStoreProcedureExecute(parameters,function(err,result){
    if(err){
      return res(err,null);
    } else {
      return res(null,result);
    }
  });
}



module.exports = {
  getAllUserList,
  getAllLocationList,
  getAllProjectMembersList,
  GetInsertProjectMembers,
  GetUpdateProjectMembers,
  GetDeleteProjectmembers
};

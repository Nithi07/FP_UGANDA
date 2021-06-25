
const oracledb = require('oracledb');
const database = require('../../db/index2');

async function getAllLocationList(req, res) {
  let params = {
    query: `BEGIN GET_ALL_USER_LOCATION(:p_location_id,:result_set); END;`,
    params: {
      p_location_id: req.query.p_location_id ? req.query.p_location_id : null,
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



function GetInsertLocation(req, res) {
  console.log(req.new_latitude,'repo');
  var parameters = {
    query: `BEGIN USER_LOCATION_INSERT(:p_location_name,:p_latitude,:p_longitude,:p_new_latitude,
      :p_new_longitude,:p_distance_coverage,:p_site,:p_is_active,:p_created_on,
      :p_modified_on,:p_created_by,:p_modified_by,:p_error_code); END;`,
    params: {
      p_location_name:   req.location_name ? req.location_name : null,
      p_latitude: req.latitude,
      p_longitude: req.longitude,
      p_new_latitude: req.new_latitude ? req.new_latitude :null,
      p_new_longitude: req.new_longitude ? req.new_longitude : null,
      p_distance_coverage: req.distance_coverage ? req.distance_coverage : null,
      p_site: req.site ? req.site : null,
      p_is_active: 1,
      p_created_on: req.created_on,
      p_modified_on: req.created_on,
      p_created_by: req.created_by ? req.created_by : 0,
      p_modified_by: req.created_by ? req.created_by : 0,
      p_error_code: 0
  },
  options: {
    autoCommit: true,
    bindDefs: [
      { type: oracledb.STRING },
      { type: oracledb.STRING },
      { type: oracledb.STRING },
      { type: oracledb.STRING },
      { type: oracledb.STRING },
      { type: oracledb.NUMBER },
      { type: oracledb.STRING },
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
      return res(null,result);
    }
  });

}

function GetUpdateLocation(req, res) {

  var parameters = {
    query: `BEGIN USER_LOCATION_UPDATE(:p_location_id,:p_location_name,:p_latitude,
      :p_longitude,:p_new_latitude,:p_new_longitude,:p_distance_coverage,
      :p_site,:p_is_active,:p_modified_on,:p_modified_by,:p_error_code); END;`,

    params: {
      p_location_id:   req.location_id,
      p_location_name:   req.location_name ? req.location_name : null,
      p_latitude: req.latitude,
      p_longitude: req.longitude,
      p_new_latitude: req.new_latitude ? req.new_latitude :null,
      p_new_longitude: req.new_longitude ? req.new_longitude : null,
      p_distance_coverage: req.distance_coverage ? req.distance_coverage : null,
      p_site: req.site ? req.site : null,
      p_is_active: 1,
      p_modified_on: req.modified_on,
      p_modified_by: req.modified_by,
      p_error_code: 0
  },
  options: {
    autoCommit: true,
    bindDefs: [
      { type: oracledb.NUMBER },
      { type: oracledb.STRING },
      { type: oracledb.STRING },
      { type: oracledb.STRING },
      { type: oracledb.STRING },
      { type: oracledb.STRING },
      { type: oracledb.NUMBER },
      { type: oracledb.STRING },
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
function GetDeleteLocation(req, res) {
  // console.log('Repoooo');
  var parameters = {
    query: `BEGIN USER_LOCATION_DELETE(:p_location_id,:p_is_deleted,
      :p_modified_on,:p_modified_by,:p_error_code); END;`,
    params: {
      p_location_id:   req.location_id,
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
  getAllLocationList,
  GetInsertLocation,
  GetUpdateLocation,
  GetDeleteLocation
};


const oracledb = require('oracledb');
const database2 = require('../../db/index2');
const database = require('../../db/index');

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



function GetInsertShiftSetting(req, res) {
  // console.log("Enterd by")
  var parameters = {
    query: `BEGIN SHIFT_SETTING_INSERT(:p_shift_type,:p_start_time,:p_end_time,
      :p_mrg_srt_time,:p_mrg_end_time,:p_evg_srt_time,:p_evg_end_time,:p_buffer,
      :p_location_id,:p_weekend1,:p_weekend2,:p_created_on,
      :p_modified_on,:p_created_by,:p_modified_by,:p_error_code); END;`,
    params: {
      p_shift_type:   req.shift_type,
      p_start_time: req.stgt_start_time ? req.stgt_start_time : null,
      p_end_time: req.stgt_end_time ? req.stgt_end_time : null,
      p_mrg_srt_time: req.mrg_start_time ? req.mrg_start_time : null,
      p_mrg_end_time: req.mrg_end_time ? req.mrg_end_time : null,
      p_evg_srt_time: req.evg_start_time ? req.evg_start_time : null,
      p_evg_end_time: req.evg_end_time ? req.evg_end_time : null,
      p_buffer: req.buffer,
      p_location_id: req.location_id,
      p_weekend1: req.weekend1 ? req.weekend1 : null,
      p_weekend2: req.weekend2 ? req.weekend2 : null,
      p_created_on: req.created_on,
      p_modified_on: req.created_on,
      p_created_by: req.created_by,
      p_modified_by: req.created_by,
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
      { type: oracledb.STRING },
      { type: oracledb.STRING },
      { type: oracledb.NUMBER },
      { type: oracledb.NUMBER },
      { type: oracledb.STRING },
      { type: oracledb.STRING },
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
function GetUpdateShiftSetting(req, res) {
  // console.log("Enterd by")
  var parameters = {
    query: `BEGIN SHIFT_SETTING_UPDATE(:p_shift_id,:p_shift_type,:p_start_time,:p_end_time,
      :p_mrg_srt_time,:p_mrg_end_time,:p_evg_srt_time,:p_evg_end_time,:p_buffer,:p_location_id,
      :p_weekend1,:p_weekend2,:p_modified_on,:p_modified_by,:p_error_code); END;`,

    params: {
      p_shift_id : req.shift_id,
      p_shift_type:   req.shift_type,
      p_start_time: req.stgt_start_time ? req.stgt_start_time : null,
      p_end_time: req.stgt_end_time ? req.stgt_end_time : null,
      p_mrg_srt_time: req.mrg_start_time ? req.mrg_start_time : null,
      p_mrg_end_time: req.mrg_end_time ? req.mrg_end_time : null,
      p_evg_srt_time: req.evg_start_time ? req.evg_start_time : null,
      p_evg_end_time: req.evg_end_time ? req.evg_end_time : null,
      p_buffer: req.buffer,
      p_location_id: req.location_id,
      p_weekend1: req.weekend1,
      p_weekend2: req.weekend2,
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
      { type: oracledb.STRING },
      { type: oracledb.STRING },
      { type: oracledb.NUMBER },
      { type: oracledb.NUMBER },
      { type: oracledb.STRING },
      { type: oracledb.STRING },
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

function GetDeleteShift(req, res) {
  // console.log('Repoooo');
  var parameters = {
    query: `BEGIN MOB_SHIFT_DELETE(:p_shift_id,:p_is_deleted,
      :p_modified_on,:p_modified_by,:p_error_code); END;`,
    params: {
      p_shift_id:   req.shift_id,
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
  getAllShiftSettingList,
  GetInsertShiftSetting,
  GetUpdateShiftSetting,
  GetDeleteShift
};

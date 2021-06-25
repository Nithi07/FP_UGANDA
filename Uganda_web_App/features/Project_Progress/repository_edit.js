const oracledb = require('oracledb');
const database = require('../../db/index');
var moment = require('moment');


async function getbuildings(req, res) {
  let params = {
    query: `BEGIN GET_PRO_BUILDINGS(:P_PROJECT_ID,:result_set); END;`,
    params: {
      P_PROJECT_ID: parseInt(req.project_id),
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

async function getDates(req, res) {
  let params = {
    query: `BEGIN GET_PRO_DATES(:P_PROJECT_ID,:result_set); END;`,
    params: {
      P_PROJECT_ID: parseInt(req.project_id),
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
async function getcount(req, res) {
  let params = {
    query: `BEGIN GET_PRO_COUNT(:P_PROJECT_ID,:result_set); END;`,
    params: {
      P_PROJECT_ID: parseInt(req.project_id),
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


function Update_NewactivityHDR(req,res){
  let data = req.table_data;
    data.forEach(element => {
    var parameters = {};
    if (element.type == 'hdr'){
    parameters.params = {
      p_PROJECT_ID     :  req.project_id,
      p_BUILDING_ID    :  element.building_id,
      p_ACT_HDR_ID     :  element.hdr_id,
      p_PERCENTAGE     :  element.percentage,
      p_CREATED_DATE   :  moment(element.created).format("DD-MMM-YY"),
      p_COMPLETED      :  element.completed,
      p_LOC_ID         :  req.location_id,
      p_IS_ACTIVE      :  1,
      p_IS_INITIAL     :  0,
      p_modified_on    :  req.modified_on,
      p_modified_by    :  req.modified_by,
      p_error_code     :  { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
    };
    parameters.query = `BEGIN PRO_ACTIVITY_HDR_UPDATE(:p_PROJECT_ID,:p_BUILDING_ID,:p_ACT_HDR_ID,:p_PERCENTAGE,
      :p_CREATED_DATE,:p_COMPLETED,:p_LOC_ID,:p_IS_ACTIVE,:p_IS_INITIAL,:p_modified_on,:p_modified_by,:p_error_code); END;` ;

    }else if (element.type == 'dtl'){
      parameters.params = {
        p_PROJECT_ID     :  req.project_id,
        p_BUILDING_ID    :  element.building_id,
        p_ACT_HDR_ID     :  element.hdr_id,
        p_ACT_DTL_ID     :  element.dtl_id,
        p_PERCENTAGE     :  element.percentage,
        p_CREATED_DATE   :  moment(element.created).format("DD-MMM-YY"),
        p_COMPLETED      :  element.completed,
        p_LOC_ID         :  req.location_id,
        p_IS_ACTIVE      :  1,
        p_IS_INITIAL     :  0,
        p_modified_on    :  req.modified_on,
        p_modified_by    :  req.modified_by,
        p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
      };
      parameters.query = `BEGIN PRO_ACTIVITY_DTL_UPDATE(:p_PROJECT_ID,:p_BUILDING_ID,:p_ACT_HDR_ID,:p_ACT_DTL_ID,
        :p_PERCENTAGE,:p_CREATED_DATE,:p_COMPLETED,:p_LOC_ID,:p_IS_ACTIVE,:p_IS_INITIAL,:p_modified_on,:p_modified_by,:p_error_code); END;` ;
      } else if (element.type == 'sdtl'){
        parameters.params = {
          p_PROJECT_ID     :  req.project_id,
          p_BUILDING_ID    :  element.building_id,
          p_ACT_HDR_ID     :  element.hdr_id,
          p_ACT_DTL_ID     :  element.dtl_id,
          p_ACT_SDTL_ID    :  element.sdtl_id,
          p_PERCENTAGE     :  element.percentage,
          p_CREATED_DATE   :  moment(element.created).format("DD-MMM-YY"),
          p_COMPLETED      :  element.completed,
          p_LOC_ID         :  req.location_id,
          p_IS_ACTIVE      :  1,
          p_IS_INITIAL     :  0,
          p_modified_on    :  req.modified_on,
          p_modified_by    :  req.modified_by,
          p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
        };
        parameters.query = `BEGIN PRO_ACTIVITY_SDTL_UPDATE(:p_PROJECT_ID,:p_BUILDING_ID,:p_ACT_HDR_ID,:p_ACT_DTL_ID,:p_ACT_SDTL_ID,
          :p_PERCENTAGE,:p_CREATED_DATE,:p_COMPLETED,:p_LOC_ID,:p_IS_ACTIVE,:p_IS_INITIAL,:p_modified_on,:p_modified_by,:p_error_code); END;` ;
        }
    database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
      if(err){
        return res(err,null);
      } else {
        // res.status(200);
        console.log('Updated Sucessfully')
      }
    });
  });
return res(null,null);
}


async function GetUpdated_Activities(req, res) {
  console.log("REpo Hdr");
  let params = {
    query: `BEGIN GET_UPDATED_HDR(:P_PROJECT_ID,:result_set); END;`,
    params: {
      P_PROJECT_ID: parseInt(req.project_id),
      result_set: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
    }
  };
  database.GetDataStoreProcedure(params, async function (err, result) {
    if (err) {
      return res(err, null);
    } else {
      req.ActivityHDR = result;
      getupdated_dtl(req,res);
    }
  });
}

function getupdated_dtl(req, res) {
  console.log("REpo DTL");
  let params = {
    query : `BEGIN GET_UPDATED_DTL(:P_PROJECT_ID,:result_set); END;`,
        params : {
          P_PROJECT_ID: parseInt(req.project_id),
          result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
        }
  };
  database.GetDataStoreProcedure(params, async function(err,result){
    if(err){
      return res(err,null);
    } else {
      req.ActivityDTL = result;
      getupdated_subdtl(req,res);
    }
  });
}

async function getupdated_subdtl(req, res) {
  console.log("REpo sdtl");
  let params = {
    query : `BEGIN GET_UPDATED_SDTL(:P_PROJECT_ID,:result_set); END;`,
        params : {
          P_PROJECT_ID: parseInt(req.project_id),
          result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
        }
  };
  database.GetDataStoreProcedure(params, async function(err,result){
    if(err){
      return res(err,null);
    } else {

      var obj = [];

        obj.push(req.ActivityHDR);
        obj.push(req.ActivityDTL);
        obj.push(result);
        return res(null,obj);
    }
  });
}


module.exports = {
  getbuildings,
  getDates,
  getcount,
  Update_NewactivityHDR,
  GetUpdated_Activities
};

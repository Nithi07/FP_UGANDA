
const oracledb = require('oracledb');
const database = require('../../db/index');

async function getAllReportsList(req, res) {
  let params = {
    query: `BEGIN GET_ALL_MON_REPORTS(:result_set); END;`,
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
async function getBuildingsList(req, res) {
  let params = {
    query: `BEGIN GET_BUILDINGS_LIST(:p_location_id,:result_set); END;`,
    params: {
      p_location_id: req.location_id,
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

async function get_activity_hdr(req, res) {
  let params = {
    query: `BEGIN GET_ALL_ACTIVITY_HDR(:result_set); END;`,
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
async function get_activity_dtl(req, res) {
  let params = {
    query: `BEGIN GET_ALL_ACTIVITY_DTL(:result_set); END;`,
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
async function get_activity_sdtl(req, res) {
  let params = {
    query: `BEGIN GET_ALL_ACTIVITY_SUB_DTL(:result_set); END;`,
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
async function getProcessPro_Form(req,res) {
  let params = {
    query: `BEGIN GET_PROJECT_PRO_FORM(:p_location_id,:p_building_id,:p_act_hdr_id,:p_act_dtl_id,
      :p_act_subdtl_id,:result_set); END;`,
    params: {

      p_location_id:   req.location_id,
      p_building_id: req.building_id,
      p_act_hdr_id: req.activity_hdr_id,
      p_act_dtl_id: req.activity_dtl_id ? req.activity_dtl_id :null,
      p_act_subdtl_id: req.activity_subdtl_id ? req.activity_subdtl_id : null,
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

function createreportname(req,res){

  var parameters = {};
  parameters.params = {
    p_LOCATION_ID     : req.location_id,
    p_PROJECT_NAME :  req.project_name,
    p_CREATED_DATE : req.form_created_on,
    p_created_on   : req.created_on,
    p_created_by   : req.created_by,
    p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
  };
  parameters.query = `BEGIN REPORT_NAME_INSERT(:p_LOCATION_ID,:p_PROJECT_NAME,:p_CREATED_DATE,:p_created_on,
    :p_created_by,:p_error_code); END;` ;

 database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
    if(err){
      return res(err,null);
    } else {
      req.report_name_id = result.p_error_code;
      report_building_insert(req,res);
    }
  });
}

function report_building_insert(req,res){
  let length = 1;
  for(var i=0;i<req.building.length;i++){
    var parameters = {  query : `BEGIN REP_BUILDING_INSERT(:P_REPORT_NAME_ID,:P_BUILDING_ID,:p_error_code); END;`,
      params : [
        P_REPORT_NAME_ID   = req.report_name_id ? req.report_name_id : 0,
        P_BUILDING_ID     =  req.building[i] ? req.building[i] : 0,
        p_error_code        =  0
      ],
      options: {
        autoCommit: true,
        bindDefs: [
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
    if(req.building.length == length){
      return res(null,req.report_name_id);
    }
    length++;

  }
});
  }

}

function createactivity(req,res){
  var is_sub;
    if (req.activity_dtl_id.length>0){
      is_sub = 1
    }
    else{
      is_sub = 0
    }

    var parameters = {  query : `BEGIN REP_ACTIVITY_HDR_INSERT(:P_REPORT_NAME_ID,:P_ACTIVITY_HDR_ID,:P_IS_INITIAL,:P_LOCATION_ID,:P_ACTIVE,:P_IS_SUB,:p_modified_on,:p_modified_by,:p_error_code); END;`,
      params : [
        P_REPORT_NAME_ID   = req.report_name_id ? req.report_name_id : 0,
        P_ACTIVITY_HDR_ID   = req.activity_hdr_id ? req.activity_hdr_id : 0,
        P_IS_INITIAL   = 1,
        P_LOCATION_ID   = req.location_id,
        P_ACTIVE     =  1,
        P_IS_SUB     = is_sub,
        p_modified_on   = req.created_on,
        p_modified_by   = req.created_by,
        p_error_code        =  0
      ],
      options: {
        autoCommit: true,
        bindDefs: [
          { type: oracledb.NUMBER },
          { type: oracledb.NUMBER },
          { type: oracledb.NUMBER },
          { type: oracledb.NUMBER },
          { type: oracledb.NUMBER },
          { type: oracledb.NUMBER },
          { type: oracledb.DATE },
          { type: oracledb.DATE },
          { type: oracledb.DB_TYPE_NUMBER, dir : oracledb.BIND_OUT }
        ]
      }
    };
database.insertStoreProcedureExecute(parameters,function(err,result){
  if(err){
    return res(err,null);
  } else {
      if (req.activity_dtl_id.length>0){
        console.log('S lenth is high');
        createactivity_dtl(req,res);
      }
      else{
        return res(null,result)
      }

  }
});

}


function createactivity_dtl(req,res){
  var is_sub;
    if (req.activity_subdtl_id.length>0){
      is_sub = 1
    }
    else{
      is_sub = 0
    }

  let act_length = 1;
  console.log(req.activity_dtl_id.length,"Repo Lenth")
  console.log(req.activity_dtl_id,"DTL datas")
    for(var j=0;j<req.activity_dtl_id.length;j++){

      console.log(req.activity_dtl_id[j],'Repo DTL')
      var parameters = {};
      parameters.params = {
        P_REPORT_NAME_ID : req.report_name_id ? req.report_name_id : 0,
        P_ACTIVITY_HDR_ID : req.activity_hdr_id ? req.activity_hdr_id : 0,
        P_IS_INITIAL   : 1,
        P_ACTIVITY_DTL_ID : req.activity_dtl_id[j],
        P_LOCATION_ID : req.location_id,
        P_ACTIVE  :  1,
        P_IS_SUB   : is_sub,
        p_modified_on   : req.created_on,
        p_modified_by   : req.created_by,
        p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
      };
      parameters.query = `BEGIN REP_ACT_DTL_INSERT(:P_REPORT_NAME_ID,:P_ACTIVITY_HDR_ID,:P_ACTIVITY_DTL_ID,:P_IS_INITIAL,:P_LOCATION_ID,
        :P_ACTIVE,:P_IS_SUB,:p_modified_on,:p_modified_by,:p_error_code); END;` ;

    database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
        if(err){
          return res(err,null);
        } else {
          if(req.activity_dtl_id.length == act_length){
            if (req.activity_subdtl_id.length>0){
              createactivity_subdtl(req,res);
            }else{
              return res(null,result)
            }
          }
          act_length++;
        }
      });
    }
}

function createactivity_subdtl(req,res){

  let act_length = 1;

    for(var j=0;j<req.activity_subdtl_id.length;j++){
      var parameters = {};
      parameters.params = {
        P_REPORT_NAME_ID : req.report_name_id ? req.report_name_id : 0,
        P_ACTIVITY_HDR_ID : req.activity_hdr_id ? req.activity_hdr_id : 0,
        P_IS_INITIAL   : 1,
        P_ACTIVITY_DTL_ID : req.activity_dtl_id[0],
        P_ACTIVITY_SUBDTL_ID : req.activity_subdtl_id[j],
        P_LOCATION_ID : req.location_id,
        P_ACTIVE  :  1,
        p_modified_on   : req.created_on,
        p_modified_by   : req.created_by,
        p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
      };
      parameters.query = `BEGIN REP_ACT_SUBDTL_INSERT(:P_REPORT_NAME_ID,:P_ACTIVITY_HDR_ID,:P_ACTIVITY_DTL_ID,:P_ACTIVITY_SUBDTL_ID,
        :P_IS_INITIAL,:P_LOCATION_ID,:P_ACTIVE,:p_modified_on,:p_modified_by,:p_error_code); END;` ;


    database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
        if(err){
          return res(err,null);
        } else {
          if(req.activity_subdtl_id.length == act_length){

            return res(null,result);
          }
          act_length++;
        }
      });
    }
}


async function getactivities(req, res) {
  let params = {
    query: `BEGIN GET_REP_ACTIVITY_LIST(:P_REPORT_ID,:result_set); END;`,
    params: {
      P_REPORT_ID: req.report_id,
      result_set: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
    }
  };
  database.GetDataStoreProcedure(params, async function (err, result) {
    if (err) {
      return res(err, null);
    } else {
      req.ActivityHDR = result;
      getactivities_dtl(req,res);
    }
  });
}

function getactivities_dtl(req, res) {
  let params = {
    query : `BEGIN GET_REP_ACTIVITY_DTL(:P_REPORT_ID,:result_set); END;`,
        params : {
          P_REPORT_ID: req.report_id,
          result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
        }
  };
  database.GetDataStoreProcedure(params, async function(err,result){
    if(err){
      return res(err,null);
    } else {
      req.ActivityDTL = result;
      getactivities_subdtl(req,res);
    }
  });
}

async function getactivities_subdtl(req, res) {
  let params = {
    query : `BEGIN GET_REP_ACTIVITY_SUBDTL(:P_REPORT_ID,:result_set); END;`,
        params : {
          P_REPORT_ID: req.report_id,
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


function removeactivities(req,res){

  var parameters = {};
  parameters.params = {
    p_REPORT_ID     : req.report_id,
    p_ACT_HDR_ID :  req.activity_hdr_id,
    p_modified_on   : req.modified_on,
    p_modified_by   : req.modified_by,
    p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
  };
  parameters.query = `BEGIN REP_ACTIVITY_HDR_REMOVE(:p_REPORT_ID,:p_ACT_HDR_ID,:p_modified_on,
    :p_modified_by,:p_error_code); END;` ;

 database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
    if(err){
      return res(err,null);
    } else {
      removeactivity_dtl(req,res);
    }
  });
}

function removeactivity_dtl(req,res){
  console.log(req.report_id,'Repo proo ID')
  console.log(req.activity_hdr_id,'Repo Act ID')
  var parameters = {};
  parameters.params = {
    p_REPORT_ID     : req.report_id,
    p_ACT_HDR_ID :  req.activity_hdr_id,
    p_modified_on   : req.modified_on,
    p_modified_by   : req.modified_by,
    p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
  };
  parameters.query = `BEGIN REP_ACTIVITY_DTL_REMOVE(:p_REPORT_ID,:p_ACT_HDR_ID,:p_modified_on,
    :p_modified_by,:p_error_code); END;` ;

 database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
    if(err){
      return res(err,null);
    } else {
      removeactivity_subdtl(req,res);
    }
  });
}

function removeactivity_subdtl(req,res) {
  var parameters = {};
  parameters.params = {
    p_REPORT_ID     : req.report_id,
    p_ACT_HDR_ID :  req.activity_hdr_id,
    p_modified_on   : req.modified_on,
    p_modified_by   : req.modified_by,
    p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
  };
  parameters.query = `BEGIN REP_ACTIVITY_SDTL_REMOVE(:p_REPORT_ID,:p_ACT_HDR_ID,:p_modified_on,
    :p_modified_by,:p_error_code); END;` ;

 database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
    if(err){
      return res(err,null);
    } else {
      return res(null,result);
    }
  });
}
function createForm(req,res) {
  var parameters = {};
  parameters.params = {
    p_REPORT_ID     : req.report_id,
    p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
  };
  parameters.query = `BEGIN MONTHLY_FORM_CREATE(:p_REPORT_ID,:p_error_code); END;` ;

 database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
    if(err){
      return res(err,null);
    } else {
      createbuildings(req,res);
    }
  });
}
function createbuildings(req,res) {
  var parameters = {};
  console.log('Came here')
  parameters.params = {
    p_REPORT_ID     : req.report_id,
    p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
  };
  parameters.query = `BEGIN REP_BUILDINGS_UPDATE(:p_REPORT_ID,:p_error_code); END;` ;

 database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
    if(err){
      return res(err,null);
    } else {
      return res(null,result);
    }
  });
}



module.exports = {
  getAllReportsList,
  getAllLocationList,
  getBuildingsList,
  get_activity_hdr,
  get_activity_dtl,
  get_activity_sdtl,
  getProcessPro_Form,
  createreportname,
  createactivity,
  getactivities,
  removeactivities,
  createForm,
};

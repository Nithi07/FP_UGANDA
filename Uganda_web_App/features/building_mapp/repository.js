
const oracledb = require('oracledb');
const database = require('../../db/index');


async function getAllBuildingUserList(req, res) {
    
    let params = {  
      query : `BEGIN WEB_BUILD_USER_LIST(:p_building_code,:result_set); END;`,
      params : {
          p_building_code:req.query.building_code ? req.query.building_code : null, 
          result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
      } 
  };
  database.GetDataStoreProcedure(params,function(err,result){ 
    if(err){
      return res(err,null);
    } else {
      return res(null,result);
    } 
  });
  }


  
async function updateBuildingUserList(req, res) {
   
    let params = {  
      query : `BEGIN WEB_BUILD_USER_UPD(:p_building_code,:p_uid,:p_status,:p_error_code); END;`,
      params : {
          p_building_code:req.body.building_code ? req.body.building_code : null, 
          p_uid:req.body.userid ? req.body.userid : null, 
          p_status:req.body.status ? req.body.status : null, 
          p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
      } 
  };
  database.InsertDataWithGetInsertIdStoreProcedure(params,function(err,result){
    if(err){
      return res(err,null);
    } else {
      req.Comment_id = result.p_error_code;
      return res(null,result);
    }
});
  }

module.exports = {
    getAllBuildingUserList,
    updateBuildingUserList
  };
  
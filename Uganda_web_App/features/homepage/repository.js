
const oracledb = require('oracledb');
const database = require('../../db/index');

async function GetAllUserwiseFormList(req,res){
  let params = {
     query : `BEGIN GET_USER_SIDEBAR_FORM_LIST(:result_set); END;`,
         params : {
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

module.exports = {
  GetAllUserwiseFormList
};

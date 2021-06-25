const oracledb = require('oracledb');
const database = require('../../db/index');


async function createUser(req,res) {

  var parameters = {};
    parameters.params = { 
      p_USER_FIRST_NAME     : req.name ? req.name : null,
      p_USER_LAST_NAME      : req.lname ? req.lname : null,
      p_user_mobile         : req.mobile_no ? req.mobile_no : null,
      p_user_login_name     : req.username ? req.username : null,
      p_user_password       : req.password ? req.password : null,
      p_user_email          : req.email ? req.email:null,
      p_is_active           : 0,
      p_created_on          : req.created_on ? req.created_on :null,
      p_modified_on         : req.modified_on ? req.modified_on :null,
      p_error_code          : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT},
      p_user_info_id        : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
    };
    parameters.query = `BEGIN MOB_USER_INFO_INSERT(:p_USER_FIRST_NAME,:p_USER_LAST_NAME,:p_user_mobile,:p_user_login_name,
      :p_user_password,:p_user_email,:p_is_active,:p_created_on,:p_modified_on,
      :p_error_code,:p_user_info_id); END;` ;
    
   database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
      if(err){
        return res(err,null);
      } else {
        req.p_user_info_id = result.p_user_info_id;
        req.p_error_code = result.p_error_code;
        return res(null,result.p_error_code);
      }
  });

  // const hashedPass = await bcrypt.hash(password, 5);
  // const [user] = await knex('users')
  //   .insert({
  //     name,
  //     email,
  //     password: hashedPass,
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //     email_verified_at: new Date(),
  //   })
  //   .returning(['email', 'name']);
  // return user;
}

module.exports = {
  createUser,
};

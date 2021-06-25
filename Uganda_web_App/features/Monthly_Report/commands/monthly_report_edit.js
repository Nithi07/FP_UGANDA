const registerRepo = require('../repository');
const registerRepo_Edit = require('../repository_edit');
var moment = require('moment');


async function Edit_Form_Page(req, res) {
  var ID = req.params.id;
  var PNAME = req.params.pname;
  var LocID = req.params.locid;
  console.log(ID,PNAME,LocID,'URL PARAMS');

  res.render('monthly_report/monthly_report_edit', {ID,PNAME,LocID,moment:moment,sidebar:global.homepage});
}

async function Get_Allactivites(req, res) {
  let data = {report_id:req.body.report_id}
  registerRepo.getactivities(data, function (err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
              console.log(result,'Returned Acti')
              registerRepo_Edit.getcount(data, function (err, result1) {
                if (err) {
                    console.log("Error:", err);
                } else {
                  console.log(result1,'Returned Count')
                  registerRepo_Edit.getbuildings(data, function (err, result2) {
                    if (err) {
                        console.log("Error:", err);
                    } else {
                      console.log(result2,"buildings")
                      registerRepo_Edit.GetUpdated_Activities(data, function (err, result3) {
                        if (err) {
                            console.log("Error:", err);
                        } else {
                          console.log(result3,'Returned Updated Activits')
                          registerRepo_Edit.getDates(data, function (err, result4) {
                            if (err) {
                                console.log("Error:", err);
                            } else {
                              console.log(result4,'Dates');
                              result.push(result2);
                              result.push(result1);
                              result.push(result3);
                              result.push(result4);
                              console.log(result,"Got it");
                              res.status('200').json(result);

                            }
                        });


                        }
                    });

                    }
                });

                }
            });
            }
        });

}
async function Update_NewActivities(req, res) {
  let data = {}
    data.table_data = JSON.parse(req.body.tdata)
    data.report_id = req.body.report_id
    data.location_id = req.body.location_id
    data.modified_by = req.user.USER_INFO_ID
    data.modified_on = moment().format("DD-MMM-YYYY,h:mm:ss a");

      registerRepo_Edit.Update_NewactivityHDR(data, function (err, result) {
                  if (err) {
                      console.log("Error:", err);
                  } else {
                    res.status('200').json(result);
                  }
              });
    }




module.exports = {
  Edit_Form_Page,
  Get_Allactivites,
  Update_NewActivities


};

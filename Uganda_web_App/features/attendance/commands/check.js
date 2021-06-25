async function dailyreport(req, res) {


  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  var dayName = days[new Date().getDay()];

  var today = moment().format("DD-MMM-YY");

  var attend_dtl = [];
  var data = [];
  console.log("came at 1st");
  registerRepo.getAllUserAttendance(req,function(err,result1){
    if (err) {
        console.log("Error:", err);
    }else{
      attend_dtl = result1
      console.log("came at 1st")
      registerRepo.getAllProjectMembersList(req,function(err,result2){
        if (err) {
            console.log("Error:", err);
        }else{
          console.log("came at 2nd");
            for (let j = 0; j < attend_dtl.length; j++){

              for (let i = 0; i < result2.length; i++) {

                if (result2[i].WEEKEND_1 == dayName || result2[i].WEEKEND_2 == dayName){

                  data.push({USER_NAME:result2[i].USER_INFO_ID,USER_INFO_ID:result2[i].USER_INFO_ID,ATTEND_DATE:today,
                  CHECKIN_DATE:'WeekEnd',CHECKOUT_DATE:'WeekEnd',STATUS:'WeekEnd'})
                  }else if ((result2[i].USER_INFO_ID==attend_dtl[j].USER_INFO_ID)&&(result2[i].ATTEND_DATE==today)){
                    let entry =moment(attend_dtl[j].CHECKIN_DATE).format("hh:mm a");
                    let exit = moment(attend_dtl[j].CHECKOUT_DATE).format("hh:mm a");
                    let check_in1 = moment(entry, "hh:mm a");
                    let check_out1 = moment(exit, "hh:mm a");
                    let check_in2;
                    let check_out2;
                    let buffer;
                    let status;
                    attend_dtl[j].CHECKIN = check_in1
                    attend_dtl[j].CHECKOUT = check_out1

                    if (attend_dtl[j].CHECKOUT_DATE == null || attend_dtl[j].CHECKIN_DATE == null || attend_dtl[j].CHECKIN_LOCATION == null) {
                      attend_dtl[j].USER_NAME=result2[i].USER_INFO_ID
                      attend_dtl[j].STATUS = ''
                      attend_dtl[j].CHECKOUT_DATE = ''
                      attend_dtl[j].CHECKOUT = ''
                      attend_dtl[j].CHECKOUT_LOCATION = ''
                      data.push(attend_dtl[j])
                      continue;
                    }

                    if(result2[i].START_TIME!=null){
                      console.log('startime not_null');
                      check_in2 = moment(result2[i].START_TIME, "hh:mm a");
                      check_out2 = moment(result2[i].END_TIME, "hh:mm a");
                      console.log(check_out2,'check_out2');
                      buffer = result2[i].BUFFER
                    }else if(result2[i].MRG_START_TIME!=null){
                      console.log('startime null')
                      check_in2 = moment(result2[i].MRG_START_TIME,"hh:mm a");
                      check_out2 = moment(result2[i].EVG_END_TIME,"hh:mm a");
                      buffer = result2[i].BUFFER
                    }

                    // calculation for diff of checkin hours
                    var cal_checkin = Math.abs(check_in2 - check_in1);
                    var m1 = cal_checkin / (1000 * 60); //for mins
                    // var checkin_diff_hr = (Math.floor(m1 / 60) + ':' + m1 % 60);

                    // calculation for diff of checkout hours
                    var cal_checkout = Math.abs(check_out2 - check_out1);
                    var m2 = cal_checkout / (1000 * 60); //for mins
                    // var checkout_diff_hr = (Math.floor(m2 / 60) + ':' + m2 % 60);
                    console.log(m2,'m2');
                    var cin1_slice = check_in1._i;
                    console.log(cin1_slice,'cinslice1');
                    var cin2_slice = check_in2._i;
                    console.log(cin2_slice,'cinslice2');
                    var cout1_slice = check_out1._i;
                    var cout2_slice = check_out2._i;
                    console.log(cout1_slice.split(":"),'split');

                    // conditions For Assign Status
                    if((m1+m2 >buffer)&&(Number(cin1_slice.split(":")[0])>=Number(cin2_slice.split(":")[0]))&&(Number(cout1_slice.split(":")[0])<Number(cout2_slice.split(":")[0]))){
                      status='Present(Late)'
                    }
                    else if ((m1 > buffer)&&(Number(cin1_slice.split(":")[0])>=Number(cin2_slice.split(":")[0]))){

                      status='Present(Late)'
                    }else if ((m2 > buffer)&&(Number(cout1_slice.split(":")[0])<Number(cout2_slice.split(":")[0]))){
                      console.log(cout1_slice.split(":")[0],cout2_slice.split(":")[0])
                      console.log('early')
                      status='Present(Late)'

                    }
                    else{
                      status='Present'
                    }

                    result[i].STATUS = status
                    data.push(result[i])


                  }else if((result2[i].USER_INFO_ID==attend_dtl[j].USER_INFO_ID)&&(result2[i].ATTEND_DATE==today)){
                    data.push({USER_NAME:result2[i].USER_INFO_ID,USER_INFO_ID:result2[i].USER_INFO_ID,ATTEND_DATE:today,
                      CHECKIN_DATE:'Absent',CHECKOUT_DATE:'Absent',STATUS:'Absent'})
                  } //LINE 56 ENDS HERE

              }
            }
          res.render('attendance/filteredmonthwise', {data:data,moment:moment})
        }
      });
    }
  });
}

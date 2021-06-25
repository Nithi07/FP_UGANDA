
const { append } = require('joi/lib/types/object');
const moment = require('moment');
var calendar = require('node-calendar');
var twix = require('twix'); //for getting dates btw 2 dates
var _ = require('underscore');


const passport = require('passport');
const registerRepo = require('../repository');

//funtion for getting dates between 2 dates
// async function daterange(fromdate,todate){
//   var itr = moment.twix(new Date(fromdate),new Date(todate)).iterate("days");
//   var range=[];
//   while(itr.hasNext()){
//       range.push(itr.next().format("DD-MMM-YY"))
//   }
//   console.log(range);
//   return range;

// }


async function reportspage(req, res) {

    res.render('attendance/reportmain',{sidebar:global.homepage});
  }


  //myPromise.then(
async function Attendance(req,res,mode,req_or_data){
    if (mode == "Daily"){
      var attn_date = [moment().format("DD-MMM-YY")];
      var rep_fun = registerRepo.getAllUserAttendance
      var render_path = 'attendance/dailyreport'

    } else if(mode=="Monthly"){

      //funtion for getting dates between 2 dates
      var itr = moment.twix(new Date(req_or_data.from_date),new Date(req_or_data.to_date)).iterate("days");
      var attn_date=[];
      while(itr.hasNext()){
        attn_date.push(itr.next().format("DD-MMM-YY"))
      }
      // --------------------------------------------
      var rep_fun = registerRepo.getMonthlyUserAttendance
      var render_path = 'attendance/filteredmonthwise'
    }else if(mode=="Late"){
      var itr = moment.twix(new Date(req_or_data.from_date),new Date(req_or_data.to_date)).iterate("days");
      var attn_date=[];
      var rep_fun = registerRepo.getLateUserAttendance
      var render_path = 'attendance/filteredlate'
      while(itr.hasNext()){
        attn_date.push(itr.next().format("DD-MMM-YY"))
    }
  }


    var attend_dtl = [];

    var data = [];
    rep_fun(req_or_data,function(err,result1){
      if (err) {
          console.log("Error:", err);
      }else{
        attend_dtl = result1

        registerRepo.getAllProjectMembersList(req,function(err,result2){
          if (err) {
              console.log("Error:", err);
          }else{

           for (let i = 0; i < result2.length; i++) {

            for (let k = 0; k < attn_date.length; k++){

              var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
              var dayName = days[new Date(attn_date[k]).getDay()];

            if ((result2[i].WEEKEND1 == dayName) || (result2[i].WEEKEND2 == dayName)){
              if (mode!="Late"){
              data.push({USERNAME:result2[i].USERNAME,USER_INFO_ID:result2[i].USER_INFO_ID,ATTEND_DATE:attn_date[k],
              CHECKIN_DATE:'',CHECKOUT_DATE:'',STATUS:'WeekEnd',CHECKIN:'',CHECKOUT:''})}
              }else{
                let count = 0;
                for (let j = 0; j < attend_dtl.length; j++){

                  var atdn = moment(attend_dtl[j].ATTEND_DATE).format('DD-MMM-YY')


                  if ((result2[i].USER_INFO_ID==attend_dtl[j].USER_INFO_ID)&&(atdn==attn_date[k])){
                    count += 1;

                    if (attend_dtl[j].IS_CHECKED_OUT == 0 ) {
                      attend_dtl[j].STATUS = ''
                      attend_dtl[j].CHECKOUT_DATE = ''
                      attend_dtl[j].CHECKOUT = ''
                      attend_dtl[j].CHECKIN = moment(attend_dtl[j].CHECKIN_DATE,"hh:mm a");
                      attend_dtl[j].CHECKOUT_LOCATION = ''
                      attend_dtl[j].ATTEND_DATE = attn_date[k]
                      data.push(attend_dtl[j])
                      break;
                    }else{
                      let entry =moment(attend_dtl[j].CHECKIN_DATE).format("hh:mm a");
                      let exit = moment(attend_dtl[j].CHECKOUT_DATE).format("hh:mm a");
                      let check_in1 = moment(entry, "hh:mm a");
                      let check_out1 = moment(exit, "hh:mm a");
                      let check_in2;
                      let check_out2;
                      let buffer;
                      let status;
                      let tot_req_mins;
                      attend_dtl[j].CHECKIN =  check_in1
                      attend_dtl[j].CHECKOUT =  check_out1

                      if(result2[i].START_TIME!=null){
                        // console.log('startime not_null');
                        check_in2 = moment(result2[i].START_TIME, "hh:mm a");
                        check_out2 = moment(result2[i].END_TIME, "hh:mm a");
                        buffer = result2[i].BUFFER
                        var cal_req_time = Math.abs(check_in2 - check_out2);
                        var tot_mins = cal_req_time / (1000 * 60);
                        tot_req_mins = tot_mins
                      }else if(result2[i].MRG_START_TIME!=null){
                        // console.log('startime null')
                        check_in2 = moment(result2[i].MRG_START_TIME,"hh:mm a");
                        check_out2 = moment(result2[i].EVG_END_TIME,"hh:mm a");
                        buffer = result2[i].BUFFER
                        var mrg_end = moment(result2[i].MRG_END_TIME,"hh:mm a");
                        var evg_start = moment(result2[i].EVG_START_TIME,"hh:mm a");
                        check_in2 = moment(result2[i].MRG_START_TIME,"hh:mm a");
                        check_out2 = moment(result2[i].EVG_END_TIME,"hh:mm a");
                        buffer = result2[i].BUFFER
                        //For 1st half
                        var cal_req_time1 = Math.abs(mrg_end-check_in2);
                        var req_min1 = cal_req_time1 / (1000 * 60);
                        //For 2nd half
                        var cal_req_time2 = Math.abs(check_out2 - evg_start);
                        var req_min2 = cal_req_time2 / (1000 * 60);
                        var tot_mins = req_min1 + req_min2 - buffer;
                        tot_req_mins = tot_mins
                      }

                      // calculation for diff of checkin hours
                      var cal_checkin = Math.abs(check_in2 - check_in1);
                      var m1 = cal_checkin / (1000 * 60); //for mins
                      var checkin_diff_hr = (Math.floor(m1 / 60) + ':' + m1 % 60);

                      // calculation for diff of checkout hours
                      var cal_checkout = Math.abs(check_out2 - check_out1);
                      var m2 = cal_checkout / (1000 * 60); //for mins
                      var checkout_diff_hr = (Math.floor(m2 / 60) + ':' + m2 % 60);
                      var cin1_slice = check_in1._i;
                      var cin2_slice = check_in2._i;
                      var cout1_slice = check_out1._i;
                      var cout2_slice = check_out2._i;


                      // calculation for tot working hours
                      var cal_wrk_hrs = Math.abs(check_out1 - check_in1);
                      var cal_wrk_min = cal_wrk_hrs / (1000 * 60); //for mins
                      var tot_wrk_hrs = cal_wrk_min

                      // conditions For Assign Status
                      if ((tot_wrk_hrs<tot_req_mins)){
                        // console.log(tot_req_mins,'Total Required mins');
                        // console.log(tot_wrk_hrs,'Total Required hrs');
                        if (Number(cin1_slice.split(":")[0])>=Number(cin2_slice.split(":")[0])){
                          attend_dtl[j].MRG_LATE ="+" + checkin_diff_hr
                        }
                        attend_dtl[j].EVG_EARLY = "-" + checkout_diff_hr
                        status='Present(Late)'
                      }
                      else if((m1+m2 >buffer)&&(Number(cin1_slice.split(":")[0])>=Number(cin2_slice.split(":")[0]))&&(Number(cout1_slice.split(":")[0])<Number(cout2_slice.split(":")[0]))){
                        status='Present(Late)'
                        attend_dtl[j].MRG_LATE = "+" + checkin_diff_hr
                        attend_dtl[j].EVG_EARLY = "-" + checkout_diff_hr
                      }
                      else if ((m1 > buffer)&&(Number(cin1_slice.split(":")[0])>=Number(cin2_slice.split(":")[0]))){

                        status='Present(Late)'
                        attend_dtl[j].MRG_LATE = '+' + checkin_diff_hr
                        attend_dtl[j].EVG_EARLY ="-" + 0
                      }else if ((m2 > buffer)&&(Number(cout1_slice.split(":")[0])<Number(cout2_slice.split(":")[0]))){

                        status='Present(Late)'
                        attend_dtl[j].MRG_LATE ="+" + 0
                        attend_dtl[j].EVG_EARLY = "-" + checkout_diff_hr

                      }
                      else{
                        status='Present'
                      }

                      if(mode=="Late"){
                        if (status=="Present(Late)"){
                          // attend_dtl[j].STATUS = status
                          attend_dtl[j].ATTEND_DATE = attn_date[k]
                          data.push(attend_dtl[j])
                          break;
                        }
                      }else{
                        attend_dtl[j].STATUS = status
                        attend_dtl[j].ATTEND_DATE = attn_date[k]
                        data.push(attend_dtl[j])
                        break;
                      }

                    }

                  }
                }
                if (count==0 && mode!="Late") {
                  data.push({USERNAME:result2[i].USERNAME,USER_INFO_ID:result2[i].USER_INFO_ID,ATTEND_DATE:attn_date[k],
                    CHECKIN_DATE:'',CHECKOUT_DATE:'',STATUS:'Absent',CHECKIN:'',CHECKOUT:''})

                }else{count *= 0 && mode != "Late"}
              }
           }
          }
          var sortedObjs = _.sortBy( data, 'ATTEND_DATE' ); //Sorted Objects

           res.render(render_path,{data:sortedObjs,moment:moment,sidebar:global.homepage});
          }
        });
      }
    });
  }


async function AttendanceID(req, res, mode, datas) {

  if (mode=="Empwise"){
   //funtion for getting dates between 2 dates
  var itr = moment.twix(new Date(datas.from_date),new Date(datas.to_date)).iterate("days");
  var attn_date=[];
  while(itr.hasNext()){
    attn_date.push(itr.next().format("DD-MMM-YY"))
  }
  // ----------------------------------------------
  var repo_func = registerRepo.getEmpWiseAttendance
  var render_path = 'attendance/filteredempwise'
  }else if(mode=="Late"){
    var itr = moment.twix(new Date(datas.from_date),new Date(datas.to_date)).iterate("days");
    var attn_date=[];
    var repo_func = registerRepo.getLateUserAttendance
    var render_path = 'attendance/filteredlate'
    while(itr.hasNext()){
      attn_date.push(itr.next().format("DD-MMM-YY"))
  }
}
  var attend_dtl = [];
  var data = [];
  repo_func(datas,function(err,result1){
      if (err) {
          console.log("Error:", err);
      }else{
        attend_dtl = result1

        registerRepo.getAllProjectMembersList(req,function(err,result2){
          if (err) {
              console.log("Error:", err);
          }else{

           for (let i = 0; i < result2.length; i++) {
            if (datas.emp_id == result2[i].USER_INFO_ID){
            for (let k = 0; k < attn_date.length; k++){

              var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
              var dayName = days[new Date(attn_date[k]).getDay()];

            if ((result2[i].WEEKEND1 == dayName) || (result2[i].WEEKEND2 == dayName)  ){
              // console.log(mode,'MODE')
               //if want weekend need to remove AND if condition
               if (mode!="Late"){

                data.push({USERNAME:result2[i].USERNAME,USER_INFO_ID:result2[i].USER_INFO_ID,ATTEND_DATE:attn_date[k],
                CHECKIN_DATE:'',CHECKOUT_DATE:'',STATUS:'WeekEnd',CHECKIN:'',CHECKOUT:''})}
                }else{
                  let count = 0;
                  for (let j = 0; j < attend_dtl.length; j++){
                    var atdn = moment(attend_dtl[j].ATTEND_DATE).format('DD-MMM-YY')

                    if ((result2[i].USER_INFO_ID==attend_dtl[j].USER_INFO_ID)&&(atdn==attn_date[k])){

                      count += 1;
                      if (attend_dtl[j].IS_CHECKED_OUT == 0 ) {
                        attend_dtl[j].STATUS = ''
                        attend_dtl[j].CHECKOUT_DATE = ''
                        attend_dtl[j].CHECKOUT = ''
                        attend_dtl[j].CHECKIN = moment(attend_dtl[j].CHECKIN_DATE,"hh:mm a");
                        attend_dtl[j].CHECKOUT_LOCATION = ''
                        attend_dtl[j].ATTEND_DATE = attn_date[k]

                        data.push(attend_dtl[j])
                        break;
                      }else{
                        let entry =moment(attend_dtl[j].CHECKIN_DATE).format("hh:mm a");
                        let exit = moment(attend_dtl[j].CHECKOUT_DATE).format("hh:mm a");
                        let check_in1 = moment(entry, "hh:mm a");
                        let check_out1 = moment(exit, "hh:mm a");
                        let check_in2;
                        let check_out2;
                        let buffer;
                        let status;
                        let tot_req_mins;
                        attend_dtl[j].CHECKIN =  check_in1
                        attend_dtl[j].CHECKOUT =  check_out1

                        if(result2[i].START_TIME!=null){
                          // console.log('startime not_null');
                          check_in2 = moment(result2[i].START_TIME, "hh:mm a");
                          check_out2 = moment(result2[i].END_TIME, "hh:mm a");
                          buffer = result2[i].BUFFER
                          var cal_req_time = Math.abs(check_in2 - check_out2);
                          var tot_mins = cal_req_time / (1000 * 60);
                          tot_req_mins = tot_mins
                        }else if(result2[i].MRG_START_TIME!=null){
                          // console.log('startime null')
                          var mrg_end = moment(result2[i].MRG_END_TIME,"hh:mm a");
                          var evg_start = moment(result2[i].EVG_START_TIME,"hh:mm a");
                          check_in2 = moment(result2[i].MRG_START_TIME,"hh:mm a");
                          check_out2 = moment(result2[i].EVG_END_TIME,"hh:mm a");
                          buffer = result2[i].BUFFER
                          //For 1st half
                          var cal_req_time1 = Math.abs(mrg_end-check_in2);
                          var req_min1 = cal_req_time1 / (1000 * 60);
                          //For 2nd half
                          var cal_req_time2 = Math.abs(check_out2 - evg_start);
                          var req_min2 = cal_req_time2 / (1000 * 60);
                          var tot_mins = req_min1 + req_min2 - buffer;
                          tot_req_mins = tot_mins
                        }

                        // calculation for diff of checkin hours
                        var cal_checkin = Math.abs(check_in2 - check_in1);
                        var m1 = cal_checkin / (1000 * 60); //for mins
                        var checkin_diff_hr = (Math.floor(m1 / 60) + ':' + m1 % 60);

                        // calculation for diff of checkout hours
                        var cal_checkout = Math.abs(check_out2 - check_out1);
                        var m2 = cal_checkout / (1000 * 60); //for mins
                        var checkout_diff_hr = (Math.floor(m2 / 60) + ':' + m2 % 60);

                        // calculation for tot working hours
                        var cal_wrk_hrs = Math.abs(check_out1 - check_in1);
                        var cal_wrk_min = cal_wrk_hrs / (1000 * 60); //for mins
                        var tot_wrk_hrs = cal_wrk_min


                        // calculation for total hours of working
                        var cin1_slice = check_in1._i;
                        var cin2_slice = check_in2._i;
                        var cout1_slice = check_out1._i;
                        var cout2_slice = check_out2._i;


                        // conditions For Assign Status
                        if ((tot_wrk_hrs<tot_req_mins)){
                          // console.log(tot_req_mins,'Total Required mins');
                          // console.log(tot_wrk_hrs,'Total Required hrs');
                          if (Number(cin1_slice.split(":")[0])>=Number(cin2_slice.split(":")[0])){
                            attend_dtl[j].MRG_LATE = "+" + checkin_diff_hr
                          }
                          attend_dtl[j].EVG_EARLY = "-" + checkout_diff_hr
                          status='Present(Late)'
                        }
                        else if((m1+m2 >buffer)&&(Number(cin1_slice.split(":")[0])>=Number(cin2_slice.split(":")[0]))&&(Number(cout1_slice.split(":")[0])<Number(cout2_slice.split(":")[0]))){
                          status='Present(Late)'
                          attend_dtl[j].MRG_LATE ="+" + checkin_diff_hr
                          attend_dtl[j].EVG_EARLY ="-" + checkout_diff_hr
                        }
                        else if ((m1 > buffer)&&(Number(cin1_slice.split(":")[0])>=Number(cin2_slice.split(":")[0]))){

                          status='Present(Late)'
                          attend_dtl[j].MRG_LATE = "+" + checkin_diff_hr
                          attend_dtl[j].EVG_EARLY ="-" + 0
                        }else if ((m2 > buffer)&&(Number(cout1_slice.split(":")[0])<Number(cout2_slice.split(":")[0]))){

                          status='Present(Late)'
                          attend_dtl[j].MRG_LATE ="+" + 0
                          attend_dtl[j].EVG_EARLY = '-' + checkout_diff_hr
                        }
                        else{
                          status='Present'
                        }
                        if(mode=="Late"){
                          if (status=="Present(Late)"){
                            // attend_dtl[j].STATUS = status
                            attend_dtl[j].ATTEND_DATE = attn_date[k]
                            data.push(attend_dtl[j])
                            break;
                          }
                        }else{
                          attend_dtl[j].STATUS = status
                          attend_dtl[j].ATTEND_DATE = attn_date[k]
                          data.push(attend_dtl[j])
                          break;
                        }


                      }

                    }
                  }
                  if (count==0 && mode != "Late") {
                    data.push({USERNAME:result2[i].USERNAME,USER_INFO_ID:result2[i].USER_INFO_ID,ATTEND_DATE:attn_date[k],
                      CHECKIN_DATE:'',CHECKOUT_DATE:'',STATUS:'Absent',CHECKIN:'',CHECKOUT:''})

                  }else{count *= 0}
                }
            }
            break;}
          }  var sortedObjs = _.sortBy( data, 'ATTEND_DATE' ); //Sorted Objects
            res.render(render_path,{data:sortedObjs,moment:moment,sidebar:global.homepage});
            }
          });
        }
      });
  }


  async function DailyReports(req,res){
    Attendance(req,res,"Daily",req)
  }

  async function monthlyreportform(req, res) {
    res.render('attendance/monthlyreport',{moment:moment,sidebar:global.homepage});
  }

  async function MonthlyReports(req,res){
    var from_date = req.body.from_date;
    var to_date = req.body.to_date;
    let datas ={};
      datas.from_date  = moment(from_date).format("DD-MMM-YY");
      datas.to_date    = moment(to_date).format("DD-MMM-YY");
    Attendance(req,res,"Monthly",datas)
  }


  async function empwisereportform(req, res) {
    res.render('attendance/empwisereport',{moment:moment,sidebar:global.homepage});
  }


async function EmpwiseReports (req,res){
  var from_date = req.body.from_date;
  var to_date = req.body.to_date;
  var emp_id = req.body.emp_id;
  let datas ={};
  datas.emp_id = emp_id;
  datas.from_date  = moment(from_date).format("DD-MMM-YY"); //moment().format("DD-MMM-YYYY,h:mm:ss a");
  datas.to_date    = moment(to_date).format("DD-MMM-YY");

  AttendanceID(req,res,"Empwise",datas)
}

async function latereportform(req, res) {
  res.render('attendance/latereport',{moment:moment,sidebar:global.homepage});
}
async function LateReport(req, res) {
  var from_date = req.body.from_date;
  var to_date = req.body.to_date;
  var emp_id = req.body.emp_id;
  let datas ={};
      datas.emp_id = emp_id;
      datas.from_date  = moment(from_date).format("DD-MMM-YY"); //moment().format("DD-MMM-YYYY,h:mm:ss a");
      datas.to_date    = moment(to_date).format("DD-MMM-YY");
  if(emp_id!=""){
    AttendanceID(req,res,"Late",datas)
  }else{
    Attendance(req,res,"Late",datas)
  }
}


module.exports ={
  reportspage,
  monthlyreportform,
  MonthlyReports,
  DailyReports,
  EmpwiseReports,
  empwisereportform,
  latereportform,
  LateReport
};

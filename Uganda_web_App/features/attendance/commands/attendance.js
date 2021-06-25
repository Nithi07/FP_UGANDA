
const { append } = require('joi/lib/types/object');
const moment = require('moment');
var calendar = require('node-calendar');
var twix = require('twix');

const passport = require('passport');
const registerRepo = require('../repository');


async function daterange(fromdate,todate){
  var itr = moment.twix(new Date(fromdate),new Date(todate)).iterate("days");
  var range=[];
  while(itr.hasNext()){
      range.push(itr.next().format("DD-MMM-YY"))
  }
  console.log(range);
  return range;

}
async function reportspage(req, res) {

  // var start = moment("11:58 pm", "hh:mm a");
  // var end = moment("12:03 pm", "hh:mm a");
  // var ch = start._i
  // console.log(ch.slice(0,2),'slice');
  // if (ch.slice(0,2)>="12"){
  //   console.log('start is big');
  // }else {
  //   console.log('end is big');
  // }
  // var diffInMs = Math.abs(end - start);
  // var hours = diffInMs / (1000 * 60); //for mins
  // var hours = diffInhrs / (1000 * 60 * 60) //for hours
  // if (Number('09')==Number('9')){
  //   console.log('true');
  // }else{
  //   console.log('false')
  // }

  // console.log(hours,'Diff mins');
    res.render('attendance/reportmain');
  }

async function dailyreport(req, res) {
  var shifts = [];
  var shifts_length = 0;
  var data = [];
  registerRepo.getAllShiftSettingList(req,async function(err,result1){
    if (err) {
        console.log("Error:", err);
    }else{
      console.log(result1,'Shifts');
      shifts_length += result1.length
      shifts.push(result1);
      registerRepo.getAllUserAttendance(req,async function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
// console.log('f2------------------------')
          for (let i = 0; i < result.length; i++) {
            let entry =moment(result[i].CHECKIN_DATE).format("hh:mm a");
            let exit = moment(result[i].CHECKOUT_DATE).format("hh:mm a");
            let check_in1 = moment(entry, "hh:mm a");
            let check_out1 = moment(exit, "hh:mm a");
            let check_in2;
            let check_out2;
            let buffer;
            let status;
            result[i].CHECKIN = check_in1
            result[i].CHECKOUT = check_out1
            //below change checkout condition in future
            if (result[i].CHECKOUT_DATE == null || result[i].CHECKIN_DATE == null || result[i].CHECKIN_LOCATION == null) {
              result[i].STATUS = 'Pending'
              result[i].CHECKOUT_DATE = 'Not Checked Out'
              result[i].CHECKOUT = 'Not Checked Out'
              result[i].CHECKOUT_LOCATION = 'Not Checked Out'
              data.push(result[i])
              continue;
            }

            for (let j = 0; j < shifts_length; j++) {
              var shifts_list = shifts[0]
              if (result[i].CHECKIN_LOCATION == shifts_list[j].LOCATION_NAME){
                if(shifts_list[j].START_TIME!=null){
                  console.log('startime not_null');
                  check_in2 = moment(shifts_list[j].START_TIME, "hh:mm a");
                  check_out2 = moment(shifts_list[j].END_TIME, "hh:mm a");
                  console.log(check_out2,'check_out2');
                  buffer = shifts_list[j].BUFFER
                }else if(shifts_list[j].MRG_START_TIME!=null){
                  console.log('startime null')
                  check_in2 = moment(shifts_list[j].MRG_START_TIME,"hh:mm a");
                  check_out2 = moment(shifts_list[j].EVG_END_TIME,"hh:mm a");
                  buffer = shifts_list[j].BUFFER
                }break;
              }
            }
            var cal_checkin = Math.abs(check_in2 - check_in1);
            var m1 = cal_checkin / (1000 * 60); //for mins
            console.log(m1,'m1');
            var cal_checkout = Math.abs(check_out2 - check_out1);
            var m2 = cal_checkout / (1000 * 60); //for mins
            console.log(m2,'m2');
            var cin1_slice = check_in1._i;
            console.log(cin1_slice,'cinslice1');
            var cin2_slice = check_in2._i;
            console.log(cin2_slice,'cinslice2');
            var cout1_slice = check_out1._i;
            var cout2_slice = check_out2._i;
            if ((m1 > buffer)&&(Number(cin1_slice.slice(0,2))>=Number(cin2_slice.slice(0,1)))){
              console.log(cin1_slice.slice(0,2),cin2_slice.slice(0,1))
              status='Present(Late)'
            }else if ((m2 > buffer)&&(Number(cout1_slice.slice(0,2))<Number(cout2_slice.slice(0,1)))){
              console.log(cout1_slice.slice(0,2),cout2_slice.slice(0,1))
              status='Present(Late)'
            }else{
              status='Present'
            }
            result[i].STATUS = status
            data.push(result[i])
            }

          res.render('attendance/dailyreport',{data:data,moment:moment});
        }
      })
    }
  });
  //myPromise.then(
  //   function() {registerRepo.getAllUserAttendance();},

  // );

  //);



}
async function dailyreportdata(req, res) {
  console.log('Entered Dta sec')
  registerRepo.getAllUserAttendance(req,function(err,result){
    if (err) {
        console.log("Error:", err);
    }else{
      res.status('200').json(result);
    }
  });
}


async function monthlyreport(req, res) {
  res.render('attendance/monthlyreport',{moment:moment});
}
async function monthlyfilter(req, res) {
  console.log(req.user.ORG,"ORG........")
  var from_date = req.body.from_date;
  var to_date = req.body.to_date;
  // var range = daterange(from_date,to_date);
  // console.log(range,'range????????????????????s')
  // console.log(from_date,'from date function')
  let datas ={};
    datas.from_date  = moment(from_date).format("DD-MMM-YY");
    datas.to_date    = moment(to_date).format("DD-MMM-YY");
  var shifts = [];
  var shifts_length = 0;
  var data = [];

  //For comparing location Purpose for checkin checkout so we get all shiftime settings
  registerRepo.getAllShiftSettingList(req,async function(err,result1){
    if (err) {
        console.log("Error:", err);
    }else{
      console.log(result1,'Shifts');
      shifts_length += result1.length
      shifts.push(result1);
      registerRepo.getMonthlyUserAttendance(datas,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
          for (let i = 0; i < result.length; i++) {
            let entry =moment(result[i].CHECKIN_DATE).format("hh:mm a");
            let exit = moment(result[i].CHECKOUT_DATE).format("hh:mm a");
            let check_in1 = moment(entry, "hh:mm a");
            let check_out1 = moment(exit, "hh:mm a");
            let check_in2;
            let check_out2;
            let buffer;
            let status;
            result[i].CHECKIN = check_in1
            result[i].CHECKOUT = check_out1
            //below change checkout condition in future
            if (result[i].CHECKOUT_DATE == null || result[i].CHECKIN_DATE == null || result[i].CHECKIN_LOCATION == null) {
              result[i].STATUS = ''
              result[i].CHECKOUT_DATE = 'Not Checked Out'
              result[i].CHECKOUT = 'Not Checked Out'
              result[i].CHECKOUT_LOCATION = 'Not Checked Out'
              data.push(result[i])
              continue;
            }

            for (let j = 0; j < shifts_length; j++) {
              var shifts_list = shifts[0]
              if (result[i].CHECKIN_LOCATION == shifts_list[j].LOCATION_NAME){
                if(shifts_list[j].START_TIME!=null){
                  console.log('startime not_null');
                  check_in2 = moment(shifts_list[j].START_TIME, "hh:mm a");
                  check_out2 = moment(shifts_list[j].END_TIME, "hh:mm a");
                  console.log(check_out2,'check_out2');
                  buffer = shifts_list[j].BUFFER
                }else if(shifts_list[j].MRG_START_TIME!=null){
                  console.log('startime null')
                  check_in2 = moment(shifts_list[j].MRG_START_TIME,"hh:mm a");
                  check_out2 = moment(shifts_list[j].EVG_END_TIME,"hh:mm a");
                  buffer = shifts_list[j].BUFFER
                }break;
              }
            }
            var cal_checkin = Math.abs(check_in2 - check_in1);
            var m1 = cal_checkin / (1000 * 60); //for mins
            console.log(m1,'m1');
            var cal_checkout = Math.abs(check_out2 - check_out1);
            var m2 = cal_checkout / (1000 * 60); //for mins
            console.log(m2,'m2');
            var cin1_slice = check_in1._i;
            console.log(cin1_slice,'cinslice1');
            var cin2_slice = check_in2._i;
            console.log(cin2_slice,'cinslice2');
            var cout1_slice = check_out1._i;
            var cout2_slice = check_out2._i;
            if ((m1 > buffer)&&(Number(cin1_slice.slice(0,2))>=Number(cin2_slice.slice(0,1)))){
              console.log(cin1_slice.slice(0,2),cin2_slice.slice(0,1))
              status='Present(Late)'
            }else if ((m2 > buffer)&&(Number(cout1_slice.slice(0,2))<Number(cout2_slice.slice(0,1)))){
              console.log(cout1_slice.slice(0,2),cout2_slice.slice(0,1))
              status='Present(Late)'
            }else{
              status='Present'
            }
            result[i].STATUS = status
            data.push(result[i])
            }

          res.render('attendance/filteredmonthwise', {data:data,moment:moment})
        }
      })
    }
  });
}

async function latereport(req, res) {
  res.render('attendance/latereport',{moment:moment});
}
async function latereportfilter(req, res) {
  var from_date = req.body.from_date;
  var to_date = req.body.to_date;
  let datas ={};
      datas.emp_id = req.body.emp_id;
      datas.from_date  = moment(from_date).format("DD-MMM-YY"); //moment().format("DD-MMM-YYYY,h:mm:ss a");
      datas.to_date    = moment(to_date).format("DD-MMM-YY");

  var shifts = [];
  var shifts_length = 0;
  var data = [];

  //For comparing location Purpose for checkin checkout so we get all shiftime settings
  registerRepo.getAllShiftSettingList(req,async function(err,result1){
    if (err) {
        console.log("Error:", err);
    }else{
      console.log(result1,'Shifts');
      shifts_length += result1.length
      shifts.push(result1);
      registerRepo.getLateUserAttendance(datas,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
          for (let i = 0; i < result.length; i++) {
            let entry =moment(result[i].CHECKIN_DATE).format("hh:mm a");
            let exit = moment(result[i].CHECKOUT_DATE).format("hh:mm a");
            let check_in1 = moment(entry, "hh:mm a");
            let check_out1 = moment(exit, "hh:mm a");
            let check_in2;
            let check_out2;
            let buffer;
            let status;
            result[i].CHECKIN = check_in1
            result[i].CHECKOUT = check_out1
            //below change checkout condition in future
            if (result[i].CHECKOUT_DATE == null || result[i].CHECKIN_DATE == null || result[i].CHECKIN_LOCATION == null) {
              result[i].STATUS = 'Pending'
              result[i].CHECKOUT_DATE = 'Not Checked Out'
              result[i].CHECKOUT = 'Not Checked Out'
              result[i].CHECKOUT_LOCATION = 'Not Checked Out'
              data.push(result[i])
              continue;
            }

            for (let j = 0; j < shifts_length; j++) {
              var shifts_list = shifts[0]
              if (result[i].CHECKIN_LOCATION == shifts_list[j].LOCATION_NAME){
                if(shifts_list[j].START_TIME!=null){
                  console.log('startime not_null');
                  check_in2 = moment(shifts_list[j].START_TIME, "hh:mm a");
                  check_out2 = moment(shifts_list[j].END_TIME, "hh:mm a");
                  console.log(check_out2,'check_out2');
                  buffer = shifts_list[j].BUFFER
                }else if(shifts_list[j].MRG_START_TIME!=null){
                  console.log('startime null')
                  check_in2 = moment(shifts_list[j].MRG_START_TIME,"hh:mm a");
                  check_out2 = moment(shifts_list[j].EVG_END_TIME,"hh:mm a");
                  buffer = shifts_list[j].BUFFER
                }break;
              }
            }
            // calculation for diff of checkin hours
            var cal_checkin = Math.abs(check_in2 - check_in1);
            var m1 = cal_checkin / (1000 * 60); //for mins
            var checkin_diff_hr = (Math.floor(m1 / 60) + ':' + m1 % 60);

            // calculation for diff of checkout hours
            var cal_checkout = Math.abs(check_out2 - check_out1);
            var m2 = cal_checkout / (1000 * 60); //for mins
            var checkout_diff_hr = (Math.floor(m2 / 60) + ':' + m2 % 60);
            console.log(m2,'m2');
            var cin1_slice = check_in1._i;
            console.log(cin1_slice,'cinslice1');
            var cin2_slice = check_in2._i;
            console.log(cin2_slice,'cinslice2');
            var cout1_slice = check_out1._i;
            var cout2_slice = check_out2._i;
            console.log(cout1_slice.split(":"),'split');
            if((m1+m2 >buffer)&&(Number(cin1_slice.split(":")[0])>=Number(cin2_slice.split(":")[0]))&&(Number(cout1_slice.split(":")[0])<Number(cout2_slice.split(":")[0]))){
              status='Present(Late)'
              result[i].MRG_LATE = checkin_diff_hr
              result[i].EVG_EARLY = checkout_diff_hr
            }
            else if ((m1 > buffer)&&(Number(cin1_slice.split(":")[0])>=Number(cin2_slice.split(":")[0]))){
              // console.log(cin1_slice.split(":")[0],cin2_slice.split(":")[0])
              // console.log('late')
              result[i].MRG_LATE = checkin_diff_hr
              result[i].EVG_EARLY = 0
              status='Present(Late)'
            }else if ((m2 > buffer)&&(Number(cout1_slice.split(":")[0])<Number(cout2_slice.split(":")[0]))){
              console.log(cout1_slice.split(":")[0],cout2_slice.split(":")[0])
              console.log('early')
              status='Present(Late)'
              result[i].MRG_LATE = 0
              result[i].EVG_EARLY = checkout_diff_hr
            }

            else{
              status='Present'
            }

            if (status=='Present(Late)'){
              console.log('Yesssssssssssss')
              data.push(result[i])
            }else{
              continue;
            }

            }

          res.render('attendance/filteredlate', {data:data,moment:moment})
        }
      })
    }
  });
}


async function empwisereport(req, res) {
  res.render('attendance/empwisereport',{moment:moment});
}
async function empwisereportfilter(req, res) {
  // console.log(req.body.from_date,'>>>>>>>>>>>>');
  var from_date = req.body.from_date;
  var to_date = req.body.to_date;
  var emp_id = req.body.emp_id;
  let datas ={};
  datas.emp_id = emp_id;
  datas.from_date  = moment(from_date).format("DD-MMM-YY"); //moment().format("DD-MMM-YYYY,h:mm:ss a");
  datas.to_date    = moment(to_date).format("DD-MMM-YY");
  // console.log('Enteerrrr');

  var shifts = [];
  var shifts_length = 0;
  var data = [];
  registerRepo.getAllShiftSettingList(req,async function(err,result1){
    if (err) {
        console.log("Error:", err);
    }else{
      console.log(result1,'Shifts');
      shifts_length += result1.length
      shifts.push(result1);
      registerRepo.getEmpWiseAttendance(datas,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
          for (let i = 0; i < result.length; i++) {
            let entry =moment(result[i].CHECKIN_DATE).format("hh:mm a");
            let exit = moment(result[i].CHECKOUT_DATE).format("hh:mm a");
            let check_in1 = moment(entry, "hh:mm a");
            let check_out1 = moment(exit, "hh:mm a");
            let check_in2;
            let check_out2;
            let buffer;
            let status;
            result[i].CHECKIN = check_in1
            result[i].CHECKOUT = check_out1
            //below change checkout condition in future
            if (result[i].CHECKOUT_DATE == null || result[i].CHECKIN_DATE == null || result[i].CHECKIN_LOCATION == null) {
              result[i].STATUS = 'Pending'
              result[i].CHECKOUT_DATE = 'Not Checked Out'
              result[i].CHECKOUT = 'Not Checked Out'
              result[i].CHECKOUT_LOCATION = 'Not Checked Out'
              data.push(result[i])
              continue;
            }

            for (let j = 0; j < shifts_length; j++) {
              var shifts_list = shifts[0]
              if (result[i].CHECKIN_LOCATION == shifts_list[j].LOCATION_NAME){
                if(shifts_list[j].START_TIME!=null){
                  console.log('startime not_null');
                  check_in2 = moment(shifts_list[j].START_TIME, "hh:mm a");
                  check_out2 = moment(shifts_list[j].END_TIME, "hh:mm a");
                  console.log(check_out2,'check_out2');
                  buffer = shifts_list[j].BUFFER
                }else if(shifts_list[j].MRG_START_TIME!=null){
                  console.log('startime null')
                  check_in2 = moment(shifts_list[j].MRG_START_TIME,"hh:mm a");
                  check_out2 = moment(shifts_list[j].EVG_END_TIME,"hh:mm a");
                  buffer = shifts_list[j].BUFFER
                }break;
              }
            }
            var cal_checkin = Math.abs(check_in2 - check_in1);
            var m1 = cal_checkin / (1000 * 60); //for mins
            console.log(m1,'m1');
            var cal_checkout = Math.abs(check_out2 - check_out1);
            var m2 = cal_checkout / (1000 * 60); //for mins
            console.log(m2,'m2');
            var cin1_slice = check_in1._i;
            console.log(cin1_slice,'cinslice1');
            var cin2_slice = check_in2._i;
            console.log(cin2_slice,'cinslice2');
            var cout1_slice = check_out1._i;
            var cout2_slice = check_out2._i;
            if ((m1 > buffer)&&(Number(cin1_slice.slice(0,2))>=Number(cin2_slice.slice(0,1)))){
              console.log(cin1_slice.slice(0,2),cin2_slice.slice(0,1))
              status='Present(Late)'
            }else if ((m2 > buffer)&&(Number(cout1_slice.slice(0,2))<Number(cout2_slice.slice(0,1)))){
              console.log(cout1_slice.slice(0,2),cout2_slice.slice(0,1))
              status='Present(Late)'
            }else{
              status='Present'
            }
            result[i].STATUS = status
            data.push(result[i])
            }

          res.render('attendance/filteredempwise', {data:data,moment:moment})
        }
      })
    }
  });
}



function test(req,res){
  res.render('test/test')
}

module.exports ={
  reportspage,
  dailyreport,
  monthlyreport,
  monthlyfilter,
  dailyreportdata,
  latereport,
  latereportfilter,
  empwisereport,
  empwisereportfilter

};

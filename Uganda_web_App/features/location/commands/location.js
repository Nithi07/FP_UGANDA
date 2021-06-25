const registerRepo = require('../repository');
var moment = require('moment');

async function locationlist(req, res) {
  // 11.088571799198974, 77.18426592080824
  // if (15 > 11.091098669316432 && 15.12344572848942 <= 15.12344572848942){
  //   console.log('yes');
  // }else{
  //   console.log('No')
  // }
    registerRepo.getAllLocationList(req, function (err, result) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('location/listlocation', { data: result,moment:moment,sidebar:global.homepage});
        }
    });
}
async function locationshow(req, res) {
    res.render('location/get_location',{sidebar:global.homepage});
}

async function googleapi(req, res) {
    res.render('pages/googleapi');
}
async function getlocation(req, res) {
  let lat2 = parseFloat(req.body.latitude);
  let lon2 = parseFloat(req.body.longitude);
  let exact_location = {};
  // console.log(latitude,'Float');
  // console.log(parseInt(req.body.latitude),'Int');

    registerRepo.getAllLocationList(req, function (err, result) {
        if (err) {
            console.log("Error:", err);
        } else {
            for (i=0; i<result.length;i++) {
              let lat1 = parseFloat(result[i].LATITUDE);
              let lon1 = parseFloat(result[i].LONGITUDE);
              var p = 0.017453292519943295;    // Math.PI / 180
              var c = Math.cos;
              var a = 0.5 - c((lat2 - lat1) * p)/2 +
                      c(lat1 * p) * c(lat2 * p) *
                      (1 - c((lon2 - lon1) * p))/2;

              var distance = 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
              var km_to_mtr = distance * 1000
              if (km_to_mtr <= result[i].DISTANCE_COVERAGE){
                exact_location.location_name = result[i].LOCATION_NAME
                exact_location.id = result[i].LOCATION_ID
                exact_location.LATITUDE = result[i].LATITUDE
                exact_location.Distance = km_to_mtr
                break;
              }
              // console.log(exact_location,'exct loc');
              // let lat = parseFloat(result[i].LATITUDE);
              // let lat_new = parseFloat(result[i].NEW_LATITUDE);
              // let lon = parseFloat(result[i].LONGITUDE);
              // let lon_new = parseFloat(result[i].NEW_LONGITUDE);
              // // console.log(lat,'db la')
              // if ((latitude >= lat && latitude <= lat_new)&&(longitude >= lon && longitude <= lon_new)){
              //   exact_location.location_name = result[i].LOCATION_NAME
              //   exact_location.id = result[i].LOCATION_ID
              //   exact_location.LATITUDE = result[i].LATITUDE

              // }
            }
            res.status('200').json(exact_location);

        }

    });
}

async function InsertLocation(req, res) {

  var earth = 6378.137; //radius of the earth in kilometer
  let pi = Math.PI;
  console.log(pi,'PI')
  let m = (1 / ((2 * pi / 360) * earth)) / 1000;  //1 meter in degree

  var new_latitude = parseFloat(req.body.latitude) + (parseInt(req.body.coverage_distance) * m);
  // console.log(new_latitude,"latitude");
  // 11.092563523002568, 77.16927268521268

  var earth2 = 6378.137;  //radius of the earth in kilometer
  var pi2 = Math.PI;
  var cos = Math.cos;
  m2 = (1 / ((2 * pi2 / 360) * earth2)) / 1000;  //1 meter in degree

  var new_longitude = parseFloat(req.body.longitude) + (parseInt(req.body.coverage_distance) * m2) / cos(parseFloat(req.body.latitude) * (pi2 / 180));
  // console.log(new_longitude,"longi");

  // if (11.092563523002568 <= 11.09705737761593 <= new_latitude){
  //   console.log('yes');
  // }else{
  //   console.log('No')
  // }

  // console.log(req.body.coverage_distance,':coverage');
  // console.log(req.body.site_input,':checkbox');
  let data = {};
  data.location_name = req.body.location_name;
  data.latitude = req.body.latitude;
  data.longitude = req.body.longitude;
  data.new_latitude = new_latitude + "";
  data.new_longitude = new_longitude + "";
  data.distance_coverage = req.body.coverage_distance;
  data.site=    req.body.site_input;
  data.created_by = req.user.USER_INFO_ID;
  data.modified_on = moment().format("DD-MMM-YYYY,h:mm:ss a");
  data.created_on = moment().format("DD-MMM-YYYY,h:mm:ss a");
  // console.log(data.new_latitude,'data_new_lanti');
    // console.log('Enddd');
    registerRepo.GetInsertLocation(data, function (err, result) {
      if (err) {
          console.log("Error:", err);
      } else {
        res.status('200').json(result);
      }
  });
}

async function UpdateLocation(req, res) {
    var earth = 6378.137; //radius of the earth in kilometer
    let pi = Math.PI;
    console.log(pi,'PI')
    let m = (1 / ((2 * pi / 360) * earth)) / 1000;  //1 meter in degree

    var new_latitude = parseFloat(req.body.latitude) + (parseInt(req.body.coverage_distance) * m);
    console.log(new_latitude,"latitude");
    // 11.092563523002568, 77.16927268521268

    var earth2 = 6378.137;  //radius of the earth in kilometer
    var pi2 = Math.PI;
    var cos = Math.cos;
    m2 = (1 / ((2 * pi2 / 360) * earth2)) / 1000;  //1 meter in degree

    var new_longitude = parseFloat(req.body.longitude) + (parseInt(req.body.coverage_distance) * m2) / cos(parseFloat(req.body.latitude) * (pi2 / 180));
    console.log(new_longitude,"longi");

    let data = {};
    data.location_id = req.body.location_id;
    data.location_name = req.body.location_name;
    data.latitude = req.body.latitude;
    data.longitude = req.body.longitude;
    data.new_latitude = new_latitude + "";
    data.new_longitude = new_longitude + "";
    data.distance_coverage = req.body.coverage_distance;
    data.site=    req.body.site;
    data.modified_by = req.user.USER_INFO_ID;
    data.modified_on = moment().format("DD-MMM-YYYY,h:mm:ss a");

    registerRepo.GetUpdateLocation(data, function (err, result) {
        if (err) {
            console.log("Error:", err);
        } else {
          res.status('200').json(result);
        }
    });
}
async function DeleteLocation(req, res) {
    let data = {};
    data.location_id = req.body.location_id;
    data.modified_by = req.user.USER_INFO_ID;
    data.modified_on = moment().format("DD-MMM-YYYY,h:mm:ss a");

    registerRepo.GetDeleteLocation(data, function (err, result) {
      if (err) {
          console.log("Error:", err);
      } else {
        res.status('200').json(result);
      }
    });
}



module.exports = {
  locationlist,
  locationshow,
  getlocation,
  InsertLocation,
  UpdateLocation,
  DeleteLocation,
  googleapi

};

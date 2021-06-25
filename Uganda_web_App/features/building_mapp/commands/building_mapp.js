const registerRepo = require('../repository');
var moment = require('moment');
var moment = require('moment');



async function buildinglist(req, res) {
    console.log("inside building_mapp.js");
    res.render('pages/building_user_map',{data:null,sidebar:global.homepage});
  }

  async function getBuildings(req, res) {
    registerRepo.getAllBuildings(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
        }
    });
  }

  async function building_user(req, res) {

    console.log("inside building_user to fetch user") ;
    registerRepo.getAllBuildingUserList(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
        }
    });
  }

  async function update_building_user(req, res) {


    registerRepo.updateBuildingUserList(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
        }
    });
  }





module.exports ={
    buildinglist,
    getBuildings,
    building_user,
    update_building_user

};

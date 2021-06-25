const registerRepo = require('../repository');
var moment = require('moment');
var atob = require('atob');
var Blob = require('node-blob');

async function listdata(req, res) {

    registerRepo.list(req, function (err, result) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('pages/feedback', { data: result,moment:moment});
        }
    });
}

async function feedbackhistory(req, res) {

    registerRepo.getFeedbackHistory(req, function (err, result) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('partials/list', { data: result });
        }
    });
}



async function feedbackreplyinsert(req, res) {

    let data = {};
    data.feedback_id = req.body.feedback_id;
    data.comments = req.body.comments;
    data.created_by = req.user.USER_INFO_ID;
    data.modified_on = moment().format("DD-MMM-YYYY,h:mm:ss a");
    data.created_on = moment().format("DD-MMM-YYYY,h:mm:ss a");

    registerRepo.getInsertFeedbackReply(data, function (err, result) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.status('200').json(result);
        }
    });
}


async function newFeedbackinsert(req, res) {

    let data = {};
    data.comments = req.body.comments;
    data.created_by = req.user.USER_INFO_ID;
    data.modified_on = moment().format("DD-MMM-YYYY,h:mm:ss a");
    data.created_on = moment().format("DD-MMM-YYYY,h:mm:ss a");
    
    registerRepo.getInsertNewFeedback(data, function (err, result) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.status('200').json(result);
        }
    });
}


module.exports = {
    listdata,
    feedbackhistory,
    feedbackreplyinsert,
    newFeedbackinsert
};

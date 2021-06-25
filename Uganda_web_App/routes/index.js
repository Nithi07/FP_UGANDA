const express = require('express');

const router = express.Router();

const mountRegisterRoutes = require('../features/register/routes');
const mountLoginRoutes = require('../features/login/routes');
const mountLogoutRoutes = require('../features/logout/routes');
const mountResetPasswordRoutes = require('../features/reset-password/routes');
const mountProfileRoutes = require('../features/profile/routes');
const mountUserRoutes = require('../features/user_details/routes');
const mountUnitRoutes = require('../features/unit_details/routes');
const mountProjectRoutes = require('../features/project_updates/routes');
const mountPaymentRoutes = require('../features/payment_details/routes');
const mountAnnouncementRoutes = require('../features/announcement/routes');
const mountNotificationRoutes = require('../features/Notification/routes');

var Homepage = require("../features/homepage/commands/homepage")
var UserDetails = require("../features/user_details/commands/userdata");
var UnitDetails = require("../features/unit_details/commands/unit");
var ProjectUpdates = require("../features/project_updates/commands/project_updates");
var PaymentDetails = require("../features/payment_details/commands/payment_details");
var FeedbackDetails = require("../features/feedback/commands/feedback");
var announcements = require("../features/announcement/commands/announcement");
var Notifications = require("../features/Notification/commands/notification");

var NoteDetails = require("../features/note_details/commands/note_details");
var Building = require("../features/building_mapp/commands/building_mapp");
var Attendance = require("../features/attendance/commands/attendance");
var Attendance2 = require("../features/attendance/commands/attend");

var Location = require("../features/location/commands/location")
var ShiftSetting = require("../features/shiftime_setting/commands/shiftime_setting")
var Project_member = require("../features/project_team_members/commands/project_members")

var ProjectProgress = require("../features/Project_Progress/commands/project_progress")
var ProjectEdit = require("../features/Project_Progress/commands/project_edit")

var MonthlyReport = require("../features/Monthly_Report/commands/monthly_report")
var MonthlyReport_Edit = require("../features/Monthly_Report/commands/monthly_report_edit")

function isAuthenticated(req, res, next) {
  if (req.user && req.isAuthenticated()) {
    return next();
  }else{

    return res.redirect('/login');

  }
}

/* GET home page. */
router.get('/', isAuthenticated, (req, res) => {
  Homepage.userwiseformslist(req, res);
});
/* GET home page Lable Count. */
router.get('/Getlablecount', isAuthenticated, (req, res) => {
  UserDetails.lablecount(req, res);
});

/* Get User list */
router.get('/User_Details', isAuthenticated, (req, res) => {
  UserDetails.listdata(req, res);
});
/* Active User */
router.get('/User_Details/active/:id', isAuthenticated, (req, res) => {
  UserDetails.useractive(req, res);
});
/* Delete User */
router.get('/User_Details/delete/:id', isAuthenticated, (req, res) => {
  UserDetails.userdelete(req, res);
});

/* User Update */
router.post('/User_Details/updateuser', isAuthenticated, (req, res) => {
  UserDetails.updateuser(req, res);
});

/* Assign Units */
router.get('/User_Details/Assign_Unit/:id', isAuthenticated, (req, res) => {
  UserDetails.AssignUnits(req, res);
});
/* Get user Assigned Forms */
router.get('/User_Details/Assign_Forms/:id', isAuthenticated, (req, res) => {
  UserDetails.GetForms_Userwise(req, res);
});

/* Add Forms Userwise */
router.post('/User_Details/AddFormlist_Userwise', isAuthenticated, (req, res) => {
  UserDetails.AddForms_Userwise(req, res);
});

/* Assign Form Delete*/
router.post('/User_Details/deleteform/:id/:user_id', isAuthenticated, (req, res) => {
  UserDetails.DeleteForms_Userwise(req, res);
});
/* Assign Unit Delete*/
router.post('/User_Details/deleteunit/:id/:user_id', isAuthenticated, (req, res) => {
  UserDetails.unitdelete(req, res);
});

/* Assign Unit Save*/
router.post('/User_Details/unitsave', isAuthenticated, (req, res) => {
  UserDetails.unitsave(req, res);
});

/* Assign Payment Details list*/
router.post('/User_Details/paymentlist', isAuthenticated, (req, res) => {
  UserDetails.paymentlist(req, res);
});

/* Assign Payment Details Save*/
router.post('/User_Details/paymentsave', isAuthenticated, (req, res) => {
  UserDetails.paymentsave(req, res);
});

/* Unit Details */
router.get('/unit_details', isAuthenticated, (req, res) => {
  UnitDetails.listdata(req, res);
});

/* Unit file save */
router.post('/unit_details/filesave', isAuthenticated, (req, res) => {
  UnitDetails.filesave(req, res);
});






/* Unit Get files */
router.post('/unit_details/getfiles', isAuthenticated, (req, res) => {
  UnitDetails.getfiles(req, res);
});

/* Project Updates */
router.get('/project_updates', isAuthenticated, (req, res) => {
  ProjectUpdates.listdata(req, res);
});

/* Project Updates Building wise */
router.post('/project_updates/buildingwise', isAuthenticated, (req, res) => {
  ProjectUpdates.buildingwise(req, res);
});

/* Project Updates Date wise */
router.post('/project_updates/datewise', isAuthenticated, (req, res) => {
  ProjectUpdates.datewise(req, res);
});

/* Project Updates save */
router.post('/project_updates/save', isAuthenticated, (req, res) => {
  ProjectUpdates.save(req, res);
});

/* Payment Details */
router.get('/payment_details', isAuthenticated, (req, res) => {
  PaymentDetails.list(req, res);
});


/* Payment Details */
router.post('/payment_details/filelist', isAuthenticated, (req, res) => {
  PaymentDetails.payment_file_list(req, res);
});

/* Payment Details */
router.post('/payment_details/unitwise', isAuthenticated, (req, res) => {
  PaymentDetails.payment_unitwise(req, res);
});

/* announcements */
router.get('/announcements', isAuthenticated, (req, res) => {
  announcements.Announcementdata(req, res);
});

/* announcements Save*/
router.post('/announcements/announcementsave', isAuthenticated, (req, res) => {
  announcements.announcementsave(req, res);
});

/* announcements File List*/
router.post('/announcements/filelist', isAuthenticated, (req, res) => {
  announcements.filelist(req, res);
});


/* Note Details */
router.get('/note_details/note_category', isAuthenticated, (req, res) => {
  NoteDetails.listCategory(req, res);
});

/* Note Details */
router.post('/note_details/getreminder', isAuthenticated, (req, res) => {
  NoteDetails.getReminderById(req, res);
});






/* Note Details */
router.get('/note_details', isAuthenticated, (req, res) => {
  NoteDetails.notedetails(req, res);
 });
 /* Note Details */
router.get('/note_details/list', isAuthenticated, (req, res) => {
  NoteDetails.list(req, res);
 });


router.get('/note_details/report', isAuthenticated, (req, res) => {
  NoteDetails.getreportlist(req, res);
 });

 router.get('/note_details/note_buildings', isAuthenticated, (req, res) => {
  NoteDetails.getBuildings(req, res);
 });
 router.get('/note_details/note_unit', isAuthenticated, (req, res) => {
  NoteDetails.getAllUnit(req, res);
 });

 router.get('/note_details/note_users', isAuthenticated, (req, res) => {
  NoteDetails.getAllUser(req, res);
 });

/* Note file save */
router.post('/note_details/filesave', isAuthenticated, (req, res) => {
  NoteDetails.filesave(req, res);
});

/* Note Details */
router.post('/note_details/filelist', isAuthenticated, (req, res) => {
  NoteDetails.note_file_list(req, res);
});


/* Note Details */
router.post('/note_details/commentlist', isAuthenticated, (req, res) => {
  NoteDetails.note_commentlist(req, res);
});

/* Note Details */
router.post('/note_details/updReminder', isAuthenticated, (req, res) => {
  NoteDetails.note_updateReminder(req, res);
});







/* Feedback Reply Insert*/
router.post('/note_details/savenewcomment', isAuthenticated, (req, res) => {

  NoteDetails.newCommentinsert(req, res);
});


 /* building mapping Details */
 router.get('/building_mapping', isAuthenticated, (req, res) => {
    Building.buildinglist(req, res);
  });


/* building mapping Details */
router.get('/building_mapp/building_user', isAuthenticated, (req, res) => {
    Building.building_user(req, res);
  });

 /* building mapping Details */
router.post('/building_mapp/update_building_user', isAuthenticated, (req, res) => {
    Building.update_building_user(req, res);
  });




/* Get Feedback list */
router.get('/feedback', isAuthenticated, (req, res) => {
  FeedbackDetails.listdata(req, res);
});

/* Getting Feedback History*/
router.post('/feedbackhistory', isAuthenticated, (req, res) => {
  FeedbackDetails.feedbackhistory(req, res);
});

/* Feedback Reply Insert*/
router.post('/feedback/savereplycomment', isAuthenticated, (req, res) => {
  FeedbackDetails.feedbackreplyinsert(req, res);
});

/* Feedback Reply Insert*/
router.post('/feedback/savenewcomment', isAuthenticated, (req, res) => {
  FeedbackDetails.newFeedbackinsert(req, res);
});

/* Get notifications list */
router.get('/notifications', isAuthenticated, (req, res) => {
  Notifications.listdata(req, res);
});

/* Get notifications update */
router.get('/notifications/update/:id', isAuthenticated, (req, res) => {
  Notifications.update(req, res);
});


//Location
router.get('/location', isAuthenticated, (req, res) => {
  Location.locationlist(req, res);
});

router.get('/location/showlocation', isAuthenticated, (req, res) => {
  Location.locationshow(req, res);
});
router.post('/location/getlocation', isAuthenticated, (req, res) => {
  Location.getlocation(req, res);
});
// Google Api
router.get('/location/googleapi', isAuthenticated, (req, res) => {
  Location.googleapi(req, res);
});

router.post('/location/savelocation', isAuthenticated, (req, res) => {
  Location.InsertLocation(req, res);
});

router.post('/location/editlocation', isAuthenticated, (req, res) => {
  Location.UpdateLocation(req, res);
});

router.post('/location/deletelocation', isAuthenticated, (req, res) => {
  Location.DeleteLocation(req, res);
});

//Shift Time Setting
router.get('/shiftime_setting', isAuthenticated, (req, res) => {
  ShiftSetting.shiftime_setting_list(req, res);
});

router.post('/shiftime_setting/saveshift', isAuthenticated, (req, res) => {
  ShiftSetting.InsertShift(req, res);
});

router.post('/shiftime_setting/editshift', isAuthenticated, (req, res) => {
  ShiftSetting.UpdateShift(req, res);
});

router.post('/shiftime_setting/deleteshift', isAuthenticated, (req, res) => {
  ShiftSetting.DeleteShift(req, res);
});

//Project Team members
router.get('/project_team_members', isAuthenticated, (req, res) => {
  Project_member.project_members_list(req, res);
});

router.post('/project_team_members/saveprojecteam', isAuthenticated, (req, res) => {
  Project_member.InsertProjectMembers(req, res);
});

// router.post('/shiftime_setting/editshift', isAuthenticated, (req, res) => {
//   Project_member.UpdateShift(req, res);
// });

// router.post('/shiftime_setting/deleteshift', isAuthenticated, (req, res) => {
//   Project_member.DeleteShift(req, res);
// });


// Attendance
router.get('/attendance', isAuthenticated, (req, res) => {
  Attendance.reportspage(req, res);
});

router.post('/test', isAuthenticated, (req, res) => {
  Attendance.test(req, res);
});

router.get('/attendance2', isAuthenticated, (req, res) => {
  Attendance2.reportspage(req, res);
});

router.get('/attendance2/daily_report', isAuthenticated, (req, res) => {
  Attendance2.DailyReports(req, res);
});

router.get('/attendance/monthly_report', isAuthenticated, (req, res) => {
  Attendance2.monthlyreportform(req, res);
});
router.post('/attendance/monthly_report/monthfilter', isAuthenticated, (req, res) => {
  Attendance2.MonthlyReports(req, res);
});
        // late Report
router.get('/attendance/late_report', isAuthenticated, (req, res) => {
  Attendance2.latereportform(req, res);
});
router.post('/attendance/late_report/latefilter', isAuthenticated, (req, res) => {
  Attendance2.LateReport(req, res);
});
      //Emp wise Report
router.get('/attendance/emp_wise_report', isAuthenticated, (req, res) => {
  Attendance2.empwisereportform(req, res);
});
router.post('/attendance/emp_wise_report/employeefilter', isAuthenticated, (req, res) => {
  Attendance2.EmpwiseReports(req, res);
});


//Project Progress

router.get('/project_Progress', isAuthenticated, (req, res) => {
  ProjectProgress.Project_ProgressForm(req, res);
});
router.post('/project_Progress/buildings_list', isAuthenticated, (req, res) => {
  ProjectProgress.GetBuildingsList(req, res);
});
router.get('/project_Progress/create_project', isAuthenticated, (req, res) => {
  ProjectProgress.CreateProject(req, res);
});
router.post('/project_Progress/activity_dtl_list', isAuthenticated, (req, res) => {
  ProjectProgress.Activity_Dtl(req, res);
});
router.post('/project_Progress/lenth_of_subdtl', isAuthenticated, (req, res) => {
  ProjectProgress.Find_lenth_Subdtl(req, res);
});
// router.post('/project_Progress/get_projectpro_form', isAuthenticated, (req, res) => {
//   ProjectProgress.GetProject_Proform(req, res);
// });

router.post('/project_Progress/activity_subdtl_list', isAuthenticated, (req, res) => {
  ProjectProgress.Activity_SubDtl(req, res);
});
router.post('/project_Progress/insert_project_name', isAuthenticated, (req, res) => {
  ProjectProgress.Add_ProjectName(req, res);
});
router.post('/project_Progress/insert_activity', isAuthenticated, (req, res) => {
  ProjectProgress.Add_Activity(req, res);
});
router.post('/project_Progress/get_activities', isAuthenticated, (req, res) => {
  ProjectProgress.Get_Activities(req, res);
});
router.post('/project_Progress/remove_activity', isAuthenticated, (req, res) => {
  ProjectProgress.Remove_Activities(req, res);
});
router.post('/project_Progress/create_form', isAuthenticated, (req, res) => {
  ProjectProgress.Create_Form(req, res);
});

            // redirect project_edit
router.get('/project_Progress/edit_form_page/:id/:pname/:locid', isAuthenticated, (req, res) => {
  ProjectEdit.Edit_Form_Page(req, res);
});
router.post('/project_Progress/edit_form_page/get_activites', isAuthenticated, (req, res) => {
  ProjectEdit.Get_Allactivites(req, res);
});
router.post('/project_Progress/edit_form_page/update_activity', isAuthenticated, (req, res) => {
  ProjectEdit.Update_NewActivities(req, res);
});


//Monthly Report

router.get('/monthly_report', isAuthenticated, (req, res) => {
  MonthlyReport.Monthly_Report_List(req, res);
});
// router.post('/project_Progress/buildings_list', isAuthenticated, (req, res) => {
//   MonthlyReport.GetBuildingsList(req, res);
// });
router.get('/monthly_report/create_report', isAuthenticated, (req, res) => {
  MonthlyReport.CreateReport(req, res);
});
// router.post('/project_Progress/activity_dtl_list', isAuthenticated, (req, res) => {
//   MonthlyReport.Activity_Dtl(req, res);
// });
// router.post('/project_Progress/lenth_of_subdtl', isAuthenticated, (req, res) => {
//   MonthlyReport.Find_lenth_Subdtl(req, res);
// });

// router.post('/project_Progress/activity_subdtl_list', isAuthenticated, (req, res) => {
//   MonthlyReport.Activity_SubDtl(req, res);
// });
router.post('/monthly_report/insert_report_name', isAuthenticated, (req, res) => {
  MonthlyReport.Add_ReportName(req, res);
});
router.post('/monthly_report/insert_activity', isAuthenticated, (req, res) => {
  MonthlyReport.Add_Activity(req, res);
});
router.post('/monthly_report/get_activities', isAuthenticated, (req, res) => {
  MonthlyReport.Get_Activities(req, res);
});
router.post('/monthly_report/remove_activity', isAuthenticated, (req, res) => {
  MonthlyReport.Remove_Activities(req, res);
});
router.post('/monthly_report/create_form', isAuthenticated, (req, res) => {
  MonthlyReport.Create_Form(req, res);
});

            // redirect project_edit
router.get('/monthly_report/edit_form_page/:id/:pname/:locid', isAuthenticated, (req, res) => {
  MonthlyReport_Edit.Edit_Form_Page(req, res);
});
router.post('/monthly_report/edit_form_page/get_activites', isAuthenticated, (req, res) => {
  MonthlyReport_Edit.Get_Allactivites(req, res);
});
router.post('/monthly_report/edit_form_page/update_activity', isAuthenticated, (req, res) => {
  MonthlyReport_Edit.Update_NewActivities(req, res);
});




mountRegisterRoutes(router);
mountLoginRoutes(router);
mountLogoutRoutes(router, [isAuthenticated]);
mountResetPasswordRoutes(router);
mountProfileRoutes(router, [isAuthenticated]);
mountUserRoutes(router, [isAuthenticated]);
mountUnitRoutes(router, [isAuthenticated]);
mountProjectRoutes(router, [isAuthenticated]);
mountPaymentRoutes(router, [isAuthenticated]);
mountAnnouncementRoutes(router, [isAuthenticated]);
mountNotificationRoutes(router, [isAuthenticated]);
module.exports = router;

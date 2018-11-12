// Script written by Hannah Strong <stronghannahc@gmail.com> for James Atkins, June 2018
// Last edited: November 12, 2018

// Script iterates over all specified folders, finds the CSV file containing the current date, and makes a google sheets copy of the CSV file if one doesn't already exist
// Set to run every morning between 7 and 8am Pacific time (5 and 6 Central) and then run every 5 minutes till it completes all brands or hits 30 cycles
// Whenc completed or timed out, it sends an email to the specified recipient(s) stating which worked and which failed




// This function is used to for the timed trigger to run every morning
// Resets the counter property and starts a minutes-based trigger to check for csv files periodically
function launch() {
  
  // Set number of iterations to check before declaring the script complete even if not all files are there and stores as userProperty to use as counter across times the trigger runs
  var stopPoint = 30;
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('timeoutCounter', stopPoint);
  var timeoutCounter = Number(userProperties.getProperty('timeoutCounter'));
  Logger.log("Starting timeout counter is " + timeoutCounter);
  
  createMinuteTrigger(5);
  emailStart();
  
}


//Initiate conversion with this function
function CSVtoGsheet(){
  
  //
  // CHANGE FOLDER IDS AND BRANDS HERE
  //
  var folders = [
    //["Amazon", "139uxTSFeemdBkN78R23KM1QdeMLP3j5P",],
    ["CVS", "1Xee8JJfmcFsL8Hsp2ZS-cTAqtUOlv0RX",],
    ["HEB", "1PIkyp8SQsYBxJxm2CVeDIuiDQtlsyO_f",],
    ["Target", "1oqOFUkFvchU3nLcivoniyskmWHNjp3C_"],
    ["Walgreens", "1FHgHb-6BGF-wycHIMaxbm3pDpm8cPVZ_"],
    ["Walmart", "16Nkr392QgxgD5NuRFb44yA1HyjkRkZX6"]
  ];
  var completed = [];
  var failed = [];
  
  
  //Finds current date and formats to match dates in CSV filenames
  var curDateRaw = new Date();
  var curDate = Utilities.formatDate(curDateRaw, 'America/Los_Angeles', ' yyyy-MMM-dd');
  
  
  for each (var folder in folders) {
    

    //Find filename based on current date
    var name = folder[0] + curDate;
    Logger.log("name is " + name);
    
    //Check if CSV file with given name exists and get data, move on if it doesn't
    var csvData = checkFile(name);
    if(csvData) {
      if (!checkForGSheet(name)) {
        //Create sheet with this data, move it to the current folder
        createSS(name, folder[1], csvData);
      }
      completed.push(folder[0]);
    } else {
      failed.push(folder[0]);
    }
  }
  Logger.log("There are " + completed.length + " completed folders. They are: " + completed + "   and there are " + failed.length + " failed folders. They are: " +  failed);
  
  var userProperties = PropertiesService.getUserProperties();
  var timeoutCounter = Number(userProperties.getProperty('timeoutCounter')) - 1;
  userProperties.setProperty('timeoutCounter', timeoutCounter);
  Logger.log("timeout counter is: " + timeoutCounter);
  
  //Logger.log("failed length is " + failed.length());
  //Logger.log("failed length?" + failed + "[[[[[" + failed.length);
  
  
  if(failed.length == 0 || timeoutCounter == 0) {
     // Send email when script completes
     sendEmailSummary(completed, failed, curDate);
     resetTriggers()
     Logger.log("Finished");
  } else {
   Logger.log("Will take another pass."); 
  }
}





function createSS(name, folderId, csvData) {
  
  //Create new spreadsheet, set it as active
  var newSs = SpreadsheetApp.create(name);
  var sheet = SpreadsheetApp.open
  
  //Paste data from CSV file into new spreadsheet
  newSs.getActiveSheet().getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData)
  
  
  //Get the spreadsheet's ID and reference to the file in drive
  var fileId = newSs.getId();
  var newSsFile = DriveApp.getFileById(fileId);
  
  //Move the new file from root (where it's created) to the current folder
  var folder = DriveApp.getFolderById(folderId);
  newSsFile.getParents().next().removeFile(newSsFile);
  folder.addFile(newSsFile);
}





// Check if 1 or more CSV files with the given filename exist, returns the data from the most recently edited if any do
function checkFile(filename){
  var status = false;
  var csvData;
  var files  = DriveApp.getFilesByName(filename);
  
   while (files.hasNext()) {
     var file = files.next();
     var fileType = file.getMimeType();
     Logger.log("filetype is " + fileType);
     
     if (fileType == MimeType.CSV) {
       status = true;
       csvData = Utilities.parseCsv(file.getBlob().getDataAsString());
       break;
     }
 }
  Logger.log("File status is " + status);
  return csvData;
}





// Checks if google sheet already exists
function checkForGSheet(filename){
  var status = false;
  var files  = DriveApp.getFilesByName(filename);
  
   while (files.hasNext()) {
     var file = files.next();
     var fileType = file.getMimeType();
     Logger.log("Checking for gsheets, filetype is " + fileType);
     
     if (fileType == MimeType.GOOGLE_SHEETS) {
       status = true;
       break;
     }
 }
  Logger.log("gsheet status is " + status);
  return status;
}





function sendEmailSummary(completed, failed, date) {

  var emailAddress1 ="Jatkins@otcmeds.com";
  var emailAddress2 = "stronghannahc@gmail.com";
  
  var emailSubject = "CSV to Gsheet script completed - " + date;
  var emailBody = "The CSV to Google Sheets conversion has completed for" + date + ".\n\nThe following files were successfully converted: \n  • " + completed.join("\n  • ") + "\n\nThe following .csv files were not found: \n  • " + failed.join("\n  • ");
  //var data = ["Walmart", "Target", "HEB", "CVS"];
  
// MailApp.sendEmail(emailAddress1, emailSubject, emailBody, {
//     name: 'CSV to Google Sheet Conversion Script'
// });
 MailApp.sendEmail(emailAddress2, emailSubject, emailBody, {
     name: 'CSV to Google Sheet Conversion Script'
 });
}


function emailStart() {
  var emailAddress = "stronghannahc@gmail.com";
  
  var emailSubject = "CSV to Gsheet script started";
  var emailBody = "The script has begun"
  
 MailApp.sendEmail(emailAddress, emailSubject, emailBody, {
     name: 'CSV to Google Sheet Conversion Script'
 });
}





// Test function to run other functions with parameters
function runIt() {
  var testVar = checkFile("Test 2018-06-12");
  if (testVar) {
    Logger.log("yes" );
  }
}





function createMinuteTrigger(minutes) {
  
  //var minutes = 5
  
  // Trigger every 1 minutes.
  ScriptApp.newTrigger('CSVtoGsheet')
      .timeBased()
      .everyMinutes(minutes)
      .create();
}



//Deletes all triggers to remove any minutes based triggers, then creates a new daily trigger
function resetTriggers() {
  
  // Loop over all triggers and delete them
  var allTriggers = ScriptApp.getProjectTriggers();
  
  for (var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
  
  // Trigger every day between 7 and 8am Central time (5 to 6am Pacific)
  ScriptApp.newTrigger('launch')
      .timeBased()
      .everyDays(1)
      .atHour(7)
      .create();
  
  
  // Trigger every day between 1am and 2am Pacific time
  ScriptApp.newTrigger('DeleteOldFiles')
      .timeBased()
      .everyDays(1)
      .atHour(1)
      .create();
}





function doNothing(){
  //this function here for testing purposes so a trigger can easily be set to do nothing without deleting it
  Logger.log("nothing was done");
}
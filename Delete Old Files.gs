// Script written by Hannah Strong <stronghannahc@gmail.com> for James Atkins, November 2018
// Last edited: November 12, 2018

// Script iterates over all specified folders, finds the CSV file older than 2 weeks old and deletes them
// Set to run every night between midnight 1am Pacific timed 8am Pacific time
// When completed or timed out, it sends an email to the specified recipient(s)




function DeleteOldFiles() {
  //
  // CHANGE FOLDER IDS AND BRANDS HERE
  //
  var folders = [
    //["Amazon", "139uxTSFeemdBkN78R23KM1QdeMLP3j5P",],       // LEAVE AMAZON COMMENTED OUT EVEN WHEN YOU TURN ON THE REST!
    //["CVS", "1Xee8JJfmcFsL8Hsp2ZS-cTAqtUOlv0RX",],
    //["HEB", "1PIkyp8SQsYBxJxm2CVeDIuiDQtlsyO_f",],
    //["Target", "1oqOFUkFvchU3nLcivoniyskmWHNjp3C_"],
    //["Walgreens", "1FHgHb-6BGF-wycHIMaxbm3pDpm8cPVZ_"],
    ["Walmart", "16Nkr392QgxgD5NuRFb44yA1HyjkRkZX6"]
  ];
     
     //
     //  CHANGE NUMBER OF DAYS OF FILES TO KEEP HERE
     //
     var daysToKeep = 39; // add 1 for current day (ie, put 15 to keep the last two weeks)
     
     
     
  var removed = [];
  
  // Set creation date before which all files will be deleted
  var curDateRaw = new Date();
  var cutOffDate = curDateRaw - (daysToKeep * 24 * 60 * 60 * 1000);
  
  
  for each (var folderID in folders) {
    Logger.log("Now Starting " + folderID[0]);
    var folder = DriveApp.getFolderById(folderID[1]);
    var list = [];
    list.push(['Name','Created', 'Status']);
    var files = folder.getFiles();
  
    while (files.hasNext()){
      file = files.next();
      var row = []
      //Logger.log(curDateRaw - file.getDateCreated());
      if(cutOffDate > file.getDateCreated() && file.getOwner().getEmail() == "stronghannahc@gmail.com") {
        //Logger.log(file.getOwner().getEmail());
        var curName = file.getName();
        row.push(curName, file.getDateCreated(), "Deleted");
        list.push(row);
        removed.push(curName);
        
        file.setTrashed(true); // Places the file int the Trash folder
        //Drive.files.remove(file.getId()); // Permanently deletes the file
        Logger.log('File ' + curName + ' moved to trash.');
      }
    }
  }
  //Logger.log(list);
  sendDeletionSummary(removed, curDateRaw);
  
}


function sendDeletionSummary(removed, date) {

  //var emailAddress1 ="Jatkins@otcmeds.com";
  var emailAddress2 = "stronghannahc@gmail.com";
  
  var emailSubject = "Old files deletion completed - " + date;
  var emailBody = "All files older than 2 weeks in James Atkins' data scraping folders have been deleted as of " + date + ".\n\nThe following files were successfully removed: \n  • " + removed.join("\n  • ");
  //var data = ["Walmart", "Target", "HEB", "CVS"];
  
// MailApp.sendEmail(emailAddress1, emailSubject, emailBody, {
//     name: 'CSV to Google Sheet Conversion Script'
// });
 MailApp.sendEmail(emailAddress2, emailSubject, emailBody, {
     name: 'CSV to Google Sheet Conversion Script'
 });
}





//Run this once to create the trigger, or if the trigger is ever deleted
function createDeletionTrigger() {
  
   // Trigger every day between 1am and 2am Pacific time
  ScriptApp.newTrigger('DeleteOldFiles')
      .timeBased()
      .everyDays(1)
      .atHour(1)
      .create();
}
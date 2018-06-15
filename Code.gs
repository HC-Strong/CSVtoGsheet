// Script written by Hannah Strong <stronghannahc@gmail.com> for James Atkins, June 2018
// Last edited: June 13, 2018

// Script iterates over all specified folders, finds the CSV file containing the current date, and makes a google sheets copy of the CSV file
// Set to run every morning between 9am and 10am


//Initiate conversion with this function
function CSVtoGsheet(){
  
  //
  // CHANGE FOLDER IDS AND BRANDS HERE
  //
  var folders = [
    ["Amazon", "139uxTSFeemdBkN78R23KM1QdeMLP3j5P"],
    ["CVS", "1Xee8JJfmcFsL8Hsp2ZS-cTAqtUOlv0RX"],
    ["HEB", "1PIkyp8SQsYBxJxm2CVeDIuiDQtlsyO_f"],
    ["Target", "1oqOFUkFvchU3nLcivoniyskmWHNjp3C_"],
    ["Walgreens", "1FHgHb-6BGF-wycHIMaxbm3pDpm8cPVZ_"],
    ["Walmart", "16Nkr392QgxgD5NuRFb44yA1HyjkRkZX6"]
  ];
  
  //Finds current date and formats to match dates in CSV filenames
  var curDateRaw = new Date();
  var curDate = Utilities.formatDate(curDateRaw, 'America/Los_Angeles', ' yyyy-MMM-dd');
  
  
  for each (var folder in folders) {
    

    //Find filename based on current date
    var name = folder[0] + curDate;
    Logger.log("name is " + name);
    
    //Check if CSV file with given name exists, move on if it doesn't
    if(checkFile(name) == true) {
      //Get data from CSV file with the above filename
      var csvFile = DriveApp.getFilesByName(name).next();
      var csvData = Utilities.parseCsv(csvFile.getBlob().getDataAsString());
    
      //Create sheet with this data, move it to the current folder
      createSS(name, folder[1], csvData);
    }
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

function checkFile(filename){
  var status;
  var file  = DriveApp.getFilesByName(filename)
  
  status = file.hasNext();
  //Does not exist
  if(!file.hasNext()){
  status =  file.hasNext();
  }
  //Does exist
  else{
  status =  file.hasNext();
  }
  Logger.log("Existence is " + status)
  return status;
}




function doNothing(){
  //this function here for testing purposes so a trigger can easily be set to do nothing without deleting it
}
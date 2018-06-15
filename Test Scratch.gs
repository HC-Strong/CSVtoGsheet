// Tests

//Initiate conversion with this function
function CSVtoGsheetfail(){
  
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
      //createSS(name, folder[1], csvData);
    }
  }
  
}

function testIT(){
  checkFileFormat("Test 2018-06-12");
}

function checkFileFormat(filename){
  var status;
  
  //var csvFile = DriveApp.getFilesByName(name).next();
 // var csvData = Utilities.parseCsv(csvFile.getBlob().getDataAsString());
  
  var files  = DriveApp.getFilesByName(filename);
  var csvFiles = [];
  
  //Logger.log(files.next());
//  Logger.log(file.getMimeType());
  
  
  //Iterate over files with correct filename, add
   while (files.hasNext()) {
      var file = files.next();
     

     var fileType = file.getMimeType();
     Logger.log("filetype is " + fileType);
      //Logger.log(file.getName() + "   " + file.getDateCreated());

     
     
 }
  
}
//
//function checkFile(filename){
//  var status;
//  var file  = DriveApp.getFilesByName(filename)
//  
//  status = file.hasNext();
//  //Does not exist
//  if(!file.hasNext()){
//  status =  file.hasNext();
//  }
//  //Does exist
//  else{
//  status =  file.hasNext();
//  }
//  Logger.log("Existence is " + status)
//  return status;
//}
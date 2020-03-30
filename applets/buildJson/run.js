let fs = require("fs-extra");


let bugsCSV = fs.readFileSync("./bugs.csv").toString();

// split rows
let bugRows = bugsCSV.split("\n");


//build json
let bugsJson = []

for(let bugRow of bugRows){
    bugRow = bugRow.split("|");
    let bugData = {
        id: bugRow[0],
        name: bugRow[1],
        found: bugRow[2],
        price: bugRow[3],
        timeString: bugRow[4],
        time:bugRow[5],
        dateStringN:bugRow[6],
        dateStringS:bugRow[7],
        dateN:bugRow[8],
        dateS:bugRow[9]
    }
    bugsJson.push(bugData);
}

fs.writeJSONSync("./bugs.json",bugsJson, {spaces: "\t"});

//////////////////////////////////
// fish 

let fishCSV = fs.readFileSync("./fish.csv").toString();

// split rows
let fishRows = fishCSV.split("\n");


//build json
let fishJson = []

for(let fishRow of fishRows){
    fishRow = fishRow.split("|");
    let fishData = {
        id: fishRow[0],
        name: fishRow[1],
        found: fishRow[2],
        price: fishRow[3],
        timeString: fishRow[4],
        time:fishRow[5],
        dateStringN:fishRow[6],
        dateStringS:fishRow[7],
        dateN:fishRow[8],
        dateS:fishRow[9]
    }
    fishJson.push(fishData);
}

fs.writeJSONSync("./fish.json",fishJson, {spaces: "\t"});
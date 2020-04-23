let fs = require("fs-extra");


let bugsCSV = fs.readFileSync("./applets/buildJson/bugs.csv").toString();

// split rows
let bugRows = bugsCSV.split("\n");


//build json
let bugsJson = []

for(let bugRow of bugRows){
    bugRow = bugRow.split("|");
    let bugData = {
        id: parseInt(bugRow[0]),
        name: bugRow[1],
        found: bugRow[2],
        foundCategory: parseInt(bugRow[3]),
        weather: parseInt(bugRow[4]),
        price: bugRow[5],
        rarity: bugRow[6],
        rarityCategory: parseInt(bugRow[7]),
        timeString: bugRow[8],
        time:bugRow[9].replace("[","").replace("]","").split(",").map(x=>+x),
        dateStringN:bugRow[10],
        dateStringS:bugRow[11],
        dateN:bugRow[12].replace("[","").replace("]","").split(",").map(x=>+x),
        dateS:bugRow[13].replace("[","").replace("]","").split(",").map(x=>+x)
    }
    bugsJson.push(bugData);
}

fs.writeJSONSync("./applets/buildJson/bugs.json",bugsJson, {spaces: "\t"});

//////////////////////////////////
// fish 

let fishCSV = fs.readFileSync("./applets/buildJson/fish.csv").toString();

// split rows
let fishRows = fishCSV.split("\n");


//build json
let fishJson = []

for(let fishRow of fishRows){
    fishRow = fishRow.split("|");
    let fishData = {
        id: parseInt(fishRow[0]),
        name: fishRow[1],
        found: fishRow[2],
        foundCategory: parseInt(fishRow[3]),
        size: fishRow[4],
        sizeCategory: parseInt(fishRow[5]),
        price: fishRow[6],
        rarity: fishRow[7],
        rarityCategory: parseInt(fishRow[8]),
        timeString: fishRow[9],
        time:fishRow[10].replace("[","").replace("]","").split(",").map(x=>+x),
        dateStringN:fishRow[11],
        dateStringS:fishRow[12],
        dateN:fishRow[13].replace("[","").replace("]","").split(",").map(x=>+x),
        dateS:fishRow[14].replace("[","").replace("]","").split(",").map(x=>+x)
    }
    fishJson.push(fishData);
}

fs.writeJSONSync("./applets/buildJson/fish.json",fishJson, {spaces: "\t"});
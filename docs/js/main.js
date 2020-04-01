
function checkDate(){
    d3.select("#fishCards").html(null);
    d3.select("#bugCards").html(null);

    let currentMonth = parseInt(d3.select("#month").node().value);
    let currentTime = parseInt(d3.select("#time").node().value);

    let catchable = getAllCatch(currentMonth,currentTime,webStorage.settings.hemisphere);

    for(let fish of catchable.fish){
        addFishCard(fish);
    }

    for(let bug of catchable.bugs){
        addBugCard(bug);
    }
}

/**
 * 
 * @param {Number} month Number corresponding to the month (1-12)
 * @param {Number} time Number corresponding to the time (0-23)
 */
function getAllCatch(month,time){
    //Look for fish
    let fishFound = [];
    for(let fish of fishData){
        // Check if the fish is found in this month for either the north or south hemisphere
        if(((fish.dateN.includes(month) || fish.dateN.includes(-1)) && webStorage.settings.hemisphere == "north") || // North
           ((fish.dateS.includes(month) || fish.dateS.includes(-1)) && webStorage.settings.hemisphere == "south")){ // South
            //check if correct time
            if(fish.time.includes(time) || fish.time.includes(-1)){
                //check if not donated
                if(!webStorage.donated.fish.includes(fish.id) || !webStorage.settings.hideDonated){
                    fishFound.push(fish);
                }
            }
        }

    }
    /////////////////////////////////////////////////
    let bugsFound = [];
    for(let bug of bugData){
        // Check if the bug is found in this month for either the north or south hemisphere
        if(((bug.dateN.includes(month) || bug.dateN.includes(-1)) && webStorage.settings.hemisphere == "north") || // North
           ((bug.dateS.includes(month) || bug.dateS.includes(-1)) && webStorage.settings.hemisphere == "south")){ // South
            //check if correct time
            if(bug.time.includes(time) || bug.time.includes(-1)){
                //check if not donated
                if(!webStorage.donated.bugs.includes(bug.id) || !webStorage.settings.hideDonated){
                    bugsFound.push(bug);
                }
            }
        }
    }

    //TODO: Add sorting of critters

    return {
        fish: fishFound,
        bugs: bugsFound
    }
}


function addFishCard(fish){
    let card = d3.select("#bugCards")
                    .append("div").attr("class","mdc-card card")
                    .append("div").attr("class","mdc-card__primary-action");

    // Div for the critter image
    let cardImage = card.append("div").attr("class","mdc-card__media card-image")
                    .style("background-image",`url('./images/fish/${fish.name}.png')`);

    // Image Title
    cardImage.append("div").attr("class","card-title")
        .append("div").attr("class","card-title-text").html(fish.name);

    // If Donated
    if(webStorage.donated.fish.includes(fish.id)){
        cardImage.append("div").append("img").attr("class","card-owlstamp").attr("src","./images/owlStampBrown.png");
    }

    // Price
    cardImage.append("div").attr("class","card-bells").html(`${fish.price}<img src="./images/bellBag.png">`);

    // Info section
    let cardInfo = card.append("div").attr("class","card-info");

    // Location
    let cardInfoLocation = cardInfo.append("div").attr("class","card-info-row");

    cardInfoLocation.append("div").attr("class","card-info-row-name").html("Location");
    cardInfoLocation.append("div").attr("class","card-info-row-data").html(fish.found);

    // Time
    let cardInfoTime = cardInfo.append("div").attr("class","card-info-row");
    cardInfoTime.append("div").attr("class","card-info-row-name").html("Time");
    cardInfoTime.append("div").attr("class","card-info-row-data").html(fish.timeString);


    // Months
    let cardInfoMonths = cardInfo.append("div").attr("class","card-info-row");

    cardInfoMonths.append("div").attr("class","card-info-row-name")
        .attr("style", "line-height: 4;").html("Months");
    //FIXME: Hardcoded to north hemisphere
    //cardInfoMonths.append("div").attr("class","card-info-row-data").html(fish.dateStringN);
    
    let cardInfoMonthsData = cardInfoMonths.append("div").attr("style", "width: 160px;");
    
    let months = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
    let northHemisphereOption = true;
    let fishMonthData = northHemisphereOption ? fish.dateN : fish.dateS;

    let monthDataRow = cardInfoMonthsData.append("div").attr("class", "card-info-row-monthdata");
    for (let i = 1; i <= 12; i++) {
        if (i == 5 || i == 9)
        monthDataRow = cardInfoMonthsData.append("div").attr("class", "card-info-row-monthdata");
        if (i in fishMonthData || fishMonthData[0] == -1){
            monthDataRow.append("div")
                .attr("class","card-info-month-checked")
                .html(months[i]);
        }else{
            monthDataRow.append("div")
                .html(months[i]);
        }
    }
    


    

    card.on("click",()=>{return markDonate("fish",fish.id)});
}

function addBugCard(bug){
    let card = d3.select("#bugCards").append("div").attr("class","card");

    card.append("div")
        .attr("class","image")
        .attr("style","background-image: url(\"./images/bugs/"+bug.name+".png\")")

    card.append("div")
        .attr("class","name")
        .html(bug.name);

    card.append("div")
        .attr("class","location")
        .html(bug.found);

    card.append("div")
        .attr("class","donateButton")
        .html("click")
        .on("click",()=>{return markDonate("bug",bug.id)});

}

function markDonate(type,id){
    //console.log(`Type:${type}\nID:${id}`);

    if(type == "fish"){
        webStorage.donated.fish.push(id);
    }else if(type == "bug"){
        webStorage.donated.bugs.push(id);
    }

    save("Added new donated critter");
    checkDate();
}

function unhideDonated(){
    webStorage.settings.hideDonated = !webStorage.settings.hideDonated;
    d3.select("#hideDonateButton").html(`Hide: ${webStorage.settings.hideDonated}`);

    save("Changed hide donated");
    checkDate();
}

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
        if((fish.dateN.includes(month) || fish.dateN.includes(-1)) || // North
           (fish.dateS.includes(month) || fish.dateS.includes(-1))){ // South
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
        if((bug.dateN.includes(month) || bug.dateN.includes(-1)) || // North
           (bug.dateS.includes(month) || bug.dateS.includes(-1))){  // South
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
    let card = d3.select("#bugCards").append("div").attr("class","card");

    card.append("div")
        .attr("class","image")
        .attr("style","background-image: url(\"./images/fish/"+fish.name+".png\")")

    card.append("div")
        .attr("class","name")
        .html(fish.name);

    card.append("div")
        .attr("class","location")
        .html(fish.found);

    card.append("div")
        .attr("class","size")
        .html(fish.size);

    card.append("div")
        .attr("class","donateButton")
        .html("click")
        .on("click",()=>{return markDonate("fish",fish.id)});
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
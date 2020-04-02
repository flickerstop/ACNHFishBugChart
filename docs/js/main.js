// GLOBALS
let fishData = null;
let bugData = null;
let webStorage = null;
let filter = {month: -1, time:-1};
let toggleCritter = false;


function init(){
    mdc.autoInit();
    //mdc.switchControl.MDCSwitch.attachTo(document.querySelector('.mdc-switch'));

    $('.fish-bug-switch-selected').toggleClass('fish');
    $("#fish-bug-switch").click(function() {
        $('.fish-bug-switch-selected').toggleClass('bug');
        $('.fish-bug-switch-selected').toggleClass('fish');
    });

    $.getJSON("./json/fish.json", function(fishResult){
        // load the data for all the fish
        fishData = fishResult;
        $.getJSON("./json/bugs.json", function(bugResult){
            // load the data for all the bugs
            bugData = bugResult;

            // Load the list of donated critters
            webStorage = load();


            renderCritterCards(filter, true)
        });
    });
}

function renderCritterCards(filter, renderFish){
    d3.select("#critterCards").html(null);

    let filteredList = filterCritterList(filter, renderFish);

    for(let critter of filteredList){
        addCritterCard(critter, renderFish)
    }
}

function checkDate(){
    d3.select("#fishCards").html(null);
    d3.select("#bugCards").html(null);

    let currentMonth = parseInt(d3.select("#month").node().value);
    let currentTime = parseInt(d3.select("#time").node().value);

    let catchable = filterCritterList(currentMonth,currentTime,webStorage.settings.hemisphere);

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
function filterCritterList(filter, renderFish){
    
    let critterData = renderFish ? fishData : bugData;
    let crittersFound = [];
    for(let critter of critterData){

        if (filter.month != -1){
            // Check if the critter is found in this month for either the north or south hemisphere
            if(( webStorage.settings.hemisphere == "north" && !(critter.dateN.includes(-1) || critter.dateN.includes(month)) ) || // North
               ( webStorage.settings.hemisphere == "south" && !(critter.dateS.includes(-1) || critter.dateS.includes(month)) )){ // South
                continue;
            }           
        }

        // Check if critter is found at this time
        if(filter.time != -1 && !(critter.time.includes(-1) || critter.time.includes(filter.time))){
            continue;
        }


        //TODO: add this to filter and save filter to webstorage
        // If hide donated setting on, check if donated, if yes then skip add
        if(webStorage.settings.hideDonated && webStorage.donated.fish.includes(critter.id)){
            continue;
        }
        
        crittersFound.push(critter);
    }
    /////////////////////////////////////////////////
    // let bugsFound = [];
    // for(let bug of bugData){
    //     // Check if the bug is found in this month for either the north or south hemisphere
    //     if(((bug.dateN.includes(month) || bug.dateN.includes(-1)) && webStorage.settings.hemisphere == "north") || // North
    //        ((bug.dateS.includes(month) || bug.dateS.includes(-1)) && webStorage.settings.hemisphere == "south")){ // South
    //         //check if correct time
    //         if(bug.time.includes(time) || bug.time.includes(-1)){
    //             //check if not donated
    //             if(!webStorage.donated.bugs.includes(bug.id) || !webStorage.settings.hideDonated){
    //                 bugsFound.push(bug);
    //             }
    //         }
    //     }
    // }

    //TODO: Add sorting of critters

    return crittersFound;
}


function addCritterCard(critter, renderFish){
    let card = d3.select("#critterCards")
                    .append("div").attr("class","mdc-card card").attr("id", `critter${critter.id}`)
                    .append("div").attr("class","mdc-card__primary-action");

    // Div for the critter image
    let cardImage = card.append("div").attr("class","mdc-card__media card-image")
                    .style("background-image",`url('./images/${renderFish?"fish":"bugs"}/${critter.name}.png')`);

    // Image Title
    cardImage.append("div").attr("class","card-title")
        .append("div").attr("class","card-title-text").html(critter.name);

    // If Donated
    if (renderFish){
        if(webStorage.donated.fish.includes(critter.id)){
            cardImage.append("div").append("img").attr("class","card-owlstamp").attr("src","./images/owlStampBrown.png");
        }
    }else{
        if(webStorage.donated.bugs.includes(critter.id)){
            cardImage.append("div").append("img").attr("class","card-owlstamp").attr("src","./images/owlStampBrown.png");
        }
    }

    // Fish Size
    if(renderFish){
        let cardFishSize = cardImage.append("div").attr("class","card-fishsize");
        cardFishSize.append("img").attr("src", `./images/fishSize/${critter.size}.png`);
        cardFishSize.append("br");
        cardFishSize.append("div").html(critter.size);
    }

    // Price
    cardImage.append("div").attr("class","card-bells").html(`${critter.price}<img src="./images/bellBag.png">`);

    card.append("img").attr("src","./images/card-seperator.png");

    // Info section
    let cardInfo = card.append("div").attr("class","card-info");

    // Location
    let cardInfoLocation = cardInfo.append("div").attr("class","card-info-row");

    cardInfoLocation.append("div").attr("class","card-info-row-name").html("Location");
    cardInfoLocation.append("div").attr("class","card-info-row-data").html(critter.found);

    // Time
    let cardInfoTime = cardInfo.append("div").attr("class","card-info-row");
    cardInfoTime.append("div").attr("class","card-info-row-name").html("Time");
    cardInfoTime.append("div").attr("class","card-info-row-data").html(critter.timeString);


    // Months
    let cardInfoMonths = cardInfo.append("div").attr("class","card-info-row");

    cardInfoMonths.append("div").attr("class","card-info-row-name")
        .attr("style", "line-height: 4;").html("Months");
    
    let cardInfoMonthsData = cardInfoMonths.append("div").attr("style", "width: 160px;");
    
    let months = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
    let northHemisphereOption = webStorage.settings.hemisphere == "north";
    let critterMonthData = northHemisphereOption ? critter.dateN : critter.dateS;

    let monthDataRow = cardInfoMonthsData.append("div").attr("class", "card-info-row-monthdata");
    for (let i = 1; i <= 12; i++) {
        if (i == 5 || i == 9){
            monthDataRow = cardInfoMonthsData.append("div").attr("class", "card-info-row-monthdata");
        }

        if (critterMonthData.includes(i) || critterMonthData[0] == -1){
            monthDataRow.append("div")
                .attr("class","card-info-month-checked")
                .html(months[i]);
        }else{
            monthDataRow.append("div")
                .html(months[i]);
        }
    }

    card.on("click",()=>{markDonate(renderFish?"fish":"bug",critter.id)});
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
    //TODO: add display none aka hide and show here instead of redrawing
    if(type == "fish"){
        if (webStorage.donated.fish.includes(id)){
            delete webStorage.donated.fish[webStorage.donated.fish.indexOf(id)];
        }else{
            webStorage.donated.fish.push(id);
            //d3.select(`#critter${id}`).attr("class","hide");
        }
    }else if(type == "bug"){
        if (webStorage.donated.bugs.includes(id)){
            delete webStorage.donated.bugs[webStorage.donated.bugs.indexOf(id)];
        }else{
            webStorage.donated.bugs.push(id);
            //d3.select(`#critter${id}`).attr("class","hide");
        }
    }

    save("Added new donated critter");
    renderCritterCards(filter,(type == "fish"));

}

function unhideDonated(){
    webStorage.settings.hideDonated = !webStorage.settings.hideDonated;
    d3.select("#hideDonateButton").html(`Hide: ${webStorage.settings.hideDonated}`);

    save("Changed hide donated");
    checkDate();
}
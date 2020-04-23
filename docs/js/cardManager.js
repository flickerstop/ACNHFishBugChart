
let critterCards = {
    fish:{
        container: null,
        cards:[]
    },
    bugs:{
        container: null,
        cards:[]
    }};


function initCards(){
    let timeStart = Date.now();
    // generate fish cards
    let fishDiv = critterCards.fish.container = d3.select("#main-section").append("div").attr("class","critterCards").attr("id","fishCards");

    for(let fish of fishData){
        critterCards.fish.cards.push({
            id:fish.id,
            card:addCritterCard(fish,"fish",fishDiv)
        });
    }



    // generate bug cards
    let bugDiv = critterCards.bugs.container = d3.select("#main-section").append("div").attr("class","critterCards").attr("id","bugCards");

    for(let bug of bugData){
        critterCards.bugs.cards.push({
            id:bug.id,
            card:addCritterCard(bug,"bug",bugDiv)
        });
    }
    


    // re init ripple effect on all cards
    const selector = '.mdc-card__primary-action, .mdc-line-ripple';
    const ripples = [].map.call(document.querySelectorAll('.mdc-card__primary-action'), function(el) {
        return new mdc.ripple.MDCRipple(el);
    });

    console.log(`time taken ${Date.now()-timeStart}ms`);
}


function updateCards(){
    d3.select("#critterSearch").property("value","");

    let currentMonth = parseInt(monthSelect.value);
    let currentTime = parseInt(d3.select("#timeInput").node().value);

    let catchable = generateCritterList(currentMonth,currentTime, shownCritterType);
    
    catchable = filterCritterList(catchable,shownCritterType);

    let cardList = shownCritterType=="fish"?critterCards.fish.cards:critterCards.bugs.cards;

    for(let critterCard of cardList){
        // if this card is currently catchable
        if(catchable.find(x=>x.id == critterCard.id) != undefined){
            // Unhide it
            critterCard.card.style("display",null)
        }else{
            critterCard.card.style("display","none");
        }
    }
}

function showSearchedCards(validCards){

    let cardList = shownCritterType=="fish"?critterCards.fish.cards:critterCards.bugs.cards;

    for(let critterCard of cardList){
        // if this card is currently catchable
        if(validCards.find(x=>x.id == critterCard.id) != undefined){
            // Unhide it
            critterCard.card.style("display",null)
        }else{
            critterCard.card.style("display","none");
        }
    }
}


/**
 * 
 * @param {Object} critter JSON object holding the critter info
 * @param {String} critterType "fish" or "bug"
 */
function addCritterCard(critter, critterType, container){
let timeStart = Date.now();
    let donateList = critterType=="fish"?webStorage.donated.fish:webStorage.donated.bugs;

    let cardContainer = container.append("div").attr("class","mdc-card mdc-elevation--z3 card").attr("id", `critter${critter.id}`).style("display","none");

    let card = cardContainer.append("div").attr("class","mdc-card__primary-action");

    // Div for the critter image
    let cardImage = card.append("div").attr("class","mdc-card__media card-image-bg");
                    //.style("background-image",`url('./images/${critterType=="fish"?"fish":"bugs"}/${critter.name}.png')`);
    cardImage.append("div").classed("card-image-container",true)
        .append("img").attr("src",`./images/${critterType=="fish"?"fishtrim":"bugstrim"}/${critter.name}.png`).classed("card-image",true);

    // Image Title
    cardImage.append("div").attr("class","card-title-container")
        .append("div").attr("class","card-title")
        .append("div").attr("class","card-title-text").html(critter.name);

    // If Donated
    if(donateList.includes(critter.id)){
        card.append("div").attr("class","card-owlstamp")
            .append("div").attr("class","card-owlstamp-image")
            .attr("id",`critter${critter.id}-owlstamp`);

    }else{
        card.append("div").attr("class","card-owlstamp")
            .append("div").attr("class","card-owlstamp-image zoom")
            .attr("id",`critter${critter.id}-owlstamp`)
            .style("display", "none");

        setTimeout(()=>{d3.select(`#critter${critter.id}-owlstamp`).style("display","");}, 600)
    }

    // Fish Size
    if(critterType=="fish"){
        let cardFishSize = cardImage.append("div").attr("class","card-fishsize");
        cardFishSize.append("img").attr("src", `./images/fishSize/${critter.sizeCategory}.png`);
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

    cardInfoLocation.append("div").attr("class","card-info-row-name").append("p").html("Location");
    cardInfoLocation.append("div").attr("class","card-info-row-data").append("p").html(critter.found);

    // Time
    let cardInfoTime = cardInfo.append("div").attr("class","card-info-row");
    cardInfoTime.append("div").attr("class","card-info-row-name").append("p").html("Time");
    cardInfoTime.append("div").attr("class","card-info-row-data").append("p").html(critter.timeString);


    // Months
    let cardInfoMonths = cardInfo.append("div").attr("class","card-info-row");
    cardInfoMonths.append("div").attr("class","card-info-row-name").append("p").html("Months");
    
    let cardInfoMonthsData = cardInfoMonths.append("div").attr("class","card-info-row-data");
    
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

    card.on("click",()=>{markDonate(critterType,critter.id)});

    return cardContainer;
}

/**
 * 
 * @param {Number} month Number corresponding to the month (1-12)
 * @param {Number} time Number corresponding to the time (0-23)
 * @param {String} critterType Type of critter "bug" or "fish"
 */
function generateCritterList(month, time, critterType){
    // Which critter list to check
    let critterList = critterType == "fish"? fishData:bugData;
    let donateList = critterType=="fish"?webStorage.donated.fish:webStorage.donated.bugs;

    let returnList = [];


    // Generate the critter list
    for(let critter of critterList){
        // if the critter is donated and we're showing donated critters OR the critter isn't in the donate list and we're showing nondonated
        if((donateList.includes(critter.id) && webStorage.settings.showDonated) || (!donateList.includes(critter.id) && webStorage.settings.showNonDonated)){
            // If the critter is currently catchable this month
            if(( webStorage.settings.hemisphere == "north" && (critter.dateN.includes(-1) || critter.dateN.includes(month)) ) || // North
               ( webStorage.settings.hemisphere == "south" && (critter.dateS.includes(-1) || critter.dateS.includes(month)) )){  // South
                // check if the time is correct
                if(isNaN(time) || critter.time.includes(time) || critter.time.includes(-1)){
                    returnList.push(critter);
                }
            }
        }
    }

    if (webStorage.settings.sortBy != undefined){
        //returnList = returnList.sort((a,b) => parseInt(b.price.replace(",","")) - parseInt(a.price.replace(",","")));
    }
    return returnList;
}


function filterCritterList(critterList,critterType){
    // What filter list should this use
    let filterList = critterType == "fish"? webStorage.settings.filter.fish:webStorage.settings.filter.bug;

    // List of ID's to remove
    let toRemove = [];

    // Go through all the passed critters
    for(let critter of critterList){
        // Go through all the filters
        for(let filter of filterList){
            // If the critter has this filter as an object value
            if(Object.values(critter).includes(filter) || critter.found.startsWith(filter)){
                // Save it to be removed
                toRemove.push(critter.id);
            }
        }
    }

    // Go through all the critters to remove
    for(let remove of toRemove){
        critterList.splice(critterList.findIndex(x=>x.id == remove),1);
    }

    //Note: had to do this in 2 loops since splicing out of the currently
    // iterated array causes skips in the foreach loop

    return critterList;
}
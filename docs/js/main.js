// GLOBALS
let fishData = null;
let bugData = null;
let webStorage = null;
let shownCritterType = "fish";

let monthSelect = null;
let hemisphereSwitch = null;
let showDonatedChipSet = null;




function init(){
    $('.fish-bug-switch-selected').toggleClass('fish');
    $("#bugLocationChipSet").hide()
    $("#fish-bug-switch").click(function() {
        $('.fish-bug-switch-selected').toggleClass('bug');
        $('.fish-bug-switch-selected').toggleClass('fish');
        changeCritterType();
    });

    $.getJSON("./json/fish.json", function(fishResult){
        // load the data for all the fish
        fishData = fishResult;
        $.getJSON("./json/bugs.json", function(bugResult){
            // load the data for all the bugs
            bugData = bugResult;

            // Load the list of donated critters
            console.log("webstoreage")
            webStorage = load();

            // Set the hemisphere button
            // d3.select("#hemisphereButton").html(webStorage.settings.hemisphere + " Hemisphere");
            // d3.select("#hideDonateButton").html(`Hide: ${webStorage.settings.hideDonated}`);
            initMDC();
            checkDate();
        });
    });

    // For the time input to make sure they can only type in 2 digits
    $('.max-length').unbind('keyup change input paste').bind('keyup change input paste',function(e){
        var $this = $(this);
        var val = $this.val();
        var valLength = val.length;
        var maxCount = $this.attr('maxlength');
        if(valLength>maxCount){
            $this.val($this.val().substring(0,maxCount));
        }
    }); 

    
}

/**
 * NOTE: this needs a better name, it basically redraws all the cards after checking the date.
 * This is used basically everywhere to update the cards
 */
function checkDate(){
    d3.select("#critterCards").html(null);

    let currentMonth = parseInt(monthSelect.value);
    let currentTime = parseInt(d3.select("#timeInput").node().value);

    let catchable = generateCritterList(currentMonth,currentTime, shownCritterType);
    
    catchable = filterCritterList(catchable,shownCritterType);



    for(let critter of catchable){
        addCritterCard(critter,shownCritterType);
    }

    // re init ripple effect on all cards
    const selector = '.mdc-card__primary-action, .mdc-line-ripple';
    const ripples = [].map.call(document.querySelectorAll('.mdc-card__primary-action'), function(el) {
        return new mdc.ripple.MDCRipple(el);
    });

    // Clear the search bar
    //FIXME doesn't reset the search bar correctly
    d3.select("#critterSearch").property("value","");
}

/**
 * Updates the critter cards with what's passed to it
 * @param {Array} newCards Array of critters to show
 */
function updateCards(newCards){
    d3.select("#critterCards").html(null);

    for(let critter of newCards){
        addCritterCard(critter,shownCritterType);
    }
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

/**
 * Swaps between fish and bug critter types, then redraws the cards
 */
function changeCritterType(){
    if(d3.select("#critterTypeSwitch").attr("class") == "fish-bug-switch-selected fish"){
        $("#bugLocationChipSet").hide();
        $("#fishLocationChipSet").show();
        shownCritterType = "fish"
    }else{
        // $("#bugLocationChipSet").show();
        $("#fishLocationChipSet").hide();
        shownCritterType = "bug"
    }
    checkDate();
}

/**
 * 
 * @param {Object} critter JSON object holding the critter info
 * @param {String} critterType "fish" or "bug"
 */
function addCritterCard(critter, critterType){

    let donateList = critterType=="fish"?webStorage.donated.fish:webStorage.donated.bugs;

    let card = d3.select("#critterCards")
                    .append("div").attr("class","mdc-card mdc-elevation--z3 card").attr("id", `critter${critter.id}`)
                    // .append("div").attr("class","mdc-card mdc-elevation--z3")
                    .append("div").attr("class","mdc-card__primary-action");

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
}

function markDonate(type,id){
    //console.log(`Type:${type}\nID:${id}`);

    // Used in the statements below to state if the critter was donated or undonated
    let critterDonated = true;
    if(type == "fish"){
        if (webStorage.donated.fish.includes(id)){
            delete webStorage.donated.fish[webStorage.donated.fish.indexOf(id)];
            critterDonated = false;
        }else{
            webStorage.donated.fish.push(id);
            critterDonated = true;
        }
    }else if(type == "bug"){
        if (webStorage.donated.bugs.includes(id)){
            delete webStorage.donated.bugs[webStorage.donated.bugs.indexOf(id)];
            critterDonated = false;
        }else{
            webStorage.donated.bugs.push(id);
            critterDonated = true;
        }
    }

    save("Added new donated critter");

    // If hide donated critter setting enabled then hide card, else add the owl stamp
    if (!webStorage.settings.showDonated) { 
        // Start the fade out effect
        d3.select(`#critter${id}`).classed("fadeout", true);
        // Hide the element after the fade animation, make sure to match timeout delay with 
        // .card css class transition property (ex. transition: all 0.3s linear)
        setTimeout(()=>{d3.select(`#critter${id}`).style("display","none");}, 300)
    }else{
        // Start owl stamp zoom effect
        d3.select(`#critter${id}-owlstamp`).classed("zoom", !critterDonated);
    }
    
    //checkDate();
}

function initMDC(){
    mdc.autoInit();
    
    //const textField = new mdc.textField.MDCTextField(document.querySelector('.mdc-text-field'));
    //const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
    const textFields = [].map.call(document.querySelectorAll('.mdc-text-field'), function(el) {
        return new mdc.textField.MDCTextField(el);
    });
    
    monthSelect = new mdc.select.MDCSelect(document.querySelector('#monthSelect'));
    monthSelect.value = (new Date().getMonth()+1).toString();
    monthSelect.listen('MDCSelect:change', () => {
        checkDate();
    });
    d3.select("#timeInput").property("value",new Date().getHours());
    
    hemisphereSwitch = new mdc.switchControl.MDCSwitch(document.querySelector('#hemisphereSwitch'));
    hemisphereSwitch.checked = webStorage.settings.hemisphere == "south";
    
    showDonatedChipSet = new mdc.chips.MDCChipSet(document.querySelector('#donateChipSet'));
    showDonatedChipSet.chips[0].selected = webStorage.settings.showDonated;
    showDonatedChipSet.chips[1].selected = webStorage.settings.showNonDonated;   
    showDonatedChipSet.listen("MDCChip:selection", function(event){
        if (event.detail.chipId == "showDonated"){
            setShowDonated(event.detail.selected);

        }else if(event.detail.chipId == "showNotDonated"){
            setShowNonDonated(event.detail.selected)
        }
    });

    const locationChipSet = new mdc.chips.MDCChipSet(document.querySelector("#fishLocationChipSet"));
    locationChipSet.chips[0].selected = !webStorage.settings.filter.fish.includes("Sea");
    locationChipSet.chips[1].selected = !webStorage.settings.filter.fish.includes("River");
    locationChipSet.chips[2].selected = !webStorage.settings.filter.fish.includes("Pond");
    locationChipSet.chips[3].selected = !webStorage.settings.filter.fish.includes("Pier");
    locationChipSet.listen("MDCChip:selection", function(event){
        if (event.detail.selected){
            removeCritterFilter(event.detail.chipId,"fish");
        }else{
            addCritterFilter(event.detail.chipId,"fish");
        }
        checkDate();
    });


    const selector = '.mdc-line-ripple';
    const ripples = [].map.call(document.querySelectorAll(selector), function(el) {
        return new mdc.ripple.MDCRipple(el);
    });
}
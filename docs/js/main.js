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
            webStorage = load();

            // Set the hemisphere button
            // d3.select("#hemisphereButton").html(webStorage.settings.hemisphere + " Hemisphere");
            // d3.select("#hideDonateButton").html(`Hide: ${webStorage.settings.hideDonated}`);
            initMDC();

            initCards();
            updateCards();
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
 * Swaps between fish and bug critter types, then redraws the cards
 */
function changeCritterType(){
    if(d3.select("#critterTypeSwitch").attr("class") == "fish-bug-switch-selected fish"){
        $("#bugLocationChipSet").hide();
        $("#fishLocationChipSet").show();
        $("#fishCards").show();
        $("#bugCards").hide();
        shownCritterType = "fish"
    }else{
        // $("#bugLocationChipSet").show();
        $("#fishLocationChipSet").hide();
        $("#fishCards").hide();
        $("#bugCards").show();
        shownCritterType = "bug"
    }
    updateCards();
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
        //d3.select(`#${type}${id}`).classed("fadeout", true);
        d3.select(`#${type}${id}-owlstamp`).classed("zoom", !critterDonated);
        // Hide the element after the fade animation, make sure to match timeout delay with 
        // .card css class transition property (ex. transition: all 0.3s linear)
        setTimeout(()=>{d3.select(`#${type}${id}`).style("display","none");}, 300)
    }else{
        // Start owl stamp zoom effect
        d3.select(`#${type}${id}-owlstamp`).classed("zoom", !critterDonated);
    }
    
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
        updateCards();
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
        updateCards();
    });


    const selector = '.mdc-line-ripple';
    const ripples = [].map.call(document.querySelectorAll(selector), function(el) {
        return new mdc.ripple.MDCRipple(el);
    });
}
/**
 * Swaps the settings for hemisphere (not used)
 */
function swapHemisphere(){
    if (hemisphereSwitch.checked) {
        webStorage.settings.hemisphere = "south";
    }else{
        webStorage.settings.hemisphere = "north";
    }
    save("Hemisphere Changed");
    // d3.select("#hemisphereButton").html(webStorage.settings.hemisphere + " Hemisphere");
    updateCards();
}

/**
 * 
 * @param {String} filter Any keyword to search the object's values for.
 * @param {String} critterType Type of critter "bug" or "fish"
 */
function addCritterFilter(filter,critterType){
    let filterList = critterType == "fish"? webStorage.settings.filter.fish:webStorage.settings.filter.bug;

    // Check the current filter is already applied
    if(!filterList.includes(filter)){
        // Add the filter
        filterList.push(filter);
    }else{
        console.error("Trying to add filter which is already added!");
    }
}

/**
 * 
 * @param {String} filter Any keyword to search the object's values for.
 * @param {String} critterType Type of critter "bug" or "fish"
 */
function removeCritterFilter(filter,critterType){
    let filterList = critterType == "fish"? webStorage.settings.filter.fish:webStorage.settings.filter.bug;

    // Check the current filter is already applied
    if(filterList.includes(filter)){
        // Remove the filter
        filterList.splice(filterList.indexOf(filter),1);
    }else{
        console.error("Trying to remove filter which does not exist!");
    }
}

/**
 * Searches the list of critters for matching names
 * @param {String} searchString Name of the critter
 * @param {String} critterType Type of critter "bug" or "fish"
 */
function searchCritter(searchString, critterType){
    if (searchString == ""){
        updateCards();
        return;
    }
    let searchList = critterType == "fish"? fishData:bugData;

    let regex = new RegExp(`.*${searchString.toLowerCase()}.*`);

    let validCritters = [];

    for(let critter of searchList){
        if(regex.exec(critter.name.toLowerCase())){
            validCritters.push(critter);
        }
    }

    showSearchedCards(validCritters);
}

/**
 * Sets the current settings value for showing Donated critters
 * @param {boolean} value Value of the Show Donated setting
 */
function setShowDonated(value){
    webStorage.settings.showDonated = value;
    save("Set showDonated: " + value);
    updateCards();
}

/**
 * Sets the current settings value for showing Non Donated critters
 * @param {boolean} value Value of the Show Donated setting
 */
function setShowNonDonated(value){
    webStorage.settings.showNonDonated = value;
    save("Set showNonDonated: " + value);
    updateCards();
}
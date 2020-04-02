function openSidebar(){
    d3.select("#settingsSideBar").transition(200).style("right","0px");
}

function closeSidebar(){
    d3.select("#settingsSideBar").transition(200).style("right","-250px");
}

function unhideDonated(){
    webStorage.settings.hideDonated = !webStorage.settings.hideDonated;
    d3.select("#hideDonateButton").html(`Hide: ${webStorage.settings.hideDonated}`);

    save("Changed hide donated");
    checkDate();
}

function swapHemisphere(){
    if(webStorage.settings.hemisphere == "north"){
        webStorage.settings.hemisphere = "south";
    }else{
        webStorage.settings.hemisphere = "north";
    }
    save("Hemisphere Changed");
    d3.select("#hemisphereButton").html(webStorage.settings.hemisphere + " Hemisphere");
    checkDate();
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
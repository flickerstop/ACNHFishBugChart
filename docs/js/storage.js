function save(reason){

    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("webStorage", JSON.stringify(webStorage));
        console.log("saved!\nReason: " + reason);
    } else {
        window.alert("Web Storage is not supported!");
    }
}



function load(){
    // Load all webStorage
    let tempStorage = readWebStorage("webStorage");

    // Check if no WebStorage
    if(tempStorage == null){
        console.error("No WebStorage found, using default");
        tempStorage = {};
        save("Saved default storage");
    }

    // Check donated critters
    if(tempStorage.donated == null){
        console.error("Donated Critter data not found, using default");
        tempStorage.donated = {
            fish:[],
            bugs:[]
        }
        save("Saved default donated Critters");
    }

    // Check settings
    if(tempStorage.settings == null){
        console.error("Settings data not found, using default");
        tempStorage.settings = {
            hemisphere: "north",
            theme: "light",
            timeTraveller: false,
            sorting: "default",
            filter: {
                fish:[],
                bug:[]
            }
        }
        save("No settings, saving default");
    }

    // Adds filters if no filters were found (future proofing)
    if(tempStorage.settings.filter == undefined){
        tempStorage.settings.filter = {
            fish:[],
            bug:[]
        }

        save("No filters were found");
    }

    // Check if "showDonated" and "showNonDonated is there"
    if(tempStorage.settings.showDonated == undefined){
        delete tempStorage.settings.hideDonated;
        tempStorage.settings.showDonated = true;
        tempStorage.settings.showNonDonated = true;

        console.error("Changing donated settings from old to new...");
        save("Changed donated settings");
    }


    return tempStorage;


    function readWebStorage(){
        // If you can use web storage
        if (typeof(Storage) !== "undefined") {
           // get the save file from web storage
           let loadData = JSON.parse(localStorage.getItem("webStorage"));
           // if there is a save file
           if(loadData != null){
               return loadData;
           }else{
               return null;
           }
       } else {
           window.alert("Web Storage is not supported!");
       }
    }
}

function deleteSave(){
    localStorage.clear();
    webStorage = null;
    console.error("rip");
    location.reload();
}
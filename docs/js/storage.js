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
    }

    // Check donated critters
    if(tempStorage.donated == null){
        console.error("Donated Critter data not found, using default");
        tempStorage.donated = {
            fish:[],
            bugs:[]
        }
    }

    // Check settings
    if(tempStorage.settings == null){
        console.error("Settings data not found, using default");
        tempStorage.settings = {
            hemisphere: "north",
            hideDonated: true,
            theme: "light",
            timeTraveller: false,
            sorting: "default"
        }
        save("No settings, saving default");
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
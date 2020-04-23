const defaultStorage = {
    donated:{
        fish:[],
        bugs:[],
        art:[]
    },
    settings:{
        hemisphere: "north",
        theme: "light",
        timeTraveller: false,
        sorting: "default",
        showDonated: true,
        showNonDonated: true,
        filter: {
            fish:[],
            bug:[],
            art:[]
        }
    }
}

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
        tempStorage = webStorage = defaultStorage;
    }else{
        compareStorage(tempStorage,defaultStorage);
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


function compareStorage(newStorage,oldStorage,path =""){
    // iterate through the keys
    for(let key of Object.keys(oldStorage)){
        // Check if the new storage contains this key also
        if(Object.keys(newStorage).find(x=>x==key)){
            // Check if this key is an object
            if(typeof(oldStorage[key]) == "object" && !Array.isArray(oldStorage[key])){
                // the old recurs-a-roo
                compareStorage(newStorage[key],oldStorage[key],`${path}${key}.`);
            }
        }else{ // If this key doesn't exist 
            console.error(`Did not find key "${path+key}", adding default storage variable.`);
            newStorage[key] = oldStorage[key];
        }
    }
}
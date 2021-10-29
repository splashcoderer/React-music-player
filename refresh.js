const parseSongs  = require('./parse.js').parseSongs;
const fs = require('fs');

const webSiteDir = './client/build';

if (fs.existsSync(webSiteDir + "/music")){
    if (!fs.existsSync(webSiteDir + "/covers")){
        fs.mkdirSync(webSiteDir + "/covers");
    }
    parseSongs(webSiteDir + "/music/", (err, result) => {
        if(err) throw err;
        fs.writeFile("music_library.json", JSON.stringify(result, null, '  '), "utf8", callback=>{return});
    });
    console.log("Finished");
} else {
    console.log("No music found. Place music in ./music/")
}

const parseSongs  = require('./parse.js').parseSongs;
const fs = require('fs');

if (fs.existsSync("./client/public/music")){
    if (!fs.existsSync("./client/public/covers")){
        fs.mkdirSync("./client/public/covers");
    }
    parseSongs("./client/public/music/", (err, result) => {
        if(err) throw err;
        fs.writeFile("music_library.json", JSON.stringify(result, null, '  '), "utf8", callback=>{return});
    });
    console.log("Finished.");
} else {
    console.log("No music found. Place music in ./music/")
}

const fs = require('fs');
const formidable = require('formidable');
const createServer = require('http').createServer;
const parseSongs = require('./parse.js').parseSongs;

const webSiteDir = './client/build';

const handler = (req, res) => {
    console.log('request', req.url, req.method);
    let dest = req.url;

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Max-Age": 2592000, // 30 days
    };
    if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
    }
  
    if (["GET", "POST"].indexOf(req.method) > -1) {
        res.writeHead(200, headers);
    }

    if(req.method.toLowerCase() == 'get') {
        switch(dest) {
            case '/getSongs':
                getSongs(req, res);
                break;
            case '/getWallpapers':
                getWallpapers(req, res);
                break;
            case '/refreshData':
                refreshData(req, res);
                break;
            default:
                res.end();
        }
    } else if(req.method.toLowerCase() == 'post') {
        switch(dest) {
            case '/addPlaylist':
                addPlaylist(req, res);
                break;
            case '/removeFromPlaylist':
                removeFromPlaylist(req, res);
                break;
            case '/addToPlaylist':
                addToPlaylist(req, res);
                break;
            case '/deletePlaylist':
                deletePlaylist(req, res);
                break;
            case '/editPlaylistName':
                editPlaylistName(req, res);
                break;
            default:
                res.end();
        }
    } else {
        res.end();
    }
}

const fileTypes = {
    '.html':'text/html',
    '.js':'text/javascript',
    '.css':'text/css',
    '.flac':'audio/flac',
    '.mp3':'audio/mpeg',
    '.jpg':'image/jpg',
    '.png':'image/png',
    '.ico':'image/x-icon',
    '.ttf':'application/octet-stream'
}

const getSongs = (req, res) => {
    let dataMap = fs.existsSync('./music_library.json') ? require("./music_library.json") : {
        "songs":{},
        "albums":{},
        "artists":{},
        "playlists":{},
        "genres":{},
        "all":{}
    };
    // res.writeHead(200, {"Content-Type":"application/json"});
    res.end(JSON.stringify(dataMap));
}

const getWallpapers = (req, res) => {
    fs.readdir('./client/public/background/', (err, files) => {
        let file = files[Math.round(Math.random() * (files.length - 1))];
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(file));
    });
}

const refreshData = (req, res) => {
    if (fs.existsSync(webSiteDir + "/music")){
        if (!fs.existsSync(webSiteDir + "/covers")){
            fs.mkdirSync(webSiteDir + "/covers");
        }
        const playlists = fs.existsSync('./music_library.json') ? require('./music_library.json').playlists : [];
        console.log('parseSongs from ', webSiteDir + "/music/");
        parseSongs(webSiteDir + "/music/", (err, result) => {
            // console.log('parseSongs', err, result);
            if(err) throw err;
            let dataMap = result;
            dataMap["playlists"] = playlists;
            fs.writeFile("./music_library.json", JSON.stringify(dataMap, null, '  '), "utf8", callback=>{
                // console.log('music_library', dataMap);
                res.writeHead(200, {"Content-Type":"application/json"});
                res.end(JSON.stringify(dataMap));
            });
        });
    } else {
        res.end(JSON.stringify({
            "songs":{},
            "albums":{},
            "artists":{},
            "playlists":{},
            "genres":{},
            "all":{}
        }));
    }
}

const addPlaylist = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        let name = fields.playlistName;
        let dataMap = require("./music_library.json");
        dataMap["playlists"][name] = [];
        fs.writeFile("music_library.json", JSON.stringify(dataMap, null, '  '), "utf8", callback=>{
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(dataMap));
        });
    });
}

const addToPlaylist = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        let playlist = fields.playlist;
        let songs = fields.songs;
        let dataMap = require("./music_library.json");
        dataMap["playlists"][playlist] = dataMap["playlists"][playlist].concat(songs);
        fs.writeFile("music_library.json", JSON.stringify(dataMap, null, '  '), "utf8", callback=>{
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(dataMap));
        });
    });
}

const removeFromPlaylist = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        let playlist = fields.activeIndex;
        let number = fields.number;
        let dataMap = require("./music_library.json");
        dataMap["playlists"][playlist].splice(number, 1);
        fs.writeFile("music_library.json", JSON.stringify(dataMap, null, '  '), "utf8", callback=>{
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(dataMap));
        });
    });
}

const deletePlaylist = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        let playlist = fields.playlist;
        let dataMap = require("./music_library.json");
        delete dataMap["playlists"][playlist];
        fs.writeFile("music_library.json", JSON.stringify(dataMap, null, '  '), "utf8", callback=>{
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(dataMap));
        });
    });
}

const editPlaylistName = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        let oldName = fields.oldName;
        let newName = fields.newName;
        let dataMap = require("./music_library.json");
        let temp = dataMap["playlists"][oldName];
        delete dataMap["playlists"][oldName];
        dataMap["playlists"][newName] = temp;
        fs.writeFile("music_library.json", JSON.stringify(dataMap, null, '  '), "utf8", callback=>{
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(dataMap));
        });
    });
}

createServer(handler).listen(5000);

console.log("Listening at 5000...");

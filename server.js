const fs = require('fs');
const formidable = require('formidable');
const createServer = require('http').createServer;
const parseSongs = require('./parse.js').parseSongs;

const webSiteDir = './client/build';

const MUSIC_FILENAME = './music';

const handler = (req, res) => {
    // console.log('request', req.url, req.method, req.body);
    let dest = req.url;

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Max-Age": 2592000, // 30 days
    };
    if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
    }
  
    if (["GET", "POST"].indexOf(req.method) > -1) {
        res.writeHead(200, headers);
    }

    // console.log('method', req.method.toLowerCase(), dest);
    if(req.method.toLowerCase() === 'get') {
        switch(dest) {
            case '/getPlaylists':
                getPlaylists(req, res);
                break;
            case '/getSongs':
                getSongs(req, res);
                break;
            case '/getWallpapers':
                getWallpapers(req, res);
                break;
            case '/refreshData':
                refreshData(req, res);
                break;
            case '/readCurrentSong':
                readCurrentSong(req, res);
                break;
            default:
                res.end();
        }
    } else if(req.method.toLowerCase() === 'post') {
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
            case '/writeCurrentSong':
                writeCurrentSong(req, res);
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

const getDataMap = () => {
    return JSON.parse(fs.readFileSync(MUSIC_FILENAME));
    // return require(MUSIC_FILENAME);
}

const getSongs = (req, res) => {
    let dataMap = fs.existsSync(MUSIC_FILENAME) ? getDataMap() : {
        "songss": {},
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
        const playlists = fs.existsSync(MUSIC_FILENAME) ? getDataMap().playlists : {};
        console.log('parseSongs from ', webSiteDir + "/music/");
        parseSongs(webSiteDir + "/music/", (err, result) => {
            // console.log('parseSongs', err, result);
            if(err) throw err;
            let dataMap = result;
            dataMap["playlists"] = playlists;
            console.log('dataMap', dataMap["playlists"]);

            fs.writeFile(MUSIC_FILENAME, JSON.stringify(dataMap, null, '  '), "utf8", callback => {
                // console.log('music', dataMap);
                // res.writeHead(200, {"Content-Type":"application/json"});
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

const getPlaylists = (req, res) => {
    let dataMap = fs.existsSync('./playlists.json') ? require("./playlists.json") : { "playlists": {} };
    // console.log(JSON.stringify(dataMap));
    res.end(JSON.stringify(dataMap));
}

const addPlaylist = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        let name = fields.playlistName;
        // if (!fs.existsSync(MUSIC_FILENAME)) fs.writeFileSync(MUSIC_FILENAME, JSON.stringify({ playlists: {} }));
        let dataMap = getDataMap();
        dataMap["playlists"][name] = [];
        fs.writeFile(MUSIC_FILENAME, JSON.stringify(dataMap, null, '  '), "utf8", callback=>{
            // res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(dataMap));
        });
    });
}

const addToPlaylist = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        let playlist = fields.playlist;
        let songs = fields.songs;
        let dataMap = getDataMap();

        if (dataMap["playlists"][playlist].includes(songs[0])) {
            res.end(JSON.stringify(dataMap));
        }

        if (dataMap["playlists"][playlist]) dataMap["playlists"][playlist] = dataMap["playlists"][playlist].concat(songs);
        fs.writeFile(MUSIC_FILENAME, JSON.stringify(dataMap, null, '  '), "utf8", callback=>{
            // res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(dataMap));
        });
    });
}

const removeFromPlaylist = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        let playlist = fields.activeIndex;
        let number = fields.number;
        let dataMap = getDataMap();
        dataMap["playlists"][playlist].splice(number, 1);
        fs.writeFile(MUSIC_FILENAME, JSON.stringify(dataMap, null, '  '), "utf8", callback=>{
            // res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(dataMap));
        });
    });
}

const deletePlaylist = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        let playlist = fields.playlist;
        let dataMap = getDataMap();
        delete dataMap["playlists"][playlist];
        fs.writeFile(MUSIC_FILENAME, JSON.stringify(dataMap, null, '  '), "utf8", callback => {
            // res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(dataMap));
        });
    });
}

const editPlaylistName = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        let oldName = fields.oldName;
        let newName = fields.newName;
        let dataMap = getDataMap();
        let temp = dataMap["playlists"][oldName];
        delete dataMap["playlists"][oldName];
        dataMap["playlists"][newName] = temp;
        fs.writeFile(MUSIC_FILENAME, JSON.stringify(dataMap, null, '  '), "utf8", callback=>{
            // res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(dataMap));
        });
    });
}

const currentSongFile = 'song';

const writeCurrentSong = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        // console.log('writeCurrentSong', form, fields);
        if (fields.name) fs.writeFileSync(currentSongFile, JSON.stringify(fields));
        res.end(JSON.stringify({ok: 'ok'}));
    });    
}

const readCurrentSong = (req, res) => {
    const data = fs.readFileSync(currentSongFile, { encoding: 'utf8' });
    const time = fs.statSync(currentSongFile);
    const out = { ...JSON.parse(data), time: time.mtime };
    // console.log('out', out);
    res.end(JSON.stringify(out));

    // fs.watchFile(currentSongFile, (curr, prev) => {
    //     console.log(`the current mtime is: ${curr.mtime}`);
    //     console.log(`the previous mtime was: ${prev.mtime}`);
    //     const song = fs.readFileSync(currentSongFile, { encoding: 'utf8' });
    //     res.send(JSON.stringify({ song }));
    // });
}

createServer(handler).listen(5000);

console.log("Listening at 5000...");

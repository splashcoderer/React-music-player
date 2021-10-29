const fs = require("fs");
const path = require("path");
const sh = require("shorthash");

const mm = require("music-metadata");
// const util = require("util");

const webSiteDir = 'client/build';

function translit(word){
	var answer = '';
	var converter = {
		'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
		'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
		'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
		'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
		'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
		'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
		'э': 'e',    'ю': 'yu',   'я': 'ya',
 
		'А': 'A',    'Б': 'B',    'В': 'V',    'Г': 'G',    'Д': 'D',
		'Е': 'E',    'Ё': 'E',    'Ж': 'Zh',   'З': 'Z',    'И': 'I',
		'Й': 'Y',    'К': 'K',    'Л': 'L',    'М': 'M',    'Н': 'N',
		'О': 'O',    'П': 'P',    'Р': 'R',    'С': 'S',    'Т': 'T',
		'У': 'U',    'Ф': 'F',    'Х': 'H',    'Ц': 'C',    'Ч': 'Ch',
		'Ш': 'Sh',   'Щ': 'Sch',  'Ь': '',     'Ы': 'Y',    'Ъ': '',
		'Э': 'E',    'Ю': 'Yu',   'Я': 'Ya'
	};
 
	for (var i = 0; i < word.length; ++i ) {
		if (converter[word[i]] == undefined){
			answer += word[i];
		} else {
			answer += converter[word[i]];
		}
	}
 
	return answer;
}

const parseSongs = (dir, done) => {
    let results = {
        "songs":{},
        "albums":{},
        "artists":{},
        "playlists":{},
        "genres":{},
        "all":{}
    };
    // console.log('parseSongs() dir=', dir);
    fs.readdir(dir, (err, list) => {
        if (err) return done(err);
        console.log('list', list);
        var pending = list.length;
        if (!pending) return done(null, results);

        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {

                    // let dirName = path.basename(file);
                    // let newname = translit(dirName);
                    // newname = newname.replace(/\s+/g,'-');
                    // // console.log('dirName', dir + "/" + newname);
                    // // fs.renameSync(file, dir + newname, function(err){if (err) throw err;});
                    // file = dir + "/" + newname;

                    parseSongs(file, (err, res) => {
                        for (let cat in res) {
                            if (cat !== "all") {
                                if (cat !== "playlists") {
                                    for (let index in res[cat]) {
                                        if (results[cat][index] === undefined) results[cat][index] = [];
                                        results[cat][index] = results[cat][index].concat(res[cat][index]);
                                    }
                                }
                            } else {
                                for (let song in res[cat]) {
                                    results[cat][song] = res[cat][song];
                                }
                            }
                        }
                        if (!--pending) done(null, results);
                    });

                } else {
                    let parent = path.dirname(file).split(path.sep).pop()
                    let ext = path.extname(file);
                    if (ext === ".mp3" || ext === ".flac") {
                        mm.parseFile(file, {native: true})
                            .then(function (metadata) {

                                let tags = metadata.common;

                                let entry = {};
                                
                                let fileName = path.basename(file, path.extname(file));
                                    
                                if(tags.title === undefined) {
                                    entry.title = fileName;
                                } else {
                                    entry.title = tags.title;
                                }

                                newFileName = fileName + ext;
                                // let newFileName = translit(fileName);
                                // newFileName = newFileName.replace(/\s+/g,'-') + ext;
                                // newFileName = fileName.replace(/[^a-zA-Z0-9\-.]/g,'-') + ext;
                                // console.log('newFileName', dir + "/" + newFileName);
                                // fs.rename(file, dir + "/" + newFileName, function(err){if(err) throw err;});

                                if(tags.picture) {
                                    let binaryData = new Buffer.from(tags.picture[0].data, 'base64').toString('binary');
                                    let coverName = (tags.album) ? tags.album : entry.title;
                                    coverName = coverName.replace(/\s+/g,'-');
                                    coverName = translit(coverName);//coverName.replace(/[^a-zA-Z0-9\-.]/g,'-');
                                    let coverExt = tags.picture[0].format;
                                    let fileName = "/" + coverName + "." + coverExt;
                                    let coverPath = webSiteDir + "/covers" + fileName;
                                    fs.writeFile(
                                        coverPath, 
                                        binaryData, 
                                        "binary", 
                                        function(err){
                                            // console.log("No album art");
                                        });
                                    entry.cover = fileName;
                                } else {
                                    entry.cover = "";
                                }

                                let musicPath = path.relative(process.cwd(), dir + "/" + newFileName);
                                musicPath = musicPath.split(webSiteDir + '/music')[1];
                                entry.path = musicPath; //path.relative(process.cwd(), dir + "/" + newFileName);
                                    
                                entry.artist = (tags.artist === undefined) ? "" : tags.artist;
                                entry.album = (tags.album === undefined) ? "" : tags.album;
                                entry.genre = (tags.genre === undefined) ? [] : tags.genre;

                                const id = sh.unique(musicPath) // Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
                                results["all"][id] = entry;

                                if(results["songs"][parent] === undefined)
                                    results["songs"][parent] = [];
                                if(results["artists"][entry.artist] === undefined)
                                    results["artists"][entry.artist] = [];
                                if(results["albums"][entry.album] === undefined)
                                    results["albums"][entry.album] = [];

                                results["songs"][parent].push(id);
                                results["artists"][entry.artist].push(id);
                                results["albums"][entry.album].push(id);
                                
                                for (let genre in entry.genre) {
                                    if(results["genres"][entry.genre[genre]] === undefined) results["genres"][entry.genre[genre]] = [];
                                    results["genres"][entry.genre[genre]].push(id);
                                }

                                if (!--pending) done(null, results);
                            })
                            .catch(function (err) {
                                console.error(err);
                            });
                    } else {
                        if (!--pending) done(null, results);
                    }
                }
            });
        });
    });
}

module.exports = {
    parseSongs
}

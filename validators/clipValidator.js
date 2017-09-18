const validator = require('validator');

let validateClip = (clip) =>{
    if(!validator.isURL(clip.url)){
        throw("clip url must be a valid url")
    }

    if (typeof clip.streamer !== 'string'){
        throw("clip streamer was not a string");
    }

    if (!validator.isISO8601(clip.createdAt)){
        throw("clip createAt was not a valid date");
    } 
}

let validateQuery = (query) =>{
    if(typeof query.streamer !== 'string'){
        throw("streamer is required and must be a string in the query")
    }

}

exports.validateQuery = validateQuery;
exports.validateClip = validateClip;


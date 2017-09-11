const moment = require('moment');

let validateClip = (clip) =>{
    if (typeof clip.url !== 'string') {
        throw("clip url was not a string");
    }

    if (typeof clip.streamer !== 'string'){
        throw("clip streamer was not a string");
    }

    const mDate = moment(clip.createdAt);
    if (!mDate.isValid()){
        throw("clip createAt was not a date");
    } 
}

let validateQuery = (query) =>{
    if (!query) {
        throw("query for clips is required")
    }

    if (!query.streamer){
        throw("streamer is a required paramter in clip query")
    }

    if(typeof query.streamer !== 'string'){
        throw("streamer must be a string in the query")
    }

}

exports.validateQuery = validateQuery;
exports.validateClip = validateClip;


const moment = require('moment');

let validateClip = function(clip){
    if (typeof clip.url !== 'string') {
        throw("clip url was not a string");
    }

    if (typeof clip.streamer !== 'string'){
        throw("clip streamer was not a string");
    }

    mDate = moment(clip.createdAt);
    if (!mDate.isValid()){
        throw("clip createAt was not a date");
    } 
}

exports.validateClip = validateClip


const expect = require('chai').expect;
const clipValidator = require('../../validators/clipValidator.js');

describe('clipValidator', function(){
    
    describe('validateClip', function(){
        it('should throw an error if url is not a valid url', function(){
            let mockClip = {
                streamer: "testName",
                url: "1"
            }
            errMsg = 'clip url must be a valid url';
            expect(() => clipValidator.validateClip(mockClip)).to.throw(errMsg);
        });

        it('should throw an error if streamer isnt a string', function(){
            let mockClip = {
                streamer: 1,
                url: "www.test.com"
            }
            errMsg = 'clip streamer was not a string';
            expect(() => clipValidator.validateClip(mockClip)).to.throw(errMsg);
        });

        it('should throw an error if createdAt isnt valid', function(){
            let mockClip = {
                streamer: "drdisrepectlive",
                url: "www.test.com",
                createdAt: "invalid date"
            }
            errMsg = 'clip createAt was not a valid date';
            expect(() => clipValidator.validateClip(mockClip)).to.throw(errMsg);
        });


        it('should not throw an error if clip is valid', function(){
            let mockClip = {
                streamer: "drdisrepectlive",
                url: "www.test.com",
                createdAt: "2017-09-05T18:18:30Z"
            }
            clipValidator.validateClip(mockClip);
        });
    });


    describe('validateQuery', function(){
        it('should throw an error if query is empty', function(){
            mockQuery = {}
            errMsg = 'streamer is required and must be a string';
            expect(() => clipValidator.validateQuery(mockQuery)).to.throw(errMsg);
        });

        it('should throw an error if query is an empty string', function(){
            mockQuery = {
                streamer: 1
            }
            errMsg = 'streamer is required and must be a string';
            expect(() => clipValidator.validateQuery(mockQuery)).to.throw(errMsg);
        });


        it('should not throw an error if query is valid', function(){
            mockQuery = {
                streamer: "tesStreamer",
            }
            clipValidator.validateQuery(mockQuery);
        });
    });
});
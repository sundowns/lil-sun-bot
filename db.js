const dbQueryPattern = "http://www.grimtools.com/db/search?query="

module.exports = {
    Init : function() {
        //nothing
    },
    MessageHandler : function(lowercaseContent, msg) {
        var queryString = lowercaseContent.slice(3).trim();
        if (queryString.length < 2) { msg.reply ("Query string too short"); }
        else {
            var urlEncodedQueryString = encodeURI(queryString);
            var queryUrl = dbQueryPattern + urlEncodedQueryString;
            msg.reply(queryUrl);
        }
    }
}

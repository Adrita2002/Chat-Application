const moment = require('moment');//date and time

function formatMessage(username,text){
    return {
        username,
        text,
        time:moment().format('h:mm a')//hour:minute am/pm
    }

}

module.exports = formatMessage;
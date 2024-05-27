const {
    model,
    Schema
} = require("mongoose");

const githubSchema = new Schema({
    guild: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    lastProcessedEvent: {
        type: Date,
        default: null
    }
});

module.exports = model('GithubNotification', githubSchema);
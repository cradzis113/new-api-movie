const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;

const videoSchema = new Schema({
    imageInfo: {
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: [],
        required: true
    },
    videoInfo: {
        name: {
            type: String,
            required: true
        },
        childVideoInfo: [
            {
                episode: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    movLink: {
        type: String
    },
    character: {
        type: [
            {
                characterName: {
                    type: String,
                },
                realName: {
                    type: String,
                },
                fileName: {
                    type: String,
                },
                url: {
                    type: String,
                }
            }
        ],
        default: null,
    },
    view: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    totalRating: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: String,
        default: moment().format('ll')
    }
});

const DataMovie = mongoose.model('DataMovie', videoSchema);

module.exports = DataMovie;

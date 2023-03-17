import mongoose from 'mongoose'

const TeamSchema = new mongoose.Schema({
    name: {type: String, required: true},
    dateCreated: Date,
    dateUpdated: Date,
    domain: {type: String, required: true},
    basedIn: {type: String, required: true},
})

module.exports = mongoose.models.Developer || mongoose.model('Developer', TeamSchema)
import mongoose from 'mongoose'

const TeamSchema = new mongoose.Schema({
    name: {type: String, required: true},
    dateCreated: Date,
    dateUpdated: Date,
    developers: Array,
    scrumMaster: {type: String, required: true},
})

module.exports = mongoose.models.Team || mongoose.model('Team', TeamSchema)
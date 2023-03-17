import dbConnect from "@lib/mongo";
import Team from "@lib/mongo/models/Team";
import {sortComparator} from "@/components/GettingStarted/GettingStartedTable/gettingStartedTableUtils";

dbConnect()

export default async function handler(req, res) {
    const method = req.method

    switch (method) {
        case 'GET':
            try {
                const teams = await Team.find({})
                const sortedTeams = teams.sort((a, b) => sortComparator(a, b, 'dateCreated', 'desc'))

                res.status(200).json({success: true, teams: sortedTeams})
            } catch (error) {
                res.status(400).json({success: false})
            }
            break
        case 'POST':
            try {
                const {name, developers, scrumMaster} = JSON.parse(req.body)
                const newTeam = new Team({
                    name,
                    dateCreated: new Date(),
                    developers,
                    scrumMaster,
                })

                if (!name) res.status(400).json({success: false, message: 'Name is required'})
                if (!scrumMaster) res.status(400).json({success: false, message: 'Scrum master is required'})

                const team = await newTeam.save()
                res.status(201).json({success: true, data: team})
            } catch (error) {
                res.status(400).json({success: false})
            }
            break
        case 'DELETE':
            try {
                const {id} = JSON.parse(req.body)
                const deletedTeam = await Team.findByIdAndDelete(id)
                if (!deletedTeam) res.status(404).json({success: false, message: 'Team not found'})
                res.status(200).json({success: true, data: deletedTeam})
            } catch (error) {
                res.status(400).json({success: false})
            }
            break
        case 'PUT':
            try {
                const {name, developers, scrumMaster, _id} = JSON.parse(req.body)
                const updatedTeam = await Team.findByIdAndUpdate(_id, {
                    name,
                    developers,
                    scrumMaster,
                    dateUpdated: new Date()
                }, {new: true, runValidators: true})
                if (!updatedTeam) res.status(404).json({success: false, message: 'Team not found'})
                res.status(200).json({success: true, data: updatedTeam})
            } catch (error) {
                res.status(400).json({success: false})
            }
            break
        default:
            res.status(400).json({success: false})
            break
    }
}
import dbConnect from "@lib/mongo";
import Developer from "@lib/mongo/models/Developer";
import {sortComparator} from "@/components/GettingStarted/GettingStartedTable/gettingStartedTableUtils";

dbConnect()

export default async function handler(req, res) {
    const method = req.method

    switch (method) {
        case 'GET':
            try {
                const developers = await Developer.find({})
                const sortedDevelopers = developers.sort((a, b) => sortComparator(a, b, 'dateCreated', 'desc'))
                res.status(200).json({success: true, developers: sortedDevelopers})
            } catch (error) {
                res.status(400).json({success: false})
            }
            break
        case 'POST':
            try {
                const {name, domain, basedIn} = JSON.parse(req.body)
                const newDeveloper = new Developer({
                    name,
                    dateCreated: new Date(),
                    domain,
                    basedIn,
                })

                if (!name) res.status(400).json({success: false, message: 'Name is required'})
                if (!domain) res.status(400).json({success: false, message: 'Domain is required'})
                if (!basedIn) res.status(400).json({success: false, message: 'Based in is required'})

                const developer = await newDeveloper.save()
                res.status(201).json({success: true, data: developer})
            } catch (error) {
                res.status(400).json({success: false, error})
            }
            break
        case 'DELETE':
            try {
                const {id} = JSON.parse(req.body)
                const deletedDeveloper = await Developer.findByIdAndDelete(id)

                if (!deletedDeveloper) res.status(404).json({success: false, message: 'Developer not found'})

                res.status(200).json({success: true})
            } catch (error) {
                res.status(400).json({success: false})
            }
            break
        case 'PUT':
            try {
                const {name, domain, basedIn, _id} = JSON.parse(req.body)
                const updatedDeveloper = await Developer.findByIdAndUpdate(_id, {
                    name,
                    domain,
                    basedIn,
                    dateUpdated: new Date()
                }, {new: true, runValidators: true})

                if (!updatedDeveloper) res.status(404).json({success: false, message: 'Developer not found'})

                res.status(200).json({success: true})
            } catch (error) {
                res.status(400).json({success: false})
            }
            break
        default:
            res.status(400).json({success: false})
            break
    }
}
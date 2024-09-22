const express = require('express')

const router = express.Router()

let projects = require('../models/projects')

/* GET project listing */
router.get('/', (req, res) => {
    res.status(200).json(projects)
})

/* GET a specific project */
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const project = projects.find((item) => item.id === id)
        
        if (!project) {
            const error = new Error('Project not found')
            error.code = 404
            throw error
        }

        res.status(200).json(project)
    } catch (e) {
        res.status(e.code || 500).json({ message: e.message })
    }
})

/* POST create a new project */
router.post('/', (req, res) => {
    try {
        // Generate new ID by incrementing the max ID
        const newId = projects.length > 0 ? projects.sort((a, b) => b.id - a.id)[0].id + 1 : 1
        
        // Create the new project
        const newProject = { id: newId, ...req.body }

        // Push to projects array
        projects.push(newProject)

        res.status(201).json(newProject)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

/* PATCH update a project */
router.patch('/:id', (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const project = projects.find((item) => item.id === id)
        
        if (!project) {
            const error = new Error('Project not found')
            error.code = 404
            throw error
        }
        
        const projectIndex = projects.findIndex((item) => item.id === id)
        // Update the project in place
        projects[projectIndex] = { ...project, ...req.body }

        res.status(200).json(projects[projectIndex])
    } catch (e) {
        res.status(e.code || 500).json({ message: e.message })
    }
})

/* DELETE a project */
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const projectIndex = projects.findIndex((item) => item.id === id)

        if (projectIndex === -1) {
            const error = new Error('Project not found')
            error.code = 404
            throw error
        }

        // Filter out the project
        projects = projects.filter((item) => item.id !== id)

        res.status(200).json({ message: `Project ${id} deleted`, projects: projects })
    } catch (e) {
        res.status(e.code || 500).json({ message: e.message })
    }
})

module.exports = router
const request = require('supertest')
const app = require('../app')

let projects = require('../models/projects')

describe('Projects API', () => {
    /* Test GET all projects */
    it('GET /projects - should return all projects', async () => {
        const res = await request(app).get('/projects')
        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(10)
    })

    /* Test GET single project */
    it('GET /projects/:id - should return a single project', async () => {
        const res = await request(app).get('/projects/1')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(projects[0])
    })

    it('GET /projects/:id - should return 404 for non-existent project', async () => {
        const res = await request(app).get('/projects/999')
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual('Project not found')
    })

    /* Test POST create a project */
    it('POST /projects - should create a new project', async () => {
        const newProject = { name: 'Project 3', description: 'Description 3' }
        const res = await request(app).post('/projects').send(newProject)

        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('id')
        expect(res.body.name).toEqual(newProject.name)
        expect(res.body.description).toEqual(newProject.description)

        // Vérifier si le projet a bien été ajouté
        const allProjects = await request(app).get('/projects')
        expect(allProjects.body.length).toBe(11)
    })

    /* Test PATCH update a project */
    it('PATCH /projects/:id - should update a project', async () => {
        const updatedProject = { status: 'completed' }
        const res = await request(app).patch('/projects/1').send(updatedProject)

        expect(res.statusCode).toEqual(200)
        expect(res.body.status).toEqual(updatedProject.status)
    })

    it('PATCH /projects/:id - should return 404 for non-existent project', async () => {
        const res = await request(app)
            .patch('/projects/999')
            .send({ name: 'Non-existent' })
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual('Project not found')
    })

    /* Test DELETE a project */
    it('DELETE /projects/:id - should delete a project', async () => {
        const res = await request(app).delete('/projects/1')
        expect(res.statusCode).toEqual(200)

        // Vérifier que le projet a bien été supprimé
        const allProjects = await request(app).get('/projects')
        expect(allProjects.body.find((p) => p.id === 1)).toBeUndefined()
    })

    it('DELETE /projects/:id - should return 404 for non-existent project', async () => {
        const res = await request(app).delete('/projects/999')
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual('Project not found')
    })
})

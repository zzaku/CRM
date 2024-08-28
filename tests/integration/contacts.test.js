const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Contact = require('../models/Contact');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());

connectDB();

app.use('/api/contacts', require('../routes/contacts'));

app.use(errorHandler);

describe('Contacts API', () => {

    beforeAll(async () => {
        await Contact.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('doit créer un contact', async () => {
        const res = await request(app)
            .post('/api/contacts')
            .send({
                firstname: 'John',
                lastname: 'Doe',
                email: 'john.doe@example.com',
                phone: '1234567890'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('firstname', 'Jane');
        expect(res.body).toHaveProperty('lastname', 'Doe');
        expect(res.body).toHaveProperty('email', 'john.doe@example.com');
        expect(res.body).toHaveProperty('phone', '1234567890');
    });

    it('doit récupérer touts les contacts', async () => {
        const res = await request(app).get('/api/contacts');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('doit modifier un contact existant', async () => {
        const contact = new Contact({
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890'
        });
        await contact.save();

        const res = await request(app)
            .put(`/api/contacts/${contact._id}`)
            .send({
                firstname: 'Jane',
                lastname: 'Doe',
                email: 'jane.doe@example.com',
                phone: '0987654321'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('firstname', 'Jane');
        expect(res.body).toHaveProperty('lastname', 'Doe');
        expect(res.body).toHaveProperty('email', 'jane.doe@example.com');
        expect(res.body).toHaveProperty('phone', '0987654321');
    });

    it('doit supprimer un contact existant', async () => {
        const contact = new Contact({
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890'
        });
        await contact.save();

        const res = await request(app).delete(`/api/contacts/${contact._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Contact supprimé avec succès');

        const findRes = await Contact.findById(contact._id);
        expect(findRes).toBeNull();
    });

    it("renvoie 404 si modification d'un contact inexistant", async () => {
        const nonExistingId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .put(`/api/contacts/${nonExistingId}`)
            .send({
                firstname: 'Test',
                lastname: 'User',
                email: 'test.user@example.com',
                phone: '1234567890'
            });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Contact non trouvé');
    });

    it("renvoie 404 si suppression d'un contact inexistant", async () => {
        const nonExistingId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/api/contacts/${nonExistingId}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Contact non trouvé');
    });
});

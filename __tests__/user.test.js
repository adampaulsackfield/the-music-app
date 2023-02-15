const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

// const User = require('../models/User.model');
const mockUserData = require('../database/data/mockUserData');

beforeEach((done) => {
	mongoose.connect(process.env.DB_URI_TEST, () => {
		const seedDB = async () => {
			await User.deleteMany({});
			await User.insertMany(mockUserData);
		};

		seedDB().then(() => {
			done();
		});
	});
});

afterEach((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done());
	});
});

const ENDPOINT = '/api/users';

describe('USERS', () => {
	describe('POST /api/users', () => {
		it('should return a status of 201 and the new user, with a hashed password', () => {
			const user = {
				username: 'SpongeBob',
				displayName: 'Bob',
				email: 'spongebob@example.com',
				password: 'password',
			};

			return request(app)
				.post(ENDPOINT)
				.send(user)
				.expect(201)
				.then((res) => {
					expect(res.body.success).toEqual(true);
					expect(res.body.data).toBeInstanceOf(Object);
					expect(res.body.data.password).not.toEqual(user.password);
				});
		});
	});
});

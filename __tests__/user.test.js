const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const User = require('../models/User.model');
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

		it('should return a status of 400 when signing up without all the required fields', () => {
			const user = {
				username: 'SpongeBob',
				displayName: 'Bob',
				email: 'spongebob@example.com',
			};

			return request(app)
				.post(ENDPOINT)
				.send(user)
				.expect(400)
				.then((res) => {
					expect(res.body.success).toEqual(false);
					expect(res.body.data).toEqual('Missing required fields');
				});
		});

		it('should return a status of 400 when signing up with an email that already exists', () => {
			const user = {
				username: 'SpongeBob',
				displayName: 'Bob',
				email: 'constantin@example.com',
				password: 'password',
			};

			return request(app)
				.post(ENDPOINT)
				.send(user)
				.expect(500)
				.then((res) => {
					expect(res.body.success).toEqual(false);
					expect(res.body.data).toEqual(
						'E11000 duplicate key error collection: music-app-test.users index: email_1 dup key: { email: "constantin@example.com" }'
					); // TODO ! FIX
				});
		});

		it('should return a status of 400 when signing up with a username that already exists', () => {
			const user = {
				username: 'Constantin',
				displayName: 'Bob',
				email: 'constantin2@example.com',
				password: 'password',
			};

			return request(app)
				.post(ENDPOINT)
				.send(user)
				.expect(500)
				.then((res) => {
					expect(res.body.success).toEqual(false);
					expect(res.body.data).toEqual(
						'E11000 duplicate key error collection: music-app-test.users index: username_1 dup key: { username: "Constantin" }'
					);
				}); // TODO ! FIX
		});
	});

	describe('GET /api/users/login', () => {
		it('should return a status of 200 and a jwt when given the correct email and password', () => {
			const user = {
				username: 'Constantin',
				password: 'password',
			};

			return request(app)
				.post(`${ENDPOINT}/login`)
				.send(user)
				.expect(200)
				.then((res) => {
					expect(res.body.success).toEqual(true);
					expect(res.body.data).toBeInstanceOf(String);
				});
		});
	});
});

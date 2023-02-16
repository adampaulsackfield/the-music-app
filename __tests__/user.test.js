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
				.expect(400)
				.then((res) => {
					expect(res.body.success).toEqual(false);
					expect(res.body.data).toEqual(
						`User validation failed: email: Error, expected \`email\` to be unique. Value: \`${user.email}\``
					);
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
				.expect(400)
				.then((res) => {
					expect(res.body.success).toEqual(false);
					expect(res.body.data).toEqual(
						`User validation failed: username: Error, expected \`username\` to be unique. Value: \`${user.username}\``
					);
				});
		});
	});

	describe('POST /api/users/login', () => {
		it('should return a status of 200 and a jwt when given the correct email and password', () => {
			const user = {
				email: 'constantin@example.com',
				password: 'password',
			};

			return request(app)
				.post(`${ENDPOINT}/login`)
				.send(user)
				.expect(200)
				.then((res) => {
					expect(res.body.success).toEqual(true);
				});
		});

		it('should should return a status of 401 and given the incorrect password', () => {
			const user = {
				email: 'constantin@example.com',
				password: 'password2',
			};

			return request(app)
				.post(`${ENDPOINT}/login`)
				.send(user)
				.expect(401)
				.then((res) => {
					expect(res.body.success).toEqual(false);
					expect(res.body.data).toEqual('Invalid login credentials');
				});
		});

		it('should should return a status of 401 and given the incorrect email address', () => {
			const user = {
				email: 'constantin11@example.com',
				password: 'password',
			};

			return request(app)
				.post(`${ENDPOINT}/login`)
				.send(user)
				.expect(401)
				.then((res) => {
					expect(res.body.success).toEqual(false);
					expect(res.body.data).toEqual('Invalid login credentials');
				});
		});
	});

	describe('GET /api/users/profile', () => {
		it('should return a status code of 200 and the users profile when presented with a valid JWT', async () => {
			const user = {
				email: 'constantin@example.com',
				password: 'password',
			};

			const loginResponse = await request(app)
				.post(`${ENDPOINT}/login`)
				.send(user);
			const userToken = loginResponse.body.data;

			return request(app)
				.get(`${ENDPOINT}/profile`)
				.set('Authorization', `Bearer ${userToken}`)
				.expect(200)
				.then((res) => {
					expect(res.body.success).toEqual(true);
					expect(res.body.data.email).toEqual(user.email);
					expect(res.body.data.displayName).toEqual('Constantin Coica');
					expect(res.body.data.username).toEqual('Constantin');
					expect(res.body.data.password).toBe(undefined);
				});
		});

		it('should return a status code of 401 when not provided with a JWT', async () => {
			const user = {
				email: 'constantin@example.com',
				password: 'password',
			};

			// const loginResponse = await request(app)
			// 	.post(`${ENDPOINT}/login`)
			// 	.send(user);
			// const userToken = loginResponse.body.data;

			return (
				request(app)
					.get(`${ENDPOINT}/profile`)
					// .set('Authorization', `Bearer ${userToken}`)
					.expect(401)
					.then((res) => {
						expect(res.body.success).toEqual(false);
						expect(res.body.data).toEqual('Not authorized. No token');
					})
			);
		});

		it('should return a status code of 401 when not provided with an invalid JWT', async () => {
			const user = {
				email: 'constantin@example.com',
				password: 'password',
			};

			const loginResponse = await request(app)
				.post(`${ENDPOINT}/login`)
				.send(user);
			const userToken = loginResponse.body.data;

			return request(app)
				.get(`${ENDPOINT}/profile`)
				.set('Authorization', `Bearer ${userToken}s`)
				.expect(401)
				.then((res) => {
					expect(res.body.success).toEqual(false);
					expect(res.body.data).toEqual('Not authorized');
				});
		});
	});
});

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
					expect(res.body.success).toBe(true);
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
					expect(res.body.success).toBe(false);
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
					expect(res.body.success).toBe(false);
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
					expect(res.body.success).toBe(false);
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
					expect(res.body.success).toBe(true);
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
					expect(res.body.success).toBe(false);
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
					expect(res.body.success).toBe(false);
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
					expect(res.body.success).toBe(true);
					expect(res.body.data.email).toEqual(user.email);
					expect(res.body.data.displayName).toEqual('Constantin Coica');
					expect(res.body.data.username).toEqual('Constantin');
					expect(res.body.data.password).toBe(undefined);
				});
		});

		it('should return a status code of 401 when not provided with a JWT', async () => {
			return request(app)
				.get(`${ENDPOINT}/profile`)
				.expect(401)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.data).toEqual('Not authorized. No token');
				});
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
					expect(res.body.success).toBe(false);
					expect(res.body.data).toEqual('Not authorized');
				});
		});
	});

	describe('PUT /api/users/profile', () => {
		// TODO - Add testing for duplicate keys - like changing your email to one that already exists. update password will be a different endpoint
		it('should return a status code of 200 and the updated user when given the correct password', async () => {
			const user = {
				email: 'constantin@example.com',
				password: 'password',
			};

			const loginResponse = await request(app)
				.post(`${ENDPOINT}/login`)
				.send(user);

			const updatedUser = {
				displayName: 'Updated Name',
				password: 'password',
			};

			return request(app)
				.put(`${ENDPOINT}/profile`)
				.set('Authorization', `Bearer ${loginResponse.body.data}`)
				.send(updatedUser)
				.expect(200)
				.then((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data.displayName).toEqual(updatedUser.displayName);
				});
		});

		it('should return a status code of 400 when given the incorrect password', async () => {
			const user = {
				email: 'constantin@example.com',
				password: 'password',
			};

			const loginResponse = await request(app)
				.post(`${ENDPOINT}/login`)
				.send(user);

			const updatedUser = {
				displayName: 'Updated Name',
				password: 'wrong',
			};

			return request(app)
				.put(`${ENDPOINT}/profile`)
				.set('Authorization', `Bearer ${loginResponse.body.data}`)
				.send(updatedUser)
				.expect(400)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.data).toEqual('Incorrect password');
				});
		});

		it('should return a status code of 401 when not authorized', async () => {
			return request(app)
				.put(`${ENDPOINT}/profile`)
				.expect(401)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.data).toEqual('Not authorized. No token');
				});
		});
	});

	describe('DELETE /api/users/profile', () => {
		it('should return a status code of 200 when successfully deleting a user', async () => {
			const user = {
				email: 'constantin@example.com',
				password: 'password',
			};

			const loginResponse = await request(app)
				.post(`${ENDPOINT}/login`)
				.send(user);

			return request(app)
				.delete(`${ENDPOINT}/profile`)
				.set('Authorization', `Bearer ${loginResponse.body.data}`)
				.expect(200)
				.then((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data).toEqual(
						"Constantin Coica's account has successfully been deleted."
					);
				});
		});

		it('should return a status code of 401 when not authorized', async () => {
			return request(app)
				.delete(`${ENDPOINT}/profile`)
				.expect(401)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.data).toEqual('Not authorized. No token');
				});
		});
	});

	describe('GET /api/users/:id/follow', () => {
		it('should return a status code of 200 and a success message when successful follow is created', async () => {
			const followingUser = {
				email: 'constantin@example.com',
				password: 'password',
			};

			const loginResponse = await request(app)
				.post(`${ENDPOINT}/login`)
				.send(followingUser);

			const users = await request(app).get(`${ENDPOINT}`);

			const followingUserToken = loginResponse.body.data;
			const followeeUserId = users.body.data[1]._id;

			return request(app)
				.get(`${ENDPOINT}/${followeeUserId}/follow`)
				.set('Authorization', `Bearer ${followingUserToken}`)
				.expect(200)
				.then((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data).toEqual('Adam Sackfield has been followed');
				});
		});

		it('should return a status code of 401 when not authorized', async () => {
			return request(app)
				.get(`${ENDPOINT}/7264872648724/follow`)
				.expect(401)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.data).toEqual('Not authorized. No token');
				});
		});

		it('should return a status code of 400 when provided invalid param', async () => {
			const followingUser = {
				email: 'constantin@example.com',
				password: 'password',
			};

			const loginResponse = await request(app)
				.post(`${ENDPOINT}/login`)
				.send(followingUser);

			const followingUserToken = loginResponse.body.data;

			return request(app)
				.get(`${ENDPOINT}/63efad0430cca9fab0c253c8/follow`)
				.set('Authorization', `Bearer ${followingUserToken}`)
				.expect(400)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.data).toEqual(
						'Something went wrong with the follow request'
					);
				});
		});
	});

	describe('GET /api/users/:id/unfollow', () => {
		it('should return a status code of 200 and a success message when successful unfollow is complete', async () => {
			const unFollowingUser = {
				email: 'constantin@example.com',
				password: 'password',
			};

			const loginResponse = await request(app)
				.post(`${ENDPOINT}/login`)
				.send(unFollowingUser);

			const users = await request(app).get(`${ENDPOINT}`);

			const unFollowingUserToken = loginResponse.body.data;
			const unFolloweeUserId = users.body.data[1]._id;

			return request(app)
				.get(`${ENDPOINT}/${unFolloweeUserId}/unfollow`)
				.set('Authorization', `Bearer ${unFollowingUserToken}`)
				.expect(200)
				.then((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data).toEqual('Adam Sackfield has been unfollowed');
				});
		});

		it('should return a status code of 401 when not authorized', async () => {
			return request(app)
				.get(`${ENDPOINT}/7264872648724/unfollow`)
				.expect(401)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.data).toEqual('Not authorized. No token');
				});
		});

		it('should return a status code of 400 when provided invalid param', async () => {
			const followingUser = {
				email: 'constantin@example.com',
				password: 'password',
			};

			const loginResponse = await request(app)
				.post(`${ENDPOINT}/login`)
				.send(followingUser);

			const followingUserToken = loginResponse.body.data;

			return request(app)
				.get(`${ENDPOINT}/63efad0430cca9fab0c253c8/unfollow`)
				.set('Authorization', `Bearer ${followingUserToken}`)
				.expect(400)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.data).toEqual(
						'Something went wrong with the unfollow request'
					);
				});
		});
	});
});

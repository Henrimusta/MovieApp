let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app'); // Ensure this path is correct
let should = chai.should();

chai.use(chaiHttp);

// Global variables for username and password
let testUsername = `testuser_${Date.now()}`;
let testPassword = "password";
let jwtToken;

describe('/GET user', () => {
    it('it should GET all the users', function(done) {
        this.timeout(5000); // Adjust timeout if needed
        chai.request(server)
            .get('/user') // Adjust the endpoint if needed
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                // You can add more assertions here based on the expected structure
                done();
            });
    });
});

describe('User Management Tests', () => {
    describe('/POST register', () => {
        it('it should register a new user', (done) => {
            chai.request(server)
                .post('/user/register')
                .send({ uname: testUsername, pw: testPassword })
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });

        it('it should not allow registering the same username twice', (done) => {
            chai.request(server)
                .post('/user/register')
                .send({ uname: testUsername, pw: testPassword })
                .end((err, res) => {
                    res.should.have.status(409); // Expecting a conflict error
                    done();
                });
        });

        it('it should not allow registering with invalid data', (done) => {
            chai.request(server)
                .post('/user/register')
                .send({ uname: "", pw: "" }) // Sending invalid data
                .end((err, res) => {
                    res.should.have.status(400); // Bad Request for invalid data
                    done();
                });
        });

        it('it should enforce password strength/format rules', (done) => {
            let weakPassword = '12345'; // Example of a weak password, keeping this really simple for developing/testing
            chai.request(server)
                .post('/user/register')
                .send({ uname: `testuser_${Date.now()}`, pw: weakPassword })
                .end((err, res) => {
                    res.should.have.status(422); // Expecting failure due to weak password
                    done();
                });
        });
    });





    // Test for logging in a user
    describe('/POST login', () => {
        it('it should log in a user with correct credentials', (done) => {
            let credentials = {
                uname: testUsername,
                pw: testPassword
            };
            chai.request(server)
                .post('/user/login')
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('jwtToken');
                    jwtToken = res.body.jwtToken; // Store the JWT token
                    done();
                });
        });

        it('it should not log in a user with incorrect credentials', (done) => {
            let credentials = {
                uname: testUsername,
                pw: 'wrongPassword'
            };
            chai.request(server)
                .post('/user/login')
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(401); // Unauthorized status
                    should.not.exist(res.body.jwtToken);
                    done();
                });
        });
    
        it('it should not log in a user with missing credentials', (done) => {
            chai.request(server)
                .post('/user/login')
                .send({})
                .end((err, res) => {
                    res.should.have.status(401); // Bad Request status
                    should.not.exist(res.body.jwtToken);
                    done();
                });
        });
    });

    describe('Password Change Tests', () => {
        // Ensure the user is registered and logged in before running these tests
        before((done) => {
            // Register and log in the user, then store the JWT token in jwtToken
            // ...
            done();
        });
    
        it('it should change the user password', (done) => {
            let passwordChangeDetails = {
                currentPassword: testPassword,
                newPassword: "newPassword123"
            };
            chai.request(server)
                .put('/user/change-password')
                .set('Authorization', `Bearer ${jwtToken}`)
                .send(passwordChangeDetails)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Password changed successfully');
                    done();
                });
        });
    
        it('it should log in with the new password', (done) => {
            let credentials = {
                uname: testUsername,
                pw: "newPassword123"
            };
            chai.request(server)
                .post('/user/login')
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('jwtToken');
                    done();
                });
        });
    
        it('it should not log in with the old password', (done) => {
            let credentials = {
                uname: testUsername,
                pw: testPassword
            };
            chai.request(server)
                .post('/user/login')
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(401); // Unauthorized status expected
                    done();
                });
        });
    
        // After tests, reset any changes made to the test environment
        after((done) => {
            // Reset user password back to the original, if necessary
            // ...
            done();
        });
    });


    // These extra describe POST blocks is for testing the delete user functionality more thoroughly

    // Test for adding data to personalpage
      describe('/POST to personalpage (2 table)', () => {
        it('it should add a personal link for the user', (done) => {
            let personalLinkData = { linkName: 'TestLink', personalLink: 'http://example.com' };
            chai.request(server)
                .post('/user/addLink') // Ensure the endpoint matches
                .set('Authorization', `Bearer ${jwtToken}`) // Use the JWT token obtained from login
                .send(personalLinkData)
                .end((err, res) => {
                    res.should.have.status(201); // Expecting a successful creation status code
                    // Further assertions to verify the link data can be added here
                    done();
                });
        });
    });

      // Test for adding data to actor review
   // Test for adding an actor review
    describe('/POST to addActorReview (table 3)', () => {
    it('it should add an actor review for the user', (done) => {
        let actorReviewData = {
        date: '2023-01-01',
            actorname: 'Keanu Reeves',
            movie: 'John Wick',
            content: 'Great performance!',
           votescore: 5
        };
        chai.request(server)
            .post('/user/addActorReview')
            .set('Authorization', `Bearer ${jwtToken}`) // Käytä saamaasi JWT-tokenia
            .send(actorReviewData)
            .end((err, res) => {
              res.should.have.status(201); // Odottaa onnistunutta luomisen tilakoodia
                 //Tässä voit lisätä lisää väittämiä varmistaaksesi, että arvostelu on tallennettu oikein
                done();
           });
    });
    });

    // Test for adding data to Review
    describe('/POST to addMovieReview', () => {
        it('it should add a movie review for the user', (done) => {
            let reviewData = {
                userVS: 9,
                mname: 'The Matrix',
                date: '2023-01-01',
                content: 'Mind-blowing special effects and an intriguing storyline.',
                genre: 'Action'
            };
            chai.request(server)
                .post('/user/addReview') // Olettaen, että endpoint on muotoiltu näin
                .set('Authorization', `Bearer ${jwtToken}`) // Käytä JWT-tokenia autentikointiin
                .send(reviewData)
                .end((err, res) => {
                    res.should.have.status(201); // Odota onnistuneen luontipyyntövastauksen tilakoodia
                    res.body.should.have.property('message', 'Review successfully posted to the database in user routes');
                    done();
                });
        });
    });

    // Test for adding data to groups & groupusers
    describe('/POST to groups & groupusers (4, 5 table)', () => {
        it('it should create a group where the user is admin and member', (done) => {
            let groupData = { gname: 'TestGroup' }; // Example group name
            chai.request(server)
                .post('/user/postGroup') // Ensure the endpoint matches
                .set('Authorization', `Bearer ${jwtToken}`) // Use the JWT token obtained from login
                .send(groupData)
                .end((err, res) => {
                    res.should.have.status(201); // Expecting a successful creation status code
                    res.body.should.have.property('message', 'Group successfully created');
                    done();
                });
        });
    });


   // Test for deleting a user
   describe('/DELETE user and data', () => {
    it('it should delete a user, connected tables and verify deletion', (done) => {
        chai.request(server)
            .delete('/user/delete')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ uname: testUsername }) // Use the global testUsername
            .end((deleteErr, deleteRes) => {
                deleteRes.should.have.status(200); // Expect a 200 status for successful deletion

                // After deletion, verify that the user is no longer in the list of all users
                chai.request(server)
                    .get('/user') // Adjust the endpoint if needed
                    .end((getErr, getRes) => {
                        getRes.should.have.status(200);
                        getRes.body.should.be.a('array');

                        // Check that the deleted user is not in the list
                        const userExists = getRes.body.some(user => user.username === testUsername);
                        userExists.should.be.false;

                        done();
                    });
            });
    });

    it('it should handle deletion of non-existent user gracefully', (done) => {
        chai.request(server)
            .delete('/user/delete')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ uname: 'nonExistentUser' })
            .end((err, res) => {
                res.should.have.status(200); // Expect a 200 status if that's the intended response
                done();
            });
    });

    after((done) => {
        // Delete the test user
        chai.request(server)
            .delete('/user/delete')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ uname: testUsername })
            .end((err, res) => {
                // Check deletion success and call done()
                done();
            });
    });
  });
});
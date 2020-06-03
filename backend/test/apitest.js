let chai = require('chai');
let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
let server = require('../app');
describe('Container', () => {
    describe('/GET container', () => {
        it('it should GET  container', (done) => {
        chai.request(server)
          .get('/container')
          .end((err, res) => {
                (res).should.have.status(200);
                (res.body).should.be.a('object');
                done();
             });
          });
     });
     describe('/POST container', () => {
        it('it should not POST a container without label and hold_id field', (done) => {
            let request = {
                label:"CONTAINER 123",
                hold_id:1,
            }
          chai.request(request)
              .post('/container')
              .send(request)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                done();
              });
        });
   });
});
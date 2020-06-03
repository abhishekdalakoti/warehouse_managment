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
   });
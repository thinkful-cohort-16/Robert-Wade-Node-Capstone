'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

const {Spell, Wizard}=require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// describe('spells list', function () {
//   it('should exist', function () {
//     return chai.request(app)
//       .get('/api/v1/spells')
//       .then(function (res) {
//         res.should.have.status(200);
//       });
//   });
// });

describe('wizardly test db resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });
});

describe('GET endpoint for master spell list', function () {

  it('should return all spells and give correct status', function(done) {

    let response;

    return chai.request(app)
      .get('/api/v1/spells')
      .then(function(res) {
        response = res;
        res.should.have.status(200);
        res.body.should.have.length.of.at.least(1);
        return Spell.count();
      })
      .then(function(count) {
        response.body.should.have.length.of(count);
      });
  });

  it('should return spells in expected format with expected fields', function(done) {

    let resSpell;

    return chai.request(app)
      .get('/api/v1/spells')
      .then(function(res) {
        res.should.be.json;
        res.should.be.a('array');

        res.body.forEach(spell => {
          spell.should.be.a('object');
          spell.should.include.keys('name', 'description', 'level', 'type');  
        });
        resSpell = res.body[0];
        return Spell.findById(resSpell.id);
      })
      .then(function(spell) {
        resSpell.id.should.equal(spell.id);
        resSpell.name.should.equal(spell.id);
        resSpell.description.should.equal(spell.description);
      });
  });
});
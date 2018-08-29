/* global describe beforeEach it */

const { expect } = require('chai')
const db = require('../index')
const User = db.model('user')
const Trait = db.model('trait')

describe('User model', () => {
  beforeEach(() => {
    return db.sync({ force: true })
  })
  let cody, testUser
  beforeEach(async () => {
    const traits = await Promise.all([
      Trait.create({ name: 'Extraversion' }),
      Trait.create({ name: 'EmotionalStability' }),
      Trait.create({ name: 'Agreeableness' }),
      Trait.create({ name: 'Conscientiousness' }),
      Trait.create({ name: 'Intellect / Imagination' }),
    ])
    testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@email.com',
      password: 'test',
      facebookId: 'test',
      age: 1,
      latitude: 40.73061,
      longitude: -73.935242,
      description: 'Hi! Welcome to Accomplice!',
    })
    cody = await User.create({
      email: 'cody@puppybook.com',
      password: 'bones',
      imageUrl: 'nil',
      age: 3,
      description: 'a pug',
      firstName: 'cody',
      lastName: 'the pug',
      latitude: 1,
      longitude: 1,
    })
  })

  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      it('returns true if the password is correct', () => {
        expect(cody.correctPassword('bones')).to.be.equal(true)
      })

      it('returns false if the password is incorrect', () => {
        expect(cody.correctPassword('bonez')).to.be.equal(false)
      })
    })

    describe('getSanitizedDataValues', () => {
      it('does not include secret values', () => {
        expect(cody.getSanitizedDataValues()).to.not.have.property('password')
        expect(cody.getSanitizedDataValues()).to.not.have.property('facebookId')
        expect(cody.getSanitizedDataValues()).to.not.have.property('salt')
      })
      it('includes necessary user information', () => {
        expect(cody.getSanitizedDataValues()).to.have.property('email')
        expect(cody.getSanitizedDataValues()).to.have.property('firstName')
        expect(cody.getSanitizedDataValues()).to.have.property('lastName')
        expect(cody.getSanitizedDataValues()).to.have.property('description')
        expect(cody.getSanitizedDataValues()).to.have.property('age')
        expect(cody.getSanitizedDataValues()).to.have.property('imageUrl')
        expect(cody.getSanitizedDataValues()).to.have.property('latitude')
        expect(cody.getSanitizedDataValues()).to.have.property('longitude')
      })
    })

    // end describe('correctPassword')
  })
  describe('hooks', () => {
    describe('intitializeTraits', () => {
      let codyTraits
      beforeEach(async () => {
        codyTraits = await cody.getTraits()
      })
      it('sets all traits', () => {
        expect(codyTraits).to.have.lengthOf(5)
      })
      it('sets all traits of a newly created user to value 0', () => {
        codyTraits.forEach(trait => expect(trait.user_trait.value).to.equal(0))
      })
    })
    describe('matchWithTestUser', () => {
      let codyMatched
      beforeEach(async () => {
        codyMatched = await cody.getMatched()
      })
      it('matches a newly created user with the test user (the user with id of 1)', () => {
        expect(codyMatched).to.have.lengthOf(1)
        expect(codyMatched[0].dataValues).to.have.property('id', 1)
        expect(codyMatched[0].dataValues).to.have.property('firstName', 'Test')
      })
    })
  }) // end describe('instanceMethods')
}) // end describe('User model')

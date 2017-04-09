require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
})

const assert = require('chai').assert
const VendingMachine = require('../vendingMachine').default
const Person = require('../person').default

describe('Elevator', function() {
  const vendingMachine = new VendingMachine()
  const person = new Person()
  // const alex = new Person('Alex', 100)

  afterEach(function() {
    vendingMachine.reset();
  })

  it('should take a users credits and check for change ', () => {
    // Assert the current status of the vendingMachine is idle
    assert.equal(vendingMachine.state.status, 'idle')
    // Alex inserts a dollar into the vending machine
    vendingMachine.acceptCredit(100)
    // Assert the current status of the vendingMachine is 'credited' after credits inserted
    assert.equal(vendingMachine.state.status, 'credited')
    // Assert the total number of credits is 100 cents ($1.00) after credits inserted
    assert.equal(vendingMachine.state.credits, 100)
    // Assert the total number of change is 0 cents ($0.00) before selection is made
    assert.equal(vendingMachine.state.change, 0)
  })

  it('should alert user if they dont have enough credits', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    vendingMachine.checkCreditAgainstTreat(50, 'A1')
    assert.equal(vendingMachine.state.treatPrice, 75)
    assert.equal(vendingMachine.state.credits, 50)
    assert.equal(vendingMachine.state.message, 'You need more credits')
  })

  it('should dispenseItem if there is enough credits', () => {
    vendingMachine.checkCreditAgainstTreat(75, 'A1')
    assert.equal(vendingMachine.state.treatPrice, 75)
    assert.equal(vendingMachine.state.credits, 75)
    assert.equal(vendingMachine.state.selection, 'A1')
    assert.equal(vendingMachine.state.status, 'vending')
    assert.equal(vendingMachine.state.message, 'Thank you for your purchase!')
  })

  it('should give change if leftover credits', () => {
    person.reset()
    person.insertCredit(100)
    vendingMachine.checkCreditAgainstTreat(100, 'A1')
    assert.equal(vendingMachine.state.treatPrice, 75)
    assert.equal(vendingMachine.state.credits, 100)
    assert.equal(vendingMachine.state.selection, 'A1')
    assert.equal(vendingMachine.state.status, 'vending')
    assert.equal(vendingMachine.state.change, 25)
    assert.equal(vendingMachine.state.message, 'Your refund is 25')
    person.getChangeBack(25)
    assert.equal(person.state.personCredits, 425)
  })

  it('should give correct change', () => {
    vendingMachine.checkCreditAgainstTreat(100, 'A1')
    assert.equal(vendingMachine.state.treatPrice, 75)
    assert.equal(vendingMachine.state.credits, 100)
    assert.equal(vendingMachine.state.selection, 'A1')
    assert.equal(vendingMachine.state.change, 25)
    assert.equal(vendingMachine.state.message, 'Your refund is 25')
  })

  it('should give message if exact credit is entered', () => {
    vendingMachine.checkCreditAgainstTreat(75, 'A1')
    assert.equal(vendingMachine.state.treatPrice, 75)
    assert.equal(vendingMachine.state.credits, 75)
    assert.equal(vendingMachine.state.selection, 'A1')
    assert.equal(vendingMachine.state.change, 0)
    assert.equal(vendingMachine.state.message, 'Thank you for your purchase!')
  })

  it('should run person.insertCredit and update both person and vendingMachine credit', () => {
    person.reset()
    assert.equal(vendingMachine.state.status, 'idle')
    person.insertCredit(75)
    assert.equal(person.state.personCredits, 425)
    setTimeout(()=> {assert.equal(vendingMachine.state.credits, 100)}, 1000)
    setTimeout(()=> {assert.equal(vendingMachine.state.status, 'credited')}, 1000)
  })

  it('should run person.makeSelection and update both person and vendingMachine selection', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    person.makeSelection('B1')
    assert.equal(person.state.personSelection, 'B1')
    setTimeout(()=> {assert.equal(vendingMachine.state.selection, 'B1')}, 1000)
  })


})

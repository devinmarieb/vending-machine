const VendingMachine = require('./vendingMachine').default
import treats from './treats'

export default class Person {
  constructor() {
    // each person starts out with 5 dollars
    this.state = {
      personCredits: 500,
      personSelection: ''
    }
  }

  reset() {
    this.constructor()
  }

  insertCredit(personMoney) {
    this.state.personCredits -= personMoney
  }

  makeSelection(selection) {
    let treat = Object.keys(treats)
    if(treat.includes(selection)) {
      this.state.personSelection = selection
    }
  }

  getChangeBack(change) {
    this.state.personCredits += change
  }

}

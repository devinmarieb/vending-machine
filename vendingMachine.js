const Person = require('./person').default
const person = new Person()
import treats from './treats'

export default class VendingMachine {
  constructor() {
    // status can be ["idle", "credited", "vending"]
    this.state = {
      status: 'idle',
      credits: 0,
      change: 0,
      selection: '',
      treatPrice: '',
      message: ''
    }
  }

  reset() {
    this.constructor()
  }

  acceptCredit(personMoney) {
    person.insertCredit(personMoney)
    this.state.credits = personMoney
    this.state.status = 'credited'
  }

  dispenseItem(selection) {
    let personMoney = this.state.credits - this.state.treatPrice
    if( personMoney > 0 ) {
      this.state.change = personMoney
      this.state.message = `Your refund is ${personMoney}`
      person.getChangeBack(personMoney)
      setTimeout(()=> {this.reset()}, 1000)
    } else {
      this.state.message = 'Thank you for your purchase!'
    }
  }

  checkCreditAgainstTreat(personMoney, selection) {
    this.state.credits = personMoney
    this.state.treatPrice = treats[selection][0].price
    person.makeSelection(selection)
    let treat = Object.keys(treats)

    if(treat.includes(selection)) {
      this.state.selection = selection
    }

    if(this.state.credits >= this.state.treatPrice) {
      this.state.status = 'vending'
      this.dispenseItem(selection)
    } else {
      this.state.message = 'You need more credits'
    }
  }


}

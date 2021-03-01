class ThrowElement {
  constructor() {
    //HTML ELEMENTS
    const html = {
      rollButton: document.getElementsByClassName('rollButton')[0],
      totalElement: document.getElementsByClassName('totalsheetOne')[0],
      diceElement: document.getElementsByClassName('diceElements'),
      countButton: document.getElementsByClassName('count')[0],
      numOfRolls: document.getElementsByClassName('rolls')[0],
      gettotal: document.getElementsByClassName('gettotal')[0],
      sheet1: document.getElementsByClassName('sheetOne'),
      sheet2: document.getElementsByClassName('sheetTwo'),
      lock: document.getElementsByClassName('lock'),
      all: document.getElementsByClassName('all')
    }

    // ARRAYS AND OBJECTS
    const arrayObjects = {
      diceArr: [],
      totals: [],
      turn: 0,
      sheetArr: {},

      clearActives: (classlist) => {
        if (classlist) {
          // in a for loop because i need every classList
          for (let i = 0; i < classlist.length; i++) {
            classlist[i].classList.remove('locked');
          }
        }
      }
    }

    html.countButton.classList.add('NonActive')
    // USE CONST WHERE POSIBLE.
    // REFACTOR THE COUNTER FUNCTION TO DO IT WITH ONE OBJECT ?? DONE
    for (let i = 0; i < html.diceElement.length; i++) {
      const toggleEvent = html.diceElement[i].classList;
      html.diceElement[i].addEventListener("click", e => {
        html.diceElement[i].classList.toggle('keep');
      });
      html.rollButton.addEventListener("click", e => {
        if (!toggleEvent.contains('keep')) {
          arrayObjects.diceArr[i] = Math.ceil((Math.random() * 6));
          html.diceElement[i].innerHTML = arrayObjects.diceArr[i];
        }
      });
    }

    for (let i = 0; i < html.lock.length; i++) {
      html.rollButton.addEventListener("click", e => {
        if (html.lock[i].classList.contains('locked')) {
          html.lock[i].classList.replace('locked', 'surelocked')
          this.gameReset()
        }
      })
      let locked = html.lock[i].classList;

      html.countButton.addEventListener('click', e => {
        console.log(e);
        arrayObjects.turn = 0;
        html.countButton.classList.add('NonActive');
        if (!html.lock[i].classList.contains('surelocked')) {
          this.counter();
          this.One();
          this.ofAKind();
          this.fHouse();
          this.straight();
        }

        html.lock[i].addEventListener('click', e => {
          html.numOfRolls.innerHTML = arrayObjects.turn;
          html.rollButton.classList.remove('NonActive')
          if (!html.lock[i].classList.contains('locked')) {
            arrayObjects.clearActives(html.lock)
            locked.add('locked');
          }
        })
      }) // end addEventListener html.countButton


      html.gettotal.addEventListener('click', e => {
        if (html.lock[i].classList.contains('surelocked'))
          arrayObjects.totals.push(html.lock[i].lastElementChild.innerHTML),
          arrayObjects.totals = arrayObjects.totals.map(Number),
          html.totalElement.innerHTML = arrayObjects.totals.reduce((a, b) => a + b);
      })
    } // end loop html.lock


    html.rollButton.addEventListener('click', e => {
      console.log(e);
      if (arrayObjects.turn >= 2) {
        html.countButton.classList.remove('NonActive'),
          html.rollButton.classList.add('NonActive')
        for (let i = 0; i < html.diceElement.length; i++) {
          html.diceElement[i].classList.add('NonActive');
        }
      }
      arrayObjects.turn++
      html.numOfRolls.innerHTML = arrayObjects.turn;
    })


    // start The Counter and add it up.
    this.counter = (() => {
      this.counts = {};
      arrayObjects.diceArr.forEach((x) => {
        this.counts[x] = (this.counts[x] || 0) + 1
      }, this);
      this.count = {
        rDice: {}, // add a object key to the object.
        eDice: {}, // this corrects the object keys. And returns the correct posittion that it needs for placement in html.
        nDice: Object.values(this.counts), // this gets the number of how many of each dice there are.
        dDice: Object.getOwnPropertyNames(this.counts).map(Number), // this gets the value of the dice. and returns it as a number intead of a string.
      };
      for (var i = 0; i < this.count.dDice.length; i++) {
        this.count.rDice[i] = this.count.dDice[i] * this.count.nDice[i]
      } // calculates the ndice * edice
      this.count.dDice.forEach((key, idx) => this.count.eDice[key] = this.count.rDice[idx]); // Adds the index to the score
    })

    // Start Filling scoreboard One
    this.One = (() => {
      for (let i = 0; i < html.sheet1.length; i++) {
        arrayObjects.sheetArr[i] = (html.sheet1[i].innerHTML);
        arrayObjects.sheetArr = Object.assign(arrayObjects.sheetArr, this.count.eDice);
        if (!html.sheet1[i].parentElement.classList.contains('surelocked')) {
          html.sheet1[i].innerHTML = arrayObjects.sheetArr[i];
        }
      }
    })
    // Start Three Of a kind function
    this.ofAKind = (() => {
      this.diceSort = arrayObjects.diceArr.sort((a, b) => a - b);
      this.together = arrayObjects.diceArr.reduce((acc, cur) => acc + cur); // optellen van alle ogen.
      this.aKind = (a, c) => a.filter(x => a.filter(b => b === x).length === c); //checkt hoeveel van de zelfde
      this.aKind3 = this.aKind(this.diceSort, 3); // three of a kind
      this.aKind4 = this.aKind(this.diceSort, 4); // four of a Kind
      this.aKind5 = this.aKind(this.diceSort, 5); // Yahtzee
      //three of a kind
      if (!html.sheet2[0].parentElement.classList.contains('surelocked') && this.aKind3.length >= 1) {
        html.sheet2[0].innerHTML = this.together, 0
      };
      // four of a kind
      if (!html.sheet2[1].parentElement.classList.contains('surelocked') && this.aKind4.length >= 1) {
        html.sheet2[1].innerHTML = this.together, 0
      };
      // kans
      if (!html.sheet2[5].parentElement.classList.contains('surelocked')) {
        html.sheet2[5].innerHTML = this.together, 0
      };
      // yathzee
      if (!html.sheet2[6].parentElement.classList.contains('surelocked') && this.aKind5.length >= 1) {
        html.sheet2[6].innerHTML = 50
      };
    })
    /// Start fullHouse Function
    this.fHouse = (() => {
      this.fullThree = Object.values(this.counts).indexOf(3) > -1,
        this.fullTwo = Object.values(this.counts).indexOf(2) > -1;
      if (this.fullTwo && this.fullThree) {
        html.sheet2[2].innerHTML = 25
      }
    });
    // Start smal & big straight function
    this.straight = (() => {
      this.func = ((array, idx) => {
        let index = 1
        for (let i = 1; i < array.length; i++) {
          if (array[i] == array[i - 1] + 1)
            index++;
          else
            index = 1;
          if (index == idx)
            return true;
        }
        return false;
      })
      if (this.func(arrayObjects.diceArr, 4)) html.sheet2[3].innerHTML = 30;
      if (this.func(arrayObjects.diceArr, 5)) html.sheet2[4].innerHTML = 40;
    });
    // Start gameReset
    this.gameReset = (() => {
      for (let i = 0; i < html.diceElement.length; i++) {
        html.diceElement[i].removeEventListener("click", this, true),
          html.diceElement[i].classList.remove('keep'),
          html.diceElement[i].classList.remove('NonActive');
      }
      arrayObjects.diceArr.length = 0;

      for (let i = 0; i < html.lock.length; i++) {
        if (!html.lock[i].classList.contains('surelocked'))
          html.lock[i].lastElementChild.innerHTML = 0;
      }
    })
  } // end constructor
} // end class
let dice = new ThrowElement();

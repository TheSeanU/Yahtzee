// make dice and put them inside the element

// TODO :: use const when possible, or else let, never use var. Cause it hoists which results in unexpected behavior
// TODO :: Make methods instead of defining methods with this.[methodName]

class ThrowElement {
	// TODO :: constructor does not recieve anything
	constructor(diceElement, sheetElement1, sheetElement2, rollButton, numOfRolls, diceArr, count, turn, objval, result, back, together, aKind) {
		this.diceElement = document.getElementsByClassName('diceElements');
		this.totalElement = document.getElementsByClassName('totalsheetOne')[0];
		this.gettotal = document.getElementsByClassName('gettotal')[0];
		this.rollButton = document.getElementsByClassName('rollButton')[0];
		this.countButton = document.getElementsByClassName('count')[0];
		this.sheet1 = document.getElementsByClassName('sheetOne');
		this.sheet2 = document.getElementsByClassName('sheetTwo');
		this.lock = document.getElementsByClassName('lock');
		this.numOfRolls = document.getElementsByClassName('rolls')[0];
		this.totals = [];

		// TODO :: why is throw a function? it's only being used once
		this.throw = (function () {
			this.diceArr = [];
			for (let i = 0; i < this.diceElement.length; i++) {
				let toggleEvent = this.diceElement[i].classList;
				this.diceElement[i].addEventListener("click", e => {
					this.diceElement[i].classList.toggle('keep');
				});
				this.rollButton.addEventListener("click", e => {
					// TODO :: you can use ! in order to avoid the if else construction
					if (toggleEvent.contains('keep')) {} else {
						this.diceArr[i] = Math.ceil((Math.random() * 6));
						this.diceElement[i].innerHTML = this.diceArr[i];
					}
				});
			}
		}); // end this.throw
		this.throw();

		// TODO :: why is locked a function? it's only being used once
		this.locked = (function () {
			for (let i = 0; i < this.lock.length; i++) {
				let locked = this.lock[i].classList;
				this.rollButton.addEventListener("click", e => {
					if (this.lock[i].classList.contains('locked')) {
						this.lock[i].classList.replace('locked', 'surelocked')
						this.gameReset();
					}
				})
				this.countButton.addEventListener('click', e => {
					this.turn = 0;
					this.countButton.classList.add('NonActive')

					// TODO :: you can use ! in order to avoid the if else construction
					if (this.lock[i].classList.contains('surelocked')) {} else {
						// TODO :: these functions are being called to often.
						// For every none surelocked class this function is being called.
						// First round 13 times, second 12 and so forth
						this.counter();
						this.One();
						this.ofAKind();
						this.fHouse();
						this.straight();
					}
					// TODO :: when is this.countButton not true? It's an element so it should be true always
					if (this.countButton) {
						this.lock[i].addEventListener('click', e => {
							this.numOfRolls.innerHTML = this.turn;
							this.rollButton.classList.remove('NonActive')


							if (!this.lock[i].classList.contains('locked')) {
								this.clearActives(this.lock)
								locked.add('locked');
							}
						})
					}
				})
				// TODO :: why is this placed in the for loop?
				this.clearActives = (function (classlist) {
					if (classlist) {
						for (let i = 0; i < classlist.length; i++) {
							classlist[i].classList.remove('locked');
						}
					}
				})
				this.gettotal.addEventListener('click', e => {
					if (this.lock[i].classList.contains('surelocked')) {
						this.totals.push(this.lock[i].lastElementChild.innerHTML);
						this.totals = this.totals.map(Number)
						this.totalElement.innerHTML = this.totals.reduce(this.together, 0)
					}
				})
			}
		})
		this.locked();


		this.turn = 0;
		this.countButton.classList.add('NonActive')

		// TODO :: can bind limit in javascript t the rollButton, like you do with the rest of the event listeners
		this.limit = (function () {
			if (this.turn >= 2) {
				this.countButton.classList.remove('NonActive')
				this.rollButton.classList.add('NonActive')
				for (var i = 0; i < this.diceElement.length; i++) {
					this.diceElement[i].classList.add('NonActive')
				}
			}
			this.turn++
				this.numOfRolls.innerHTML = this.turn;
		})


		// start The Counter and add it up.
		this.counter = (function () {
			// TODO :: refactor this function. And add comments for what is happening here
			// I think you can do it with just one Object
			this.count = {};
			this.objval = {};
			this.result = {};
			// TODO :: what is back being used for?
			this.back = {};

			this.diceArr.forEach(function (x) {
				this.count[x] = (this.count[x] || 0) + 1
			}, this);
			this.objval = Object.getOwnPropertyNames(this.count);
			this.back = this.count;
			this.objval = this.objval.map(Number);
			this.count = Object.values(this.count);
			this.count.forEach(function (x, c) {
				this.count[x] * (this.objval[c]) + 1
			}, this);
			for (let i = 0; i < this.count.length; i++) {
				this.count[i] = this.count[i] * this.objval[i];
			};
			this.objval.forEach(function (key, i) {
				this.result[key] = this.count[i]
			}, this);
		}); // end this.counter

		// Start Filling scoreboard One
		this.One = (function () {
			this.oneArr = {};
			this.sheetArr = {};
			for (let i = 0; i < this.sheet1.length; i++) {
				this.sheetArr[i] = (this.sheet1[i].innerHTML);
				this.oneArr = Object.assign(this.sheetArr, this.result);
				if (!this.sheet1[i].parentElement.classList.contains('surelocked')) {
					this.sheet1[i].innerHTML = this.oneArr[i];
				}
			}
		}); // end this.One

		// Start Three Of a kind function
		this.ofAKind = (function () {
			this.diceSort = this.diceArr.sort((a, b) => a - b);
			// TODO :: you can reduce here already
			this.together = (acc, cur) => acc + cur; // optellen van alle ogen.

			this.aKind = (a, c) => a.filter(x => a.filter(b => b === x).length === c); //checkt hoeveel van de zelfde

			this.aKind3 = this.aKind(this.diceSort, 3); // three of a kind
			this.aKind4 = this.aKind(this.diceSort, 4); // four of a Kind
			this.aKind5 = this.aKind(this.diceSort, 5); // Yahtzee

			//three of a kind
			if (!this.sheet2[0].parentElement.classList.contains('surelocked') && this.aKind3.length >= 1) {
				this.sheet2[0].innerHTML = this.diceArr.reduce(this.together, 0);
			}
			// four of a kind
			if (!this.sheet2[1].parentElement.classList.contains('surelocked') && this.aKind4.length >= 1) {
				this.sheet2[1].innerHTML = this.diceArr.reduce(this.together, 0)
			}
			// kans
			if (!this.sheet2[5].parentElement.classList.contains('surelocked')) {
				this.sheet2[5].innerHTML = this.diceArr.reduce(this.together, 0)
			}
			// yathzee
			if (!this.sheet2[6].parentElement.classList.contains('surelocked') && this.aKind5.length >= 1) {
				this.sheet2[6].innerHTML = 50
			}
		})

		/// Start fullHouse Function
		this.fHouse = (function () {
			let fullThree = Object.values(this.back).indexOf(3) > -1,
				fullTwo = Object.values(this.back).indexOf(2) > -1;

			if (fullTwo && fullThree) {
				this.sheet2[2].innerHTML = 25
			}
		});

		// Start smal & big straight function
		this.straight = (function () {
			let straightfunc = function (array, idx) {
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
			}

			// TODO :: no need for the == true
			if (straightfunc(this.diceArr, 4) == true) {
				this.sheet2[3].innerHTML = 30
			}
			if (straightfunc(this.diceArr, 5) == true) {
				this.sheet2[4].innerHTML = 40
			}
		});

		this.gameReset = (function () {
			for (let i = 0; i < dice.diceElement.length; i++) {
				dice.diceElement[i].removeEventListener("click", this, true)
				dice.diceElement[i].classList.remove('keep');
				dice.diceElement[i].classList.remove('NonActive')
			}


			for (var i = 0; i < dice.lock.length; i++) {
				if (!dice.lock[i].classList.contains('surelocked')) {
					dice.lock[i].lastElementChild.innerHTML = 0
				}
			}
		})
	} // end constructor
} // end class
let dice = new ThrowElement();
// dice.throw();

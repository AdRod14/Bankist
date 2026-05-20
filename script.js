'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


/*
///////////////////  MORE ARRAY METHODS ////////////////////
//Arrays are objects, so they have special built-in methods
let arr = ['a','b','c','d','e'];

//slice - return new array
console.log(arr.slice(2));
console.log(arr.slice(0,2));
console.log(arr.slice(-1));
console.log(arr.slice(-2));
console.log(arr.slice(1,-1));
console.log(arr.slice());         //shallow copy
console.log([...arr]);            //shallow copy


//splice - deletes and mutates original array
console.log(arr.splice(2));
console.log(arr);
console.log(arr.splice(-1));
console.log(arr);
arr = ['a','b','c','d','e'];
arr.splice(1,3);
console.log(arr);

//Reverse
arr = ['a','b','c','d','e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());      //Does mutate the array
console.log(arr2);

//Concat
const letters = arr.concat(arr2);  //Does not mutate original
console.log(letters);
console.log([...arr,...arr2]);

//Join
console.log(letters.join(' - '));



///////////// ARRAY AT METHOD /////////////
const arr = [23, 11, 64];

console.log(arr[0]);      //These two are almost equal
console.log(arr.at(0));

//getting the last element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));
console.log(arr.at(-2));


console.log('Jonas'.at(0));


//////////////////// LOOPING ARRAYS WITH FOR EACH /////////////////////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if(movement > 0) {
    console.log(`Movement ${i+1}: You deposited ${movement}`);
  }
  else {
    console.log(`Movement ${i+1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('-----------For each-----------'); //This one uses a callback function
movements.forEach(function(movement, index, array) {
  if(movement > 0) {
    console.log(`Movement ${index+1}: You deposited ${movement}`);
  }
  else {
    console.log(`Movement ${index+1}: You withdrew ${Math.abs(movement)}`);
  }
});

//Break doesnt work in a for each loop
*/

///////////////////// FOR EACH WITH MAPS AND SETS //////////////////////
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value, key, map){
  console.log(`${key}: ${value}`);
});

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);    //Sets dont use numbers as keys, but they didnt omit it
console.log(currenciesUnique);
currenciesUnique.forEach(function(value, _, set){
  console.log(`${value}: ${value}`);
})
*/
/*
//////////////////////// DATA TRANSFORMATIONS: MAP, FILTER AND REDUCE ////////////////////////

//// MAP
///TAKES AN ARRAY, LOOPS OVER IT AND APPLIES CALLBACK FUNCTION, RETURNING RESULTS IN NEW ARRAY

const euroToUsd = 1.1;

// const movementsUSD = movements.map(function(mov) {
//   return mov * euroToUsd;
// })

const movementsUSD = movements.map((mov) =>  mov * euroToUsd);

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for(const mov of movements){
  movementsUSDfor.push(mov * euroToUsd);
}
console.log(movementsUSDfor);

const movementsDescriptions = movements.map((mov, index, arr) => 
  `Movement ${index+1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`);

console.log(movementsDescriptions);



//// FILTER
///TAKES AN ARRAY, RETURNS NEW ARRAY CONTAINING THE ELEMENTS THAT PASSED A CONDITION

const deposits = movements.filter(function(mov) {
  return mov > 0
})
const withdrawals = movements.filter((mov) => mov < 0)
console.log(movements);
console.log(deposits);
console.log(withdrawals);



//// REDUCE
/// REDUCES ALL ELEMENTS OF AN ARRAY TO A SINGLE VALUE
/// first parameter in callback function is an accumulator

const balance = movements.reduce(function(acc, cur, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + cur
}, 0);

console.log(balance);

//Get maximum value
const max = movements.reduce((acc, curr) => acc > curr? acc : curr, movements[0]);
console.log(max);


const eurToUsd = 1.1;

// PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, array) => {
    console.log(array);
    return mov * eurToUsd})
  .reduce((acc, curr) => acc + curr, 0);

console.log(totalDepositsUSD);


//////////////// FIND METHOD ///////////////
// find returns first element in array that passes a condition

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find((acc) => acc.owner === 'Jessica Davis');
console.log(account);



//////////////////////  FINDLAST AND FINDLASTINDEX METHODS //////////////////////

console.log(movements);

const lastWithdrawal = movements.findLast(mov => mov < 0);
console.log(lastWithdrawal);

const latestLargeMovementIndex = movements.findLastIndex(mov => Math.abs(mov) > 1000);

console.log(`Your latest large movement was ${movements.length - latestLargeMovementIndex} movements ago`);


/////////////// SOME AND EVERY METHOD //////////////////
console.log(movements);

//Equality
console.log(movements.includes(-130));

//SOME:Condition   - if one element at least complies with the condition
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 1500);
console.log(anyDeposits);


//EVERY:Condition   - if all elements complie with the condition
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposit = (mov) => mov > 0;
console.log(movements.some(deposit));



//////////////   FLAT nad FLATMAP   ////////////////////
const arr = [[1,2,3],[4,5,6],7,8];
console.log(arr.flat());   //[1,2,3,4,5,6,7,8]

const arrDeep = [[[1,2],3], [4,[5,6]], 7, 8];
console.log(arrDeep.flat(2));

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);
const overallBalance = allMovements.reduce((acc, curr) => acc + curr, 0);
console.log(overallBalance);

//Flatmap is a combination of flat and map, but flatmap just goes 1 level deep
const overallBalance2 = accounts.flatMap(acc => acc.movements).reduce((acc, curr) => acc + curr, 0);
console.log(overallBalance2);


/////////////////// SORTING ////////////////////
//Sorting mutates the original array
//Sorts through strings



//Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());



//Numbers
console.log(movements);
//Return < 0, A, B (keep order)
//Return > 0, B, A (switch order)

//Ascending
// movements.sort((a,b) => {
//   if (a > b){
//     return 1;
//   }
//   if (a < b){
//     return -1;
//   }
// });
movements.sort((a,b) => a - b);

//Descending
movements.sort((a,b) => b - a);
console.log(movements);



///////////////  ARRAY GROUPING ///////////////
console.log(movements);

const groupedMovements = Object.groupBy(movements, (mov) => mov > 0 ? 'deposits':'withdrawals');
console.log(groupedMovements);

const groupedByActivity = Object.groupBy(accounts, account => {
  const movementCount = account.movements.length;
  if(movementCount >= 8) return 'very active';
  if(movementCount >= 4) return 'active';
  if(movementCount >= 1) return 'moderate';
  return 'inactive';
});

console.log(groupedByActivity);

// const groupedAccounts = Object.groupBy(accounts, (account) => account.type);
const groupedAccounts = Object.groupBy(accounts, ({type}) => type);

console.log(groupedAccounts);


/////////////////////////// MORE WAYS OF CREATING AND FILLING ARRAYS //////////////////////

// FILL METHOD
const x = new Array(7); //Creates empty array of length 7
console.log(x);
x.map(() => 5);   //Cant use methods on empty array, only fill
//x.fill(1);
x.fill(1,3,5);
console.log(x);


const arr = [1,2,3,4,5,6,7];
arr.fill(23, 2, 6);
console.log(arr);

// ARRAY.FROM
const y = Array.from({length: 7}, () => 1);
console.log(y);

const z = Array.from({length: 7}, (cur, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function(e) {
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), (el) => Number(el.textContent.replace('€', '')));
  // movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI);
});


///////////// DESTRUCTIVE VS NON DESTRUCTIVE METHODS ///////////

//DO MUTATE REVERSE
console.log(movements);
const reversedMov = movements.reverse()
console.log(reversedMov);
console.log(movements);

//ALTERNATIVE FOR REVERSE
console.log(movements);
const reversedMov2 = movements.toReversed()
console.log(reversedMov2);
console.log(movements);

// DO MUTATE SORT
//ALTERNATIVE FOR SORT - toSorted

// DO MUTATE SPLICE
//ALTERNATIVE FOR SPLICE - toSpliced


//To change an element in array without modifying original
//movements[1] = 2000;
const newMovements = movements.with(1, 2000);
console.log(newMovements);
console.log(movements);


//////////////////////// CONVERTING AND CHECKING NUMBERS ///////////////////////
// Base 10 - 0 to 9. 1/10 = 10.1  3/10=3.3333
//Binary base 2 - 0 to 1
//JS not useful for precise calculations
console.log( 23 === 23.0);
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3); //Gives false

//Converting to number
console.log(Number('23'));
console.log(+('23')); //Type coercion

//Parsing - needs to start with a number
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));
console.log(Number.parseInt('30px', 4));

console.log(Number.parseFloat('2.5rem'));
console.log(Number.parseInt('2.5rem'));


//NaN - use to check if value is literally NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(10/0));    //Doesn't consider infinity value
console.log(10 / 0);

//isFinite -  best way of checking if it is a number, not a string
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20x'));
console.log(Number.isFinite(10/0));

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23.01));
*/
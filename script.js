'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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


const displayMovements = function(movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);

  })
}


const calcPrintBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${acc.balance} €`;
}


const calcDisplaySummary = function(acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements.filter((mov) => mov < 0).reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map((deposit) => deposit*(acc.interestRate/100))
  .filter((int, i, arr) => {
    console.log(arr);
    return int >= 1;
  })
  .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`
}


const createUsernames = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map((name) => name[0])
    .join('');
  })
};


createUsernames(accounts);


const updateUI = function(acc) {
  //Display movements
  displayMovements(acc.movements);


  //Display balance
  calcPrintBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
}



//Event handler
let currentAccount ;

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //update UI
    updateUI(currentAccount);
  }
});


btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find((acc) => acc.username === inputTransferTo.value);
  console.log(amount, receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username){
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }

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

*/






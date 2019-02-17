console.log('main');

//***  let and const
const myName = "Tuan";
console.log(myName);
// myName = 'changed';
// console.log(myName);
console.log("=====================");

//*** Arrow function
const printMyName = name => {
  console.log(name);
};

printMyName("max");

const multiply = number => number * 2;
console.log(multiply(5));
console.log("=====================");


//*** Export and import
//...


//*** Classes
class Human {
  constructor () {
    this.gender = 'male';
  }
  
  printGender () {
    console.log(this.gender);
  }
}

class Person extends Human {
  constructor () {
    super();
    this.name = 'Max';
  }
  
  printMyName() {
    console.log(this.name);
  }
}

const person = new Person();
person.printMyName();
person.printGender();
console.log("=====================");

//*** Classes next gen ES7
class Human2 {
  gender = 'male2';
  printGender = () => console.log(this.gender);
}

class Person2 extends Human2 {
  name = 'Max2';
  printMyName = () => console.log(this.name);
}

const person2 = new Person2();
person2.printMyName();
person2.printGender
console.log("=====================");

//*** Spread and rest operators
//Spread
const numbers = [1,2,3];
const newNumbers = [...numbers, 4];
console.log(numbers);
console.log(newNumbers);

const personObj = {
  name: 'Max'
};

const newPersonObj = {
  ...personObj,
  age: 24
}
console.log(newPersonObj);

//Rest
const filters = (...args) => args.filter(el => el === 1);
console.log(filters(1,2,3));
console.log("=====================");

//*** Destructuring
const numbers2 = [1,2,3];
[num1, ,num3] = numbers2;
console.log(num1, num3);
console.log("=====================");


//*** Reference and Primities types
const numA= 1;
const numB= numA //create a real copy
console.log(numB)


//with array and obj
const personA = {
  name: 'A'
}
const personB = personA; //create copy of a pointer
personA.name='changed';
console.log(personB);

//use spread operator to copy
// const personC = {
//   ...personA
// }
// personA.name='changed222222';
// console.log(personC);
// console.log("=====================");


//*** Array function
const numbersArr = [1,2,3];
const doubleNumberArr = numbersArr.map((number) => {
  return number * 2;
})
console.log(numbersArr);
console.log(doubleNumberArr);


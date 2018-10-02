// const randomHexColor = require('random-hex-color')

fetch('http://localhost:3000/api/v1/projects/new', {
  method: 'POST',
  body: JSON.stringify({
    title: 'hello',
    palletes: ['world']
  }),
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.log(error))

// console.log(randomHexColor())

const generateRandomHexCode = () => {
  const possibleDigits = "0123456789ABCDEF"; 
  let color = []
  for (let i = 0; i < 6; i++) {
    color.push(possibleDigits[Math.floor(Math.random() * 16)]);
  }
  color.join('')
  return '#' + color.join('');
}


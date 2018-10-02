// fetch('http://localhost:3000/api/v1/projects/new', {
//   method: 'POST',
//   body: JSON.stringify({
//     title: 'hello',
//     palletes: ['world']
//   }),
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.log(error))

// fetch('http://localhost:3000/api/v1/projects/delete/1')
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.log(error))


const generateRandomHexCode = () => {
  const possibleDigits = "0123456789ABCDEF"; 
  let color = []
  for (let i = 0; i < 6; i++) {
    color.push(possibleDigits[Math.floor(Math.random() * 16)]);
  }
  color.join('')
  return '#' + color.join('');
}

const generateFiveHexCodes = () => {
  let colors = [];
  for (let i = 0; i < 5; i++) {
    const generatedColor = generateRandomHexCode();
    colors.push(generatedColor);
  }
  return colors;
}

let colors = generateFiveHexCodes();

window.onkeydown = function keyFunctions(e) {
  e.preventDefault();
  switch (e.keyCode) {
    case 32:
    colors = generateFiveHexCodes()
  }
}




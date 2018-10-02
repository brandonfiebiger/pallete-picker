fetch('http://localhost:3000/api/v1/projects/new', {
  method: 'POST',
  body: JSON.stringify({
    title: 'hello',
    palletes: ['world']
  }),
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(data => console.log(data))
.catch(error => console.log(error))


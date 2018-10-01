const express = require('express');
const app = express();


app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pallete Picker';

app.get('/', (request, response) => {
  response.status(200).send('Hello World!');
});

app.listen(3000, () => {
  console.log('Pallete Picker is running on port 3000');
})
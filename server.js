const enviroment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[enviroment];
const database = require('knex')(configuration);
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);

app.locals.title = 'Pallete Picker';

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
  .then((projects) => {
    response.status(200).json(projects)
  })
  .catch((error) => {
    response.status(500).json({ error });
  })
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['title']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { title: <String> }. Youre missing a ${requiredParameter} property.`})
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    })
})

app.get('/api/v1/palletes', (request, response) => {
  database('palletes').select()
  .then((palletes) => {
    response.status(200).json(palletes)
  })
  .catch((error) => {
    response.status(500).json({ error });
  })
})

app.post('/api/v1/palletes', (request, response) => {
  const pallete = request.body;

  for (let requiredParameter of ['title', 'project_id', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!pallete[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { title: <String>, project_id: <integer>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String> }. Youre missing a ${requiredParameter} property.`})
    }
  }

  database('palletes').insert(pallete, 'id')
    .then(pallete => {
      response.status(201).json({ id: pallete[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    })
})

app.delete('/api/v1/palletes/:id', (request, response) => {
  database('palletes')
  .select()
  .where('id' ,request.params.id)
  .del()
  .then(() => {
    return response.sendStatus(201)
  })
  .catch(error => {
    return response.status(500).send({ error })
  })
})

app.listen(app.get('port'), () => {
  console.log('Pallete Picker is running on port 3000');
});
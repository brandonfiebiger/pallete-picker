
// Setting an enviroment variable to development as a default if NODE_ENV was not assigned a value
const enviroment = process.env.NODE_ENV || 'development';
// assigning our configuration variable to the appropiate enviroment, accessing the object within the knexfile
const configuration = require('./knexfile')[enviroment];
// configuring our connection to the database with the appropriate enviroment
const database = require('knex')(configuration);
//requiring express
const express = require('express');
//invoking the express constructor and storing it in app
const app = express();
const bodyParser = require('body-parser');


// Parse request bodies to json
app.use(bodyParser.json());

// Using the html css and js files from our public folder
app.use(express.static('public'));

//setting the value of our port with a default of 300 if the value of the PORT was not set
app.set('port', process.env.PORT || 3000);

// Getting all projects from the /api/v1/projects endpoint. 
//Looks into the projects table in database and responds with the projects in json format.
app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
  .then((projects) => {
    response.status(200).json(projects)
  })
  .catch((error) => {
    response.status(500).json({ error });
  })
});

// Posts a new project to database
// If the request body is missing the correct parameter of title an error is sent
// Otherwise a project is inserted into the projects table of the database
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

//Creates an endpoint to get all palletes on a get request
//Selects the palletes table in the database
//Then responds with an array of the palletes in json format
//Othewise sends an error
app.get('/api/v1/palletes', (request, response) => {
  database('palletes').select()
  .then((palletes) => {
    response.status(200).json(palletes)
  })
  .catch((error) => {
    response.status(500).json({ error });
  })
})

// If a post method is sent to this endpoint it will add a pallete
// If any of the required parameters are missing from the request body an error will be sent
// Other wise the pallete from the request body will be inserted into the palletes table of the database
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

//Creates an endpoint to delete palletes from
//Selects the palletes table of db and finds all of the palletes where their id matches the request parameter made in the endpoint
//deletes that pallete from the database and returns a status 201
//Otherwise returns an error
app.delete('/api/v1/palletes/:id', (request, response) => {
  database('palletes')
  .select()
  .where('id' , request.params.id)
  .del()
  .then(() => {
    return response.sendStatus(201)
  })
  .catch(error => {
    return response.status(500).send({ error })
  })
})

//Telling our application to listen to whichever port was assigned
//console logging which port that is
app.listen(app.get('port'), () => {
  console.log(`Pallete Picker is running on port ${app.get('port')}`);
});
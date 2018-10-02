const express = require('express');
const app = express();


app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);

app.locals.title = 'Pallete Picker';

app.locals.projects = [
  {id: 1, title: 'Project 1', palletes: [{name: 'pallete 1', id: 1, colors: ['#000000', '#FFFFFF', '#f1f1f1', '#f2f2f2', '#f5f5f5']}]}
];

app.get('/api/v1/projects', (request, response) => {
  response.status(200).json(app.locals.projects);
});

app.get('/api/v1/projects/:id', (request, response) => {
  const id = request.params.id;
  const project = app.locals.projects.find(project => project.id == id);
  if (project) {
    return response.status(200).json(project);
  } else {
    return response.status(404).json({error: 'Sorry that project does not exist.'});
  }
});



app.listen(3000, () => {
  console.log('Pallete Picker is running on port 3000');
});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);

app.locals.title = 'Pallete Picker';

app.locals.projects = [
  {id: 1, title: 'Project 1', palletes: [{name: 'pallete 1', id: 1, colors: ['#000000', '#FFFFFF', '#f1f1f1', '#f2f2f2', '#f5f5f5']}, {name: 'pallete 2', id: 2, colors: ['#000000', '#FFFFFF', '#f1f1f1', '#f2f2f2', '#f5f5f5']}, {name: 'pallete 3', id: 3, colors: ['#000000', '#FFFFFF', '#f1f1f1', '#f2f2f2', '#f5f5f5']}]},
  {id: 2, title: 'Project 1', palletes: [{name: 'pallete 1', id: 1, colors: ['#000000', '#FFFFFF', '#f1f1f1', '#f2f2f2', '#f5f5f5']}, {name: 'pallete 2', id: 2, colors: ['#000000', '#FFFFFF', '#f1f1f1', '#f2f2f2', '#f5f5f5']}, {name: 'pallete 3', id: 3, colors: ['#000000', '#FFFFFF', '#f1f1f1', '#f2f2f2', '#f5f5f5']}]}
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

app.get('/api/v1/projects/:projectid/palletes/:palleteid', (request, response) => {
  const projectid = request.params.projectid;
  const palleteid = request.params.palleteid;
  const project = app.locals.projects.find(project => project.id == projectid);
  const pallete = project.palletes.find(pallete => pallete.id == palleteid);
  if (pallete) {
    return response.status(200).json(pallete);
  } else {
    return response.status(404).json({error: 'Sorry that pallete does not exist'});
  }
});

app.get('/api/v1/projects/:projectid/palletes/:palleteid/delete', (request, response) => {
  const project_id = request.params.projectid;
  const pallete_id = request.params.palleteid;
  const project = app.locals.projects.find(project => project.id == project_id);
  const filteredPalletes = project.palletes.filter(pallete => pallete.id != pallete_id);

  app.locals.projects = filteredPalletes;
  return response.status(201).json(filteredPalletes);
})

app.post('/api/v1/projects/new', (request, response) => {
  const id = app.locals.projects.length + 1;
  const { palletes, title } = request.body
  const project = {id: id, title: title, palletes: palletes };

  app.locals.projects.push(project);
  response.status(201).json(project);
})

// app.delete('/api/v1/projects/delete/:project_id', (request, response) => {
//   const project_id = request.params.project_id;
//   // if (project_id) {
//     const filteredProjects = app.locals.projects.filter(project => project.id != project_id);
//     app.locals.projects = filteredProjects;
//     response.status(201).json(project_id);
//   // } else {
//   //   response.status(404).json({error: 'Sorry that project does not exist'});
//   // }
// })

app.listen(3000, () => {
  console.log('Pallete Picker is running on port 3000');
});
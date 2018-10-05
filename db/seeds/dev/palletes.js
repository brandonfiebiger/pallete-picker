const projectData = [{
  title: 'Yamon',
  id: 2,
},
{
  title: 'pants',
  id: 3
}
]

const createProject = (knex, project) => {
  return knex('projects').insert({
    title: project.title 
  }, 'id')
  .then(projectId => {
    let palletePromises = [];

    project.palletes.forEach(pallete => {
      palletePromises.push(createPallete(knex, {
        title: pallete.title,
        color1: pallete.color1,
        color2: pallete.color2,
        color3: pallete.color3,
        color4: pallete.color4,
        color5: pallete.color5,
        project_id: projectId[0]
      }))
    })
    return Promise.all(palletePromises);
  })
}

const createPallete = (knex, pallete) => {
  return knex('color-palletes').insert(pallete);
}


exports.seed = (knex, Promise) => {
  return knex('palletes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = [];
        
      projectData.forEach(project => {
        projectPromises.push(createProject(knex, project));
      });

      return Promise.all(projectPromises);
    })
    .catch(error => console.log(`Error seeding data ${error}`))
};


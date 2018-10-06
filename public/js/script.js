const projectsAndPalletes = {
  projects: [],
  palletes: [],
  selectedProject: 0,
  selectedProjectsPalletes: []
}


const lockColor = (e) => {
  $(e.target).parent().toggleClass('locked-color');
  $(e.target).toggleClass('unlocked');
  $(e.target).toggleClass('locked');
  console.log(e.target)
}


$('.colors').on('click', '.lock', lockColor)

const generateRandomHexCode = () => {
  const possibleDigits = "0123456789ABCDEF"; 
  let color = []
  for (let i = 0; i < 6; i++) {
    color.push(possibleDigits[Math.floor(Math.random() * 16)]);
  }
  return '#' + color.join('');
}

let previousColors;

const generateFiveHexCodes = () => {
  let colors = [];
  for (let i = 0; i < 5; i++) {
    if ($(`.color${i}`).hasClass('locked-color')) {
      colors.push(previousColors[i]);
    } else {
      const generatedColor = generateRandomHexCode();
      colors.push(generatedColor);
    }
  }
  previousColors = colors;
  return colors;
}



window.onkeydown = function keyFunctions(e) {
  switch (e.keyCode) {
    case 32:
    let colors = generateFiveHexCodes();
    setRandomColorsToDom(colors);
  }
}

const setRandomColorsToDom = (colors) => {
  for (let i = 0; i < colors.length + 1; i++) {
    $(`.color${i}`).css('background-color', `${colors[i]}`);
    $(`.color${i}`).text(() => {
      return `${colors[i]}`
    })
    if ($(`color${i}`).hasClass('locked-color')) {
      console.log('hello')
      $(`.color${i}`).html(`<div class="locked lock"></div>${colors[i]}`);
    } else {
      $(`.color${i}`).html(`<div class="unlocked lock"></div>${colors[i]}`);
    }
  }
}



const addProject = (e) => {
  e.preventDefault();
  const title = $('.project-name-input').val();
  fetch('/api/v1/projects', { 
    method: 'POST',
    body: JSON.stringify({ title }), 
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(() => {
      $('.projects').html(` <form>
      <input class="project-name-input" type="text"/>
      <button class="project-button">Add a project!</button>
    </form>`)
      getProjectsFromDataBase()
    })
    .catch(error => console.log(error));
  $('.project-name-input').val('');
}

const addPallete = (e) => {
  e.preventDefault()
  if(projectsAndPalletes.selectedProject) {
    let palleteToAdd = {
      title: $('.pallete-name-input').val(),
      color1: previousColors[0],
      color2: previousColors[1],
      color3: previousColors[2],
      color4: previousColors[3],
      color5: previousColors[4],
      project_id: projectsAndPalletes.selectedProject
    }
    fetch('/api/v1/palletes', {
      method: 'POST',
      body: JSON.stringify(palleteToAdd),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(projectsAndPalletes.palletes.push(palleteToAdd))
    .catch(error => console.log(error))
  }
  $('.pallete-name-input').val('');
  displayPalletes(projectsAndPalletes.selectedProject);
}

const getProjectsFromDataBase = () => {
  fetch('/api/v1/projects')
    .then(response => response.json())
    .then(projects => projectsAndPalletes.projects = projects)
    .then(() => {
      displayProjects();
    })
    .catch(error => console.log(error));
};

const getPalletesFromDataBase = () => {
  fetch('/api/v1/palletes')
    .then(response => response.json())
    .then(palletes => projectsAndPalletes.palletes = palletes)
}

const displayProjects = () => {
  projectsAndPalletes.projects.forEach(project => {
    $('.projects').prepend(`<li class="project" value="${project.id}">${project.title}</li>`);
  })
}

const displayPalletes = (projectId) => {
  $('.palletes').html(`
  <form>
        <input class="pallete-name-input" type="text" placeholer="Pallete Name"/>
        <button class="pallete-button">Save Pallete!</button>
      </form>
      `)
  projectsAndPalletes.palletes.forEach(pallete => {
    if (pallete.project_id === projectId) {
      $('.palletes').prepend(`<li class="pallete" value=${pallete.id}>${pallete.title}</li>`)
    }
  })
}

const selectProject = (e) => {
  projectsAndPalletes.selectedProject = e.target.value;
  displayPalletes(e.target.value)
}

$(document).ready(() => {
  let colors = generateFiveHexCodes();
  setRandomColorsToDom(colors);
  getProjectsFromDataBase();
  getPalletesFromDataBase();
});


$('.projects').on('click', '.project-button', addProject);

$('.projects').on('click', '.project', (e) => selectProject(e));

$('.palletes').on('click', '.pallete-button', addPallete);


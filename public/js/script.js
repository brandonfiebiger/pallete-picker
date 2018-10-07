const projectsAndPalletes = {
  projects: [],
  palletes: [],
  selectedProject: 0,
  selectedProjectsPalletes: [],
  selectedProjectTitle: ''
}


const lockColor = (e) => {
  $(e.target).parent().toggleClass('locked-color');
  $(e.target).toggleClass('unlocked');
  $(e.target).toggleClass('locked');
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



window.onkeydown = (e) => {
  switch (e.keyCode) {
    case 32:
    if ($('.project-name-input').val() || $('.pallete-name-input').val()) {
      return
    } else {
      let colors = generateFiveHexCodes();
      setRandomColorsToDom(colors);
    }
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
    .then(data => projectsAndPalletes.selectedProject = data.id)
    .then(() => {
      $('.projects').html(` 
      <h2>Your Projects</h2>
      <ul class="project-section"></ul>
      <form>
        <input class="project-name-input" type="text"/>
        <button class="project-button">Add a project!</button>
      </form>`
      )
      getProjectsFromDataBase()
    })
    .catch(error => console.log(error));
  $('.project-name-input').val('');
  displayProjects();
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
  displayPalletes(projectsAndPalletes.selectedProject, projectsAndPalletes.selectedProjectTitle);
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
    $('.project-section').prepend(`<li class="project" value="${project.id}">${project.title}</li>`);
  })
}

const displayPalletes = (projectId, projectTitle) => {
  $('.palletes').html(`
  <h2>${projectTitle}</h2>
  <ul class="pallete-list"></ul>
  <form>
    <input class="pallete-name-input" type="text" placeholer="Pallete Name"/>
    <button class="pallete-button">Save Pallete!</button>
  </form>
      `)
  projectsAndPalletes.palletes.forEach(pallete => {
    if (pallete.project_id === projectId) {
      $('.pallete-list').prepend(`
      <li class="pallete" value=${pallete.id}>${pallete.title}
        <img class="garbage" src="../images/trash.png" />
        <div class="palletes-colors">
          <div class="pallete-color" style="background-color:${pallete.color1}">
            <div>${pallete.color1}</div>
          </div>
          <div class="pallete-color" style="background-color:${pallete.color2}">
            <div>${pallete.color2}</div>
          </div>
          <div class="pallete-color" style="background-color:${pallete.color3}">
            <div>${pallete.color3}</div>
          </div>
          <div class="pallete-color" style="background-color:${pallete.color4}">
            <div>${pallete.color4}</div>
          </div>
          <div class="pallete-color" style="background-color:${pallete.color5}">
            <div>${pallete.color5}</div>
          </div>
        </div>
      </li>`
      )
    }
  })
}

const selectProject = (e) => {
  projectsAndPalletes.selectedProject = e.target.value;
  const project = projectsAndPalletes.projects.find(project => project.id == projectsAndPalletes.selectedProject);
  $('.palletes').addClass('open')
  projectsAndPalletes.selectedProjectTitle = project.title;
  displayPalletes(e.target.value, project.title);
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


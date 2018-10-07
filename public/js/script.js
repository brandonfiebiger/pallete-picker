const projectsAndPalletes = {
  projects: [],
  palletes: [],
  selectedProject: 0,
  selectedProjectsPalletes: [],
  selectedProjectTitle: '',
  selectedNav: 'colors',
  navChoices: ['colors', 'palletes', 'projects']
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
    let palleteToAddToDataBase = {
      title: $('.pallete-name-input').val(),
      color1: previousColors[0],
      color2: previousColors[1],
      color3: previousColors[2],
      color4: previousColors[3],
      color5: previousColors[4],
      project_id: projectsAndPalletes.selectedProject
    }
    let palleteToAddToDOM = {
      title: $('.pallete-name-input').val(),
      color1: previousColors[0],
      color2: previousColors[1],
      color3: previousColors[2],
      color4: previousColors[3],
      color5: previousColors[4],
      project_id: projectsAndPalletes.selectedProject,
      id: 0
    }
    fetch('/api/v1/palletes', {
      method: 'POST',
      body: JSON.stringify(palleteToAddToDataBase),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      palleteToAddToDOM.id = data.id;
      projectsAndPalletes.palletes.push(palleteToAddToDOM);
      displayPalletes(projectsAndPalletes.selectedProject, projectsAndPalletes.selectedProjectTitle);
    })
    .catch(error => console.log(error))
  }
  $('.pallete-name-input').val('');
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
    <input class="pallete-name-input" type="text" placeholder="Add A Pallete"/>
    <button class="pallete-button">+</button>
  </form>
      `)
  projectsAndPalletes.palletes.forEach(pallete => {
    if (pallete.project_id === projectId) {
      $('.pallete-list').prepend(`
      <li class="pallete" id="${pallete.id}">
        <div class="pallete-header" id="${pallete.id}">
          ${pallete.title}
          <img class="garbage" src="../images/trash.png" id="${pallete.id}"/>
        </div>
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

const deletePallete = (e) => {
  console.log(e.target.id);
  const filteredPalletes = projectsAndPalletes.palletes.filter(pallete => pallete.id != e.target.id);
  projectsAndPalletes.palletes = filteredPalletes;
  displayPalletes(projectsAndPalletes.selectedProject, projectsAndPalletes.selectedProjectTitle);
  fetch(`/api/v1/palletes/${e.target.id}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log(error));
};

const selectPallete = (e) => {
  const selectedPallete = projectsAndPalletes.palletes.find(pallete => pallete.id == e.target.id);
  const selectedColors = [selectedPallete.color1, selectedPallete.color2, selectedPallete.color3, selectedPallete.color4, selectedPallete.color5];
  setRandomColorsToDom(selectedColors);
}

const selectProject = (e) => {
  projectsAndPalletes.selectedProject = e.target.value;
  const project = projectsAndPalletes.projects.find(project => project.id == projectsAndPalletes.selectedProject);
  $('.palletes-nav').removeClass('hidden');
  $('.palletes').addClass('open')
  projectsAndPalletes.selectedProjectTitle = project.title;
  displayPalletes(e.target.value, project.title);
}

const selectNav = (e) => {
  projectsAndPalletes.selectedNav = e.target.id;
  delegateNav(e.target.id);
}

const delegateNav = (selectedNav) => {
  projectsAndPalletes.navChoices.forEach(navChoice => {
    if (navChoice === selectedNav) {
      $(`.${selectedNav}`).addClass('visible');
    } else {
      $(`.${navChoice}`).removeClass('visible');
    }
  })
}

$(document).ready(() => {
  let colors = generateFiveHexCodes();
  setRandomColorsToDom(colors);
  getProjectsFromDataBase();
  getPalletesFromDataBase();
  delegateNav(projectsAndPalletes.selectedNav);
});

$('nav').on('click', selectNav)

$('.palletes').on('click', '.pallete-header', selectPallete)

$('.palletes').on('click', '.garbage', deletePallete);

$('.projects').on('click', '.project-button', addProject);

$('.projects').on('click', '.project', selectProject);

$('.palletes').on('click', '.pallete-button', addPallete);

$('.generate-button').on('click', () => {
  let colors = generateFiveHexCodes();
  setRandomColorsToDom(colors);
})
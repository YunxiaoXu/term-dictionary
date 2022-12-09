import { initTinyMCE, getTinyMCEData } from '../../components/tinyMCE/tiny-mce.js';
import * as backend_function from '../../backend/dict.js';
import * as redirection from '../../common-scripts/redirection.js';

let term_id = localStorage.getItem('get_term_id');
let button = document.getElementById('update-button');
let draftButton = document.getElementById('draft-button');
let cancelButton = document.getElementById('cancel-button');
let term_name = document.getElementById('term-name');
let tags = document.getElementById('tags');
let short_description = document.getElementById('short-description');
let data = {};

// Get the term information from backend
data = backend_function.selectTerm(term_id);

// Populate data to respective element
init();

function init() {
  term_name.value = data.term_name;
  tags.value = data.tags.toString();
  short_description.value = data.short_description;
  initTinyMCE(data.term_data);
}

// Remove draft button if the post is posted
if (data.published) {
  draftButton.remove();
} else {
  // Else if draft then change text of Update button to Post
  button.value = 'Post';
}

// Update as post
button.addEventListener('click', (e) => {
  e.preventDefault();
  
  data.term_name = term_name.value;
  data.tags = tags.value;
  data.short_description = short_description.value;
  data.term_data = getTinyMCEData();
  data.published = true;

  // If required inputs are not empty then post and go to term page
  if (data.term_name && data.tags) {
    backend_function.updateTerm(data);
    redirection.jumpTermPageHtml();
  }
});

// Update as draft
draftButton.addEventListener('click', (e) => {
  e.preventDefault();
  
  data.term_name = term_name.value;
  data.tags = tags.value;
  data.short_description = short_description.value;
  data.term_data = getTinyMCEData();
  data.published = false;
  
  // If required inputs are not empty then post and go to term page
  if (data.term_name && data.tags) {
    backend_function.updateTerm(data);
    redirection.jumpTermPageHtml();
  }
});

// 
cancelButton.addEventListener('click', (e) => {
  e.preventDefault();
  redirection.jumpTermPageHtml();
});

import { initTinyMCE, getTinyMCEData } from '../../components/tinyMCE/tiny-mce.js';
import * as backend_function from '../../backend/dict.js';
import * as redirection from '../../common-scripts/redirection.js';

let button = document.getElementById('create-button');
let draftButton = document.getElementById('draft-button');
let cancelButton = document.getElementById('cancel-button');
let term_name = document.getElementById('term-name');
let tags = document.getElementById('tags');
let short_description = document.getElementById('short-description');
let data = {};

initTinyMCE();

// Post as published
button.addEventListener('click', (e) => {
  data.term_name = term_name.value;
  data.tags = tags.value;
  data.short_description = short_description.value;
  data.term_data = getTinyMCEData();
  data.published = true;  

  // If required inputs are not empty then post and go to term page
  if (data.term_name && data.tags) {
    let id = backend_function.addTermToBackend(data);
    localStorage.setItem('get_term_id', id);    
    e.preventDefault();
    redirection.jumpTermPageHtml();
  }
});

// Post as draft
draftButton.addEventListener('click', (e) => {
  data.term_name = term_name.value;
  data.tags = tags.value;
  data.short_description = short_description.value;
  data.term_data = getTinyMCEData();
  data.published = false;
  
  // If required inputs are not empty then post and go to term page
  if (data.term_name && data.tags) {
    let id = backend_function.addTermToBackend(data);
    localStorage.setItem('get_term_id', id);
    e.preventDefault();
    redirection.jumpTermPageHtml();
  }
});

cancelButton.addEventListener('click', (e) => {
  e.preventDefault();
  redirection.jumpHomeHtml();
});

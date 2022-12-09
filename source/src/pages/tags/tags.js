import * as backend_function from '../../backend/dict.js';
import * as redirection from '../../common-scripts/redirection.js';

let top_buttons = document.querySelector('.top-buttons');
let tag_container = document.querySelector('.tag-container');

let tag_search_results = backend_function.termFromAllTags();

window.addEventListener('DOMContentLoaded', init);

function init() {
  addSearchBarToDocument();
  addTagsToDocument();
}

function addSearchBarToDocument() {
  let search_bar = document.createElement('search-bar');
  top_buttons.appendChild(search_bar);

  search_bar.searchFunction = backend_function.findRequestedTag;
  search_bar.initSearchFunction = {
    'search_term': true,
    'search_tag': false,
    'search_description': true,
    'case_insensitive': true
  };
}

function addTagsToDocument() {
  tag_search_results.forEach((tag) => {
    let tag_card = document.createElement('tag-card');
    tag_container.appendChild(tag_card);
    tag_card.data = tag;
  });
}

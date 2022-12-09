import * as backend_function from '../../backend/dict.js';
import * as redirection from '../../common-scripts/redirection.js';

window.addEventListener('DOMContentLoaded', init);

let top_buttons = document.querySelector('.top-buttons');

function init() {
  addSearchBarToDocument();
  addTermsToDocument(backend_function.getDataOfRecents());
  addTagsToDocument(backend_function.getAllPopTags());
}

function addSearchBarToDocument() {
  let search_bar = document.createElement('search-bar');
  top_buttons.appendChild(search_bar);
  search_bar.searchFunction = backend_function.findRequestedTerm;
  search_bar.initSearchFunction = {
    'search_term': true,
    'search_tag': false,
    'search_description': true,
    'case_insensitive': true
  };
}

function addTermsToDocument(terms) {
  let recently_added_el = document.querySelector('div.recently-added-elements');
  terms.forEach((term) => {
    let term_card = document.createElement('term-card');
    term_card.data = term;
    recently_added_el.appendChild(term_card);
  });
}

function addTagsToDocument(terms) {
  let popular_tag_el = document.querySelector('div.popular-tags');

  terms.forEach((tag) => {
    // Create a tag as button
    let tag_name = document.createElement('button');
    tag_name.textContent = tag['tag_name'];

    // Handles clicking on the tag to jump to tag search page
    tag_name.addEventListener('click', searchByTags);

    // Create term cards wrapper
    popular_tag_el.appendChild(tag_name);
    let tag_terms = document.createElement('div');
    tag_terms.className = 'tag-column';

    // Create term cards and add to tag
    tag.terms.forEach((term) => {
      let term_card = document.createElement('term-card');

      term_card.data = term;
      tag_terms.appendChild(term_card);
    });
    popular_tag_el.appendChild(tag_terms);
  });
}

function searchByTags(e) {
  e.preventDefault();

  // Get tag name and get search results by tag
  let tag_name = e.currentTarget.textContent;
  let search_results = backend_function.findTermsOfTagExact(tag_name);

  // Build json for tag-search page and redirect
  let tag_search_results =[
    {
      'tag_name': tag_name,
      'terms': search_results
    }
  ];
  localStorage.setItem('tag_search_results', JSON.stringify(tag_search_results));
  redirection.jumpTagSearchHtml();
}

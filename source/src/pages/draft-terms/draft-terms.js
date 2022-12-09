import * as backend_function from '../../backend/dict.js';

window.addEventListener('DOMContentLoaded', init);

function init() {
  let published_terms = backend_function.getAllUnpublishedTerms();
  addTermsToDocument(published_terms);
}

function addTermsToDocument(terms) {
  let recently_added_el = document.querySelector('div.card-results');
  terms.forEach((term) => {
    let term_card = document.createElement('term-card');
    term_card.data = term;
    recently_added_el.appendChild(term_card);
  });
}

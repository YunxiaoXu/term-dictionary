// https://bendyworks.com/blog/native-web-components
// https://codepen.io/bugrakocak/pen/EMbKoB
import * as backend_function from '../../backend/dict.js';
import * as redirection from '../../common-scripts/redirection.js';

class SearchBar extends HTMLElement {
  constructor() {
    super();
    let shadow_el;
    const MAXIMUM_ELEMENT_DISPLAY = 5;
    let search_function;
    let function_name;
  }

  connectedCallback() {
    this.shadow_el = this.initShadowDom();
  }

  initShadowDom() {
    let shadow_el = this.attachShadow({ mode: 'open' });
    shadow_el.innerHTML = SearchBar.template;

    return shadow_el;
  }

  set searchFunction(search_function) {
    this.search_function = search_function;
    this.function_name = this.search_function.name;
  }

  set initSearchFunction(data) {
    // Initialize variables
    const containerEl = this.shadow_el.querySelector('.container');
    const form_el = this.shadow_el.querySelector('#search');
    const drop_el = this.shadow_el.querySelector('.drop');
    let search_results = {};

    // When searching for terms
    if (this.function_name === 'findRequestedTerm') {
      if (!data){
        data = {
          'search_term': true,
          'search_tag': true,
          'search_description': true,
          'case_insensitive': true
        };
      }
      // Add event listener when pressing enter key
      form_el.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          // Only redirect when user input not empty
          if (form_el.value.length !== 0) {
            localStorage.setItem('search_results', JSON.stringify(search_results));
            redirection.jumpSearchHtml();
          }
        }
      });

      const goToTermPage = (e) => {
        localStorage.setItem('get_term_id', e.currentTarget.term_id);
        redirection.jumpTermPageHtml();
      };

      const formHandler = (e) => {
        const user_input = e.target.value;

        // Call search function from back-end to get list of terms/tags
        search_results = this.search_function(
          user_input, 
          data.search_term, 
          data.search_tag, 
          data.search_description, 
          data.case_insensitive
        );

        // If user don't input then make dropdown empty
        if (user_input.length === 0) {
          drop_el.style.height = 0;
          drop_el.innerHTML = '';
          return drop_el.innerHTML;
        }

        // Else initilize empty dropdown
        drop_el.innerHTML = '';

        // Only take number of maximum terms from list of terms
        const sliced_results = search_results.slice(0, this.MAXIMUM_ELEMENT_DISPLAY);

        // Create list item for each
        sliced_results.forEach((item) => {
          const list_el = document.createElement('li');

          // Add term id to list parameter so it can be set when redirecting
          list_el.term_id = item.id;

          // Set id and redirect to term page when clicked
          list_el.addEventListener('click', goToTermPage);

          // Create a wrapper to wrap term name
          let term_name_el = document.createElement('div');

          // Highlight substring matches non case sensitive result
          // https://stackoverflow.com/questions/3294576/
          let display_string = item.term_name;
          let reg = new RegExp(user_input, 'gi');
          display_string = display_string.replace(reg, (str) => `<b>${str}</b>`);

          // Add term name inside the wrapper then add wrapper inside list element
          term_name_el.innerHTML = display_string;
          list_el.appendChild(term_name_el);

          // Create a wrapper to display short description then add to list element
          let short_description_el = document.createElement('span');
          short_description_el.className = 'short-description';
          short_description_el.innerHTML = item.short_description;
          list_el.appendChild(short_description_el);

          drop_el.appendChild(list_el);
        });

        if (drop_el.children[0] === undefined) {
          drop_el.style.height = 0;
          return drop_el.style.height;
        }

        let totalChildrenHeight = drop_el.children[0].offsetHeight * sliced_results.length;
        drop_el.style.height = `${totalChildrenHeight}px`;
      };
      form_el.addEventListener('input', formHandler);
    } else if (this.function_name === 'findRequestedTag') {
      // When searching for tags
      if (!data){
        data = {
          'case_insensitive': true
        };
      }
      // Add event listener when pressing enter key
      form_el.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          // Only redirect when user input not empty
          if (form_el.value.length !== 0) {
            let tag_search_results = [];

            // Search for all terms in every tag result
            search_results.forEach((tag) => {
              let term_result = backend_function.findTermsOfTagExact(tag);
              // Build json for each tag then add to array
              let tag_with_terms = {
                'tag_name': tag,
                'terms': term_result
              };
              tag_search_results.push(tag_with_terms);
            });

            localStorage.setItem('tag_search_results', JSON.stringify(tag_search_results));
            redirection.jumpTagSearchHtml();
          }
        }
      });

      const goToTagPage = (e) => {
        let {tag_name} = e.currentTarget;
        // Search for all terms in tag
        let term_result = backend_function.findTermsOfTagExact(tag_name);
        // Build json for each tag then add to array
        let tag_search_results = [
          {
            'tag_name': tag_name,
            'terms': term_result
          }];

        localStorage.setItem('tag_search_results', JSON.stringify(tag_search_results));
        redirection.jumpTagSearchHtml();
      };

      const formHandler = (e) => {
        const user_input = e.target.value;

        // Call search function from back-end to get list of terms/tags
        search_results = this.search_function(user_input, data.case_insensitive);

        // If user don't input then make dropdown empty
        if (user_input.length === 0) {
          drop_el.style.height = 0;
          drop_el.innerHTML = '';
          return drop_el.innerHTML;
        }

        // Else initilize empty dropdown
        drop_el.innerHTML = '';

        // Only take number of maximum terms from list of terms
        const sliced_results = search_results.slice(0, this.MAXIMUM_ELEMENT_DISPLAY);

        // Create list item for each
        sliced_results.forEach((item) => {
          const list_el = document.createElement('li');

          // Add term id to list parameter so it can be set when redirecting
          list_el.tag_name = item;

          // Set id and redirect to term page when clicked
          list_el.addEventListener('click', goToTagPage);

          // Create a wrapper to wrap term name
          let term_name_el = document.createElement('div');

          // Highlight substring matches non case sensitive result
          // https://stackoverflow.com/questions/3294576/
          let display_string = item;
          let reg = new RegExp(user_input, 'gi');
          display_string = display_string.replace(reg, (str) => `<b>${str}</b>`);

          // Add term name inside the wrapper then add wrapper inside list element
          term_name_el.innerHTML = display_string;
          list_el.appendChild(term_name_el);

          drop_el.appendChild(list_el);
        });

        if (drop_el.children[0] === undefined) {
          drop_el.style.height = 0;
          return drop_el.style.height;
        }

        let totalChildrenHeight = drop_el.children[0].offsetHeight * sliced_results.length;
        drop_el.style.height = `${totalChildrenHeight}px`;
      };

      form_el.addEventListener('input', formHandler);
    }
  }

  static get template() {
    return `
        <style>
            @import 'src/components/serach-bar/search-bar.css';
        </style>
        <div class="container">
  <input id="search" type="text" placeholder="Search">
  <ul class="drop"></ul>
</div>
      `;
  }
}

customElements.define('search-bar', SearchBar);

/**
 * @typedef {{
 *  id: string,
 *  type: string,
 *  data: Object.<string, (text|number)>
 * }} data_block
 * 
 * @typedef {{
 *  time: number,
 *  blocks: data_block[],
 *  version: string
 * }} term_data
 *
 * @typedef {{
 *  id: string,
 *  term_name: string,
 *  tags: string[],
 *  short_description: string,
 *  term_data: term_data,
 *  published: boolean,
 *  created_by: string,
 *  created_time: string,
 *  edited_by: string,
 *  edited_date: string,
 *  edit_count: number
 * }} term
 */

/**
 * Popular tags functions
 */

/**
 * Get the most popular tags.
 * @param {number=} [count] Number of popular tags to return. If count is undefined,
 *  then all tags are returned.
 * @returns {string[]} An array of popular tags.
 */
export function getPopularTags(count) {
  const tag_counts = JSON.parse(localStorage.getItem('tag_counts')) || {};
  let popular_tags = Object.keys(tag_counts).sort(
    (t1, t2) => tag_counts[t2] - tag_counts[t1]
  );
  return popular_tags.slice(0, count);
}

/**
 * Return all terms which has the specified tag.
 * @param {string} tag Name of a tag
 * @returns {term[]} An array of all terms with this tag
 */
export function getDataOfTag(tag) {
  const dict = loadDict();
  const uuids = JSON.parse(localStorage.getItem('tags'))[tag] || [];
  let terms = [];
  for(let uuid of uuids) {
    let token = dict[uuid];
    terms.push(token);
  }
  return terms;
}

/**
 * Get some random terms with the specified tag.
 * @param {string} tag Name of a tag that the terms have
 * @param {number} [count=5] Number of terms to return. Default is 5.
 * @returns {term[]} An array of some terms that has the given tag
 */
export function getRandomTermsOfTag(tag, count=5) {
  const dict = loadDict();
  const uuids = JSON.parse(localStorage.getItem('tags'))[tag] || [];
  // get some random uuids
  let randomUuids = [];
  for (let i = 0; i < Math.min(uuids.length, count); i++) {
    let idx = Math.floor(Math.random() * uuids.length);
    while (uuids[idx] in randomUuids) {
      idx = Math.floor(Math.random() * uuids.length);
    }
    terms.push(uuids[idx]);
  }
  // convert uuid to term
  let terms = [];
  for(let uuid of randomUuids) {
    let token = dict[uuid];
    terms.push(token);
  }
  return terms;
}

/**
 * Get the first 5 terms of a tag
 * @param {string} tag_name the name of the tag you want the top 5 of
 * @returns {term[]} array of 5 terms
 */
export function top5terms(tag_name) {
  const dict = loadDict();
  const tags = JSON.parse(localStorage.getItem('tags')) || {};
  const terms_of_tag = tags[tag_name];
  // let count = Math.min(terms_of_tag.length, 5);
  let top5 = [];
  for(let i = 0; i < 5; i++) {
    // push term objects
    top5.push(dict[terms_of_tag[i]]);
  }
  return top5;
}

/**
 * Return an array of popular tags and their terms.
 * @returns {Array.<{tag_name: string, terms: term[]}>} An array of dicts with
 * tag name as key and 5 terms in an array as value
 */
export function getAllPopTags() {
  const tag_set = getPopularTags(3);
  let tags_dict = [];
  for(let i = 0; i < tag_set.length; i++){
    tags_dict.push({tag_name: tag_set[i], terms: top5terms(tag_set[i])});
    // tagsDict[tagSet[i]] = top5terms(tagSet[i]);
  }
  return tags_dict;
}

/**
 * Add uuid of a term to tags' uuid lists
 * @param {term} term A term with some tags
 */
export function updateTags(term) {
  const tags_dict = JSON.parse(localStorage.getItem('tags')) || {};

  for (const tag of term.tags) {
    tags_dict[tag] = tags_dict[tag] || [];
    if (term.id in tags_dict[tag]) continue;
    tags_dict[tag].push(term.id);
  }
  localStorage.setItem('tags', JSON.stringify(tags_dict));
}

/**
 * Increase the number of views of the tags of a term
 * @param {term} term 
 */
export function updateTagCount(term) {
  const tag_counts = JSON.parse(localStorage.getItem('tag_counts')) || {};

  for (const tag of term.tags) {
    tag_counts[tag] = tag_counts[tag] || 0;
    tag_counts[tag]++;
  }

  localStorage.setItem('tag_counts', JSON.stringify(tag_counts));
}

/**
 * Return term objects that are recently viewed by user.
 * @return {term[]} An array of term objects, size <= 5
 */
export function getDataOfRecents() {
  const dict = loadDict();
  const recents = JSON.parse(localStorage.getItem('recents')) || [];
  let recently_opened = [];
  for(let uuid of recents) {
    let token = dict[uuid];
    recently_opened.push(token);
  }
  return recently_opened;
}

/**
 * Update the array of recent terms so that the term is marked as being most
 * recently viewed. Only the 5 most recently viewed terms are saved.
 * @param {string} uuid The uuid of the recently viewed term
 */
export function updateRecents(uuid) {
  let recents = JSON.parse(localStorage.getItem('recents')) || [];
  let index = recents.indexOf(uuid);
  if(index !== -1){
    recents.splice(index, 1);
  } else {
    if(recents.length >= 5){
      recents.splice(0, 1);
    }
  }
  recents.push(uuid);
  localStorage.setItem('recents', JSON.stringify(recents));
}

/**
 * Load the dictionary of all terms. Key is the random term id. Value is the object.
 * @returns {Object.<string, term>} An dictionary
 */
function loadDict() {
  return JSON.parse(localStorage.getItem('terms')) || {};
}

/**
 * Save the given dictionay to `localstorage`.
 * @param {Object.<string, term>} dict A dictionary of `uuid: term` pairs
 */
function archiveDict(dict) {
  localStorage.setItem('terms', JSON.stringify(dict));
}

/**
 * //FIXME: duplicate with `loadDict`
 * Same as `loadDict`
 * @returns {Object.<string, term>} A dictionary of terms
 */
export function selectDict() {
  const dict = loadDict();
  return dict;
}

/**
 * Clear all terms in `localstorage`
 */
export function deleteAll() {
  const dict = loadDict();
  for(const [_, term] of Object.entries(dict)){
    deleteTerm(term);
  }
  // renderAllTerms(document.getElementById('dict'));
}

/**
 * Generate a random ID.
 * @returns {string} A random uuid.
 */
export function generateTermId() {
  return crypto.randomUUID();
}

/**
 * Put the given term into the database.
 * @param {term} term A term object
 * @returns {string} The id of the new term
 */
export function insertTerm(term) {
  // TODO: Decide how we are going to handle duplicate (consult with team)
  const dict = loadDict();
  term.id = generateTermId();
  dict[term.id] = term;
  archiveDict(dict);
  updateRecents(term.id);
  // location.reload();
  return term.id;
}

/**
 * Get the term of the uuid.
 * @param {string} term_id The uuid of a term
 * @returns {string} The term corresponding to the termId
 */
export function selectTerm(term_id) {
  const dict = loadDict();
  return dict[term_id];
}

/**
 * Update an existing term.
 * @param {term} term A term object
 */
export function updateTerm(term) {
  const cur_time = new Date();
  const dict = loadDict();
  term.edit_count += 1;
  term.edited_date = cur_time;
  term.edited_by = 'user';
  dict[term.id] = term;
  archiveDict(dict);
}

/**
 * Remove a term from `localstorage`.
 * @param {term} term The term
 * @returns {boolean} `true` if success; `false` otherwise
 */
export function deleteTerm(term) {
  let dict = loadDict();  
  let tags = JSON.parse(localStorage.getItem('tags'));
  let tagCount = JSON.parse(localStorage.getItem('tag_counts'));
  let recents = JSON.parse(localStorage.getItem('recents'));
  if(!(term.id in dict)) {
    return false;
  }
  delete dict[term.id];
  if(term.id in recents){
    delete recents[term.id];
    localStorage.setItem('recents', JSON.stringify(recents));
  }
  archiveDict(dict); 
  for(const tag of term.tags) {
    let uuids = tags[tag] || [];
    const i = uuids.indexOf(term.id);
    if(i != -1){
      tags[tag].splice(i, 1);
    }
    if(tags[tag].length === 0){
      delete tags[tag];
    }
    tagCount[tag] = tagCount[tag] - 1;
    if(tagCount[tag] <= 0){
      delete tagCount[tag];
    }
  }
  if(tags.length === 0){
    localStorage.setItem('tags', JSON.stringify({}));
  } else {
    localStorage.setItem('tags', JSON.stringify(tags));
  }  
  if(tagCount.length === 0){
    localStorage.setItem('tag_counts', JSON.stringify({}));
  } else {
    localStorage.setItem('tag_counts', JSON.stringify(tagCount));
  }     
  location.href='home.html';
  return true;
}

/**
 * Return the number of existing terms in `localstorage`.
 * @returns {number} The number of existing terms.
 */
export function termsCount() {
  const dict = loadDict();
  return Object.keys(dict).length;
}

/**
 * Add a term to the `localstorage` and update corresponding params in `localstorage`
 * while storing the embedded data using TinyMCE
 * @param {term} term A newly created term
 */
export function addTermToBackend(term){
  const cur_time = new Date();
  term['tags'] = term.tags.split(',');
  for(const i in term['tags']) {
    term['tags'][i] = term['tags'][i].trim();
    if(term['tags'][i] === '') {
      term['tags'].splice(i, 1);
    }
  }
  term['created_by'] = 'placeholder';
  term['created_time'] = cur_time;
  term['edited_by'] = 'placeholder';
  term['edited_date'] = cur_time;
  term['edit_count'] = 0;
  insertTerm(term);
  updateTags(term);
  updateTagCount(term);
}

/**
 * @deprecated
 */
export function addTermToDoc(term) {
  addTermToBackend(term);
}

/**
 * Find matching terms with the input.
 * @param {string} input The user input to the search bar
 * @param {boolean} s_term Whether to search in terms
 * @param {boolean} s_tag Whether to search in tags
 * @param {boolean} s_description Whether to search in descriptions
 * @param {boolean} [case_insensitive=false] Whether to match case
 * @return {term[]} A list of all the term associated with the search 
 */
export function findRequestedTerm(input, s_term, s_tag, s_description,
    case_insensitive=false) {
  const dict = loadDict();
  let search_result = [];
  // fall back to search terms
  if(!s_term && !s_tag && !s_description) {
    s_term = true;
  }
  // case insensitive
  if (case_insensitive) {
    input = input.toLowerCase();
  }
  // search tags
  if(s_tag) {
    const tags = JSON.parse(localStorage.getItem('tags')) || {};
    for (const [tag, ids] of Object.entries(tags)) {
      if (tag.toLowerCase().includes(input)) {
        for (const id of ids) {
          if (!search_result.includes(id)) {
            search_result.push(id);
          }
        }
      }
    }
  }
  // search terms and descriptions
  let term_name, short_description;
  for (const [id, term] of Object.entries(dict)) {
    if(search_result.includes(id)) continue;
    if(s_term) {
      term_name = term.term_name;
      if (case_insensitive) term_name = term_name.toLowerCase();
      if (term_name.includes(input)) {
        search_result.push(id);
        continue;
      }
    }
    if(s_description) {
      short_description = term.short_description;
      if (case_insensitive) short_description = short_description.toLowerCase();
      if (short_description.includes(input)){
        search_result.push(id);
        continue;
      }
    }
  }
  return search_result.map(id => dict[id]);
}

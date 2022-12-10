/// <reference types="jest" />
const functions = require('../src/backend/dict.js');

/* 
  From: https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
  A way to mock localStorage so testing can still be done.
*/
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// Mock crypto that gives the same id every time so it can be used for testing
global.localStorage = new LocalStorageMock();

class CryptoMock {
  constructor() {
    this.count = 0;
  }

  randomUUID() {
    return `ID#${++this.count}`;
  }
}

global.crypto = new CryptoMock();

// location var used for frontend is ignored as it causes problems with jest
global.location = new CryptoMock();

// Variables and objects for testing
const cur_time = new Date();
const termA = {
  id: 'ID#1',
  term_name: 'Term A',
  tags: 'tag1, tag2', // ['tag1', 'tag2'],
  short_description: 'This is the term description',
  term_data: 'This is the term data',
  published: true,
  created_by: 'user',
  created_time: cur_time.toISOString(),
  edited_by: 'user',
  edited_date: cur_time.toISOString(),
  edit_count: 0
};
const termAid = 'ID#1';
const terms = [{
  id: 'ID#2',
  term_name: 'Term B',
  tags: 'tag1, tag2', // ['tag1', 'tag2'],
  short_description: 'This is the term description',
  term_data: 'This is the term data',
  published: true,
  created_by: 'devOps',
  created_time: cur_time.toISOString(),
  edited_by: 'no one',
  edited_date: '',
  edit_count: 0
},
{
  id: 'ID#3',
  term_name: 'Term C',
  tags: 'tag1, tag2', // ['tag1', 'tag2'],
  short_description: 'This is the term description',
  term_data: 'This is the term data',
  published: true,
  created_by: 'devOps',
  created_time: cur_time.toISOString(),
  edited_by: 'no one',
  edited_date: '',
  edit_count: 0
},
{
  id: 'ID#4',
  term_name: 'Term D',
  tags: 'tag1, tag2', // ['tag1', 'tag2'],
  short_description: 'This is the term description',
  term_data: 'This is the term data',
  published: true,
  created_by: 'devOps',
  created_time: cur_time.toISOString(),
  edited_by: 'no one',
  edited_date: '',
  edit_count: 0
},
{
  id: 'ID#5',
  term_name: 'Term E',
  tags: 'tag2', // ['tag2'],
  short_description: 'This is the term description',
  term_data: 'This is the term data',
  published: true,
  created_by: 'devOps',
  created_time: cur_time.toISOString(),
  edited_by: 'no one',
  edited_date: '',
  edit_count: 0
},
{
  id: 'ID#6',
  term_name: 'Term F',
  tags: 'tag1', // ['tag1'],
  short_description: 'This is the term description',
  term_data: 'This is the term data',
  published: true,
  created_by: 'devOps',
  created_time: cur_time.toISOString(),
  edited_by: 'no one',
  edited_date: '',
  edit_count: 0
},
{
  id: 'ID#7',
  term_name: 'Term G',
  tags: 'tag3', // ['tag3'],
  short_description: 'This is the term description',
  term_data: 'This is the term data',
  published: true,
  created_by: 'devOps',
  created_time: cur_time.toISOString(),
  edited_by: 'no one',
  edited_date: '',
  edit_count: 0
},
{
  id: 'ID#8',
  term_name: 'Term H',
  tags: 'tag4', // ['tag3'],
  short_description: 'This is the term description',
  term_data: 'This is the term data',
  published: false,
  created_by: 'devOps',
  created_time: cur_time.toISOString(),
  edited_by: 'no one',
  edited_date: '',
  edit_count: 0
}];
const termids = ['ID#2', 'ID#3', 'ID#4', 'ID#5', 'ID#6', 'ID#7', 'ID#8'];
const listOfTags = ['tag1, tag2', 'tag1, tag2', 'tag1, tag2', 'tag2', 'tag1', 'tag3', 'tag4'];

// Try testing with one term
describe('Test Term and Tag Properties with 1 Term', () => {
  // Make sure there are no terms at first
  test('Check there are 0 terms by default', () => {
    expect(functions.termsCount()).toBe(0);
  }); 

  // Add a term and make sure it returns the correct id
  test('Check adding a term', () => {
    expect(functions.addTermToBackend(termA)).toBe(termAid);
  });

  // Make sure terms count is 1 now
  test('Check that there is 1 term now', () => {
    expect(functions.termsCount()).toBe(1);
  });

  // Select term A using the term's id
  test('Check selecting a term', () => {
    // Change date to ISOString;
    termA.created_time = termA.created_time.toISOString();
    termA.edited_date = termA.edited_date.toISOString();
    expect(functions.selectTerm(termAid)).toStrictEqual(termA);
  });

  // Get term with tag1 tag
  test('Check tag search of tag "tag1"', () => {
    expect(functions.getDataOfTag('tag1')).toStrictEqual([termA]);
  });

  // Get all popular tags
  test('Check all popular tags', () => {
    expect(functions.getPopularTags()).toStrictEqual(['tag1', 'tag2']);
  });

  // Check recent terms
  test('Check recent terms', () => {
    expect(functions.getDataOfRecents()).toStrictEqual([termA]);
  });

  // Make sure tag count is correct
  test('Check tag counts', () => {
    expect(functions.loadTagCounts()).toStrictEqual({'tag1': 1, 'tag2': 1});
  });
});

describe('Test Updating and Deleting with 1 Term', () => {
  // Update term's description and check if updated
  test('Check updating a term and edit count', () => {
    termA.tags = 'tag1, tag2';
    termA.short_description = 'This is the new term description';
    functions.updateTerm(termA);
    const term = functions.selectTerm(termAid);
    // Change date to ISOString;
    termA.edited_date = termA.edited_date.toISOString();
    expect(term).toStrictEqual(termA);
    expect(term.edit_count).toBe(1);
  });

  // Make sure tag count is correct
  test('Check tag counts', () => {
    expect(functions.loadTagCounts()).toStrictEqual({'tag1': 2, 'tag2': 2});
  });

  // Delete term
  test('Check deleting a term', () => {
    const termToDelete = functions.selectTerm(termAid);
    expect(functions.deleteTerm(termToDelete)).toBe(true);
  });

  // Try deleting term again and make sure terms count is 0
  test('Check double deleting a term and term count', () => {
    expect(functions.deleteTerm(termA)).toBe(false);
    expect(functions.termsCount()).toBe(0);
  });

  // Check non-existent term with tag1
  test('Check tag search of non-existent tag "tag1"', () => {
    expect(functions.getDataOfTag('tag1')).toStrictEqual([]);
  });

  // Make sure popular tags are empty
  test('Check popular tags are empty', () => {
    expect(functions.getPopularTags()).toStrictEqual([]);
  });

  // Make sure recent terms are empty
  test('Check recent terms are empty', () => {
    expect(functions.getDataOfRecents()).toStrictEqual([]);
  });
});

// Try testing with many terms
describe('Test Term and Tag Properties with Multiple Terms', () => {
  // Make sure there are no terms at first
  test('Check there are 0 terms by default', () => {
    expect(functions.termsCount()).toBe(0);
    localStorage.clear();
  }); 

  // Add 6 terms (1 unpublished) and make sure it returns the correct id
  test('Check adding 7 terms (1 unpublished)', () => {
    let ids = [];
    for(let term of terms) {
      ids.push(functions.addTermToBackend(term));
    }
    expect(ids).toStrictEqual(termids);
  });

  // Make sure term count is 6 now
  test('Check that term count is 5', () => {
    expect(functions.termsCount()).toBe(6);
  });

  // Select terms using the terms' id
  test('Check selecting terms', () => {
    let terms_select = [];
    // Change dates to ISOStrings
    for(let element of terms){
      element.created_time = element.created_time.toISOString();
      element.edited_date = element.edited_date.toISOString();
    }
    for(let termid of termids) {
      terms_select.push(functions.selectTerm(termid));
    }
    expect(terms_select).toStrictEqual(terms);
  });

  // Get terms with tag2 tag
  test('Check tag search of tag "tag2"', () => {
    expect(functions.getDataOfTag('tag2')).toStrictEqual([terms[0], terms[1], terms[2], terms[3]]);
  });

  // Get all popular tags
  test('Check all popular tags', () => {
    expect(functions.getPopularTags()).toStrictEqual(['tag1', 'tag2', 'tag3']);
  });

  // Check recent terms, should show recent 5 terms, not including unpublished
  test('Check recent 5 terms', () => {
    expect(functions.getDataOfRecents()).toStrictEqual([terms[1], terms[2], 
      terms[3], terms[4], terms[5]]);
  });

  // Get All Published Terms
  test('Check all published terms', () => {
    expect(functions.getAllPublishedTerms()).toStrictEqual([terms[0], terms[1], 
      terms[2], terms[3], terms[4], terms[5]]);
  });

  // Get All Unpublished Terms
  test('Check all unpublished terms', () => {
    expect(functions.getAllUnpublishedTerms()).toStrictEqual([terms[6]]);
  });

  // Make sure tag count is correct
  test('Check tag counts', () => {
    expect(functions.loadTagCounts()).toStrictEqual({'tag1': 4, 'tag2': 4, 'tag3': 1});
  });
});

describe('Test Updating and Deleting with Multiple Terms', () => {
  let newTerms = [];
  
  // Update terms' description and check if updated
  test('Check updating terms', () => {
    let editTerms = [];
    // Change tag property back to string form
    for(let element in terms){
      terms[element].tags = listOfTags[element];
    }
    for(let term in terms) {
      terms[term].short_description = 'This is the new term description';
      functions.updateTerm(terms[term]);
      editTerms.push(functions.selectTerm(termids[term]));
    }
    // Change dates to ISOStrings
    for(let element of terms){
      element.edited_date = element.edited_date.toISOString();
    }
    expect(editTerms).toStrictEqual(terms);
  });

  // Delete term C
  test('Check deleting term C', () => {
    const termToDelete = functions.selectTerm(termids[1]);
    expect(functions.deleteTerm(termToDelete)).toBe(true);
  });

  // Try deleting term C again and make sure term count is 5
  test('Check double deleting term C and term count', () => {
    expect(functions.deleteTerm(terms[1])).toBe(false);
    expect(functions.termsCount()).toBe(5);
  });

  // Select terms using the terms' id
  test('Check selecting remaining terms', () => {
    let terms_select = [];
    for(let termid in termids) {
      // Skip term C
      if(parseInt(termid, 10)===1) {
        continue;
      }
      terms_select.push(functions.selectTerm(termids[termid]));
      newTerms.push(terms[termid]);
    }
    expect(terms_select).toStrictEqual(newTerms);
  });

  // Publish termH and check edit and term counts
  test('Update to publish termH edit count', () => {
    terms[6].published = true;
    terms[6].tags = 'tag4';
    functions.updateTerm(terms[6]);
    const term = functions.selectTerm(termids[6]);
    // Change date to ISOString;
    terms[6].created_time = terms[6].created_time.toISOString();
    terms[6].edited_date = terms[6].edited_date.toISOString();
    expect(term).toStrictEqual(terms[6]);
    expect(term.edit_count).toBe(2);
    expect(functions.termsCount()).toBe(6);
  });

  // Make sure tag count is correct
  test('Check tag counts', () => {
    expect(functions.loadTagCounts()).toStrictEqual({
      'tag1': 8, 'tag2': 8, 'tag3': 2, 'tag4': 1
    });
  });

  // delete all terms and check count
  test('Check deleteing all terms and the terms count', () => {
    functions.deleteAll();
    expect(functions.termsCount()).toBe(0);
  });

  // Get no terms with tag2 tag
  test('Check empty tag search of tag "tag2"', () => {
    expect(functions.getDataOfTag('tag2')).toStrictEqual([]);
  });

  // Get all popular tags (empty)
  test('Check empty popular tags', () => {
    expect(functions.getPopularTags()).toStrictEqual([]);
  });

  // Check recent terms, should show no terms
  test('Check empty recent terms', () => {
    expect(functions.getDataOfRecents()).toStrictEqual([]);
  });

  // Get All Published Terms (empty)
  test('Check all published terms (none)', () => {
    expect(functions.getAllPublishedTerms()).toStrictEqual([]);
  });

  // Get All Unpublished Terms (empty)
  test('Check all unpublished terms (none)', () => {
    expect(functions.getAllUnpublishedTerms()).toStrictEqual([]);
  });

  // Unit Test for final video
  test('Unit Test for Final Video', () => {
    expect(2+2).toBe(4);
  });
});

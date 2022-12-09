# JSON File Formats

## Updates
Here is the updated term format. Each term is give a hash code for storage. Additional fields have also been added. This update is as of 11-11-2022. 
```
c1d9ca19-354c-4bb8-8690-0db74b153064: 
{
    created_by: "placeholder",
    created_time: "2022-11-28T01:49:12.137Z",edit_count: 0,
    edited_by: "placeholder",
    edited_date: "2022-11-28T01:49:12.137Z",
    id: "c1d9ca19-354c-4bb8-8690-0db74b153064",
    short_description: "This is a programming language.",
    tags: ["CSE", "SE"],
    term_data: "<p>This is a programming language that is widely used in various industries, high performance computing, game design, operating system, etc. I would say this is the best language in the world.&nbsp;</p>",
    term_name: "CPP"
}
```

## Context and Problem Statement
We need a place and a pattern to store the information regarding terms and tags.

## Decision Outcome
A hash will be created for each term created as the unique identifier in the collection of terms at the backend. All the term definitions, metadatas, and other informations supporting app's features are all stored in the browser's local storage. The recently added section and display by tag are keep tracked using a list. And the collection of terms are stored in a top level JSON file using the hash as the key. 

Terms:
```
[
  {
    "id": "Guid",
    "term_name": "Algorithm",
    "tags": [
      "CSE",
      "CSE 110"
    ],
    "short_description": "A finite set of unambiguous instructions that, given some set of initial conditions, can be performed in a prescribed sequence to achieve a certain goal and that has a recognizable set of end conditions.",
    "term_data": {},
    "published": true/false
    "created_by": "user",
    "created_time": "15:00 Nov 2nd, 2022",
    "edited_by": null,
    "edited_date": null
  }
]
```

Drafts:
```
[
  {
    "id": "Guid",
    "term_name": "Algorithm",
    "tags": [
      "CSE",
      "CSE 101"
    ],
    "short_description": "This is a draft.",
    "term_data": {},
    "created_by": "user",
    "created_time": "17:00 Nov 2nd, 2022",
    "edited_by": "user",
    "edited_date": "4:00 Nov 3rd, 2022"
  }
]
```

Homepage:
```
{
  "recently_opened": [
    {
      "id": "Guid1",
      "term_name": "Term name 1",
      "tags": [
        "CSE",
        "CSE 110"
      ],
      "short_description": "Some description 1"
    },
    {
      "id": "Guid2",
      "term_name": "Term name 1",
      "tags": [
        "CSE",
        "CSE 101"
      ],
      "short_description": "Some descript 2"
    }
  ],
  "tag_category": [
    {
      "tag_name": "CSE 110",
      "posts": [
        {
          "id": "Guid1",
          "term_name": "Term name 1",
          "tags": [
            "CSE",
            "CSE 110"
          ],
          "short_description": "Some description 1"
        }
      ]
    },
    {
      "tag_name": "CSE 101",
      "posts": [
        {
          "id": "Guid2",
          "term_name": "Term name 1",
          "tags": [
            "CSE",
            "CSE 110"
          ],
          "short_description": "Some descript 2"
        }
      ]
    }
  ]
}
```
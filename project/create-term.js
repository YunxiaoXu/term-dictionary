let button = document.getElementById("create-button");
console.log(button);
let term_name = document.getElementById("term_name");
let tags = document.getElementById("tags");
let short_description = document.getElementById("short_description");
let data = {};

button.addEventListener('click', function() {
    data.term_name = term_name.value;
    data.tags = tags.value;
    data.short_description = short_description.value;
    console.log(data);
})
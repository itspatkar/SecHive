
let selectedTags = new Set(); // Track selected tags
let tagsJSON = {}; // Store Tags JSON
let dataJSON = []; // Store Lists JSON
let catRed = []; // Red Colored

// Event listener for load JSON
document.addEventListener("DOMContentLoaded", () => {
    loadJSON('assets/data/tags.json', (data) => {
        tagsJSON = data;
        catRed = tagsJSON['catRed'];
        generateFilter();
    });

    loadJSON('assets/data/data.json', (data) => {
        dataJSON = data;
        generateList();
    });
});

// Load JSON files
function loadJSON(url, callback) {
    fetch(url)
        .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! Status: ${response.status}`))
        .then(callback)
        .catch(error => console.error('Error loading JSON:', error));
}

// Capitalize words/sentence
function capitalize(phrase) {
    return phrase
        .replace(/_/g, ' ')
        .split(" ") 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// Generate list
function generateList() {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';

    let counter = 0;

    dataJSON.forEach(function(item) {
        let listItem = document.createElement('div');
        listItem.classList.add('list-item');

        let title = document.createElement('h6');
        title.classList.add('title');
        title.textContent = item.name;

        let description = document.createElement('div');
        description.classList.add('text-muted');
        description.textContent = item.description;

        let sourceWrap = document.createElement('div');
        let source = document.createElement('a');
        source.href = item.url;
        source.target = "_blank";
        source.textContent = item.url;
        sourceWrap.appendChild(source);

        let filtersWrap = document.createElement('div');
        filtersWrap.classList.add('d-flex', 'flex-wrap');

        if (Array.isArray(item.technique)) {
            item.technique.forEach(function(itemTechnique) {
                let technique = document.createElement('span');
                technique.classList.add('alert', 'alert-primary');
                technique.setAttribute('data-tag', itemTechnique);
                technique.textContent = capitalize(itemTechnique);
                filtersWrap.appendChild(technique);
            });
        }

        if (Array.isArray(item.category)) {
            item.category.forEach(function(itemcategory) {
                let category = document.createElement('span');
                if (catRed.includes(itemcategory)) {
                    category.classList.add('alert', 'alert-danger');
                } else {
                    category.classList.add('alert', 'alert-success');
                }
                category.setAttribute('data-tag', itemcategory);
                category.textContent = capitalize(itemcategory);
                filtersWrap.appendChild(category);
            });
        }

        if (Array.isArray(item.target)) {
            item.target.forEach(function(itemTarget) {
                let target = document.createElement('span');
                target.classList.add('alert', 'alert-dark');
                target.setAttribute('data-tag', itemTarget);
                target.textContent = capitalize(itemTarget);
                filtersWrap.appendChild(target);
            });
        }

        listItem.appendChild(title);
        listItem.appendChild(description);
        listItem.appendChild(sourceWrap);
        listItem.appendChild(filtersWrap);
        dataList.appendChild(listItem);
        counter++;
    });

    document.getElementById("counter").textContent = counter - 1;
}

// Generate filters
function generateFilter() {
    const filterList = document.getElementById('filters');
    filterList.innerHTML = '';

    // Techniques
    let technique = document.createElement('div');
    technique.classList.add('filter-item');

    let techniqueTitle = document.createElement('h6');
    techniqueTitle.textContent = "Techniques";

    let techniqueBtn = document.createElement('div');

    tagsJSON['technique'].forEach(item => {
        let btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.classList.add('btn', 'btn-primary', 'btn-sm');
        btn.setAttribute('data-tag', item);
        btn.textContent = capitalize(item);

        btn.addEventListener('click', function () {
            toggleTagFilter(btn, item);
        });

        techniqueBtn.appendChild(btn);
    });

    technique.appendChild(techniqueTitle);
    technique.appendChild(techniqueBtn);

    // Categories
    let category = document.createElement('div');
    category.classList.add('filter-item');

    let categoryTitle = document.createElement('h6');
    categoryTitle.textContent = "Categories";

    let categoryBtn = document.createElement('div');

    tagsJSON['category'].forEach(item => {
        let btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        if (catRed.includes(item)) {
            btn.classList.add('btn', 'btn-danger', 'btn-sm');
        } else {
            btn.classList.add('btn', 'btn-success', 'btn-sm');
        }
        btn.setAttribute('data-tag', item);
        btn.textContent = capitalize(item);

        btn.addEventListener('click', function () {
            toggleTagFilter(btn, item);
        });

        categoryBtn.appendChild(btn);
    });

    category.appendChild(categoryTitle);
    category.appendChild(categoryBtn);

    // Targets
    let target = document.createElement('div');
    target.classList.add('filter-item');

    let targetTitle = document.createElement('h6');
    targetTitle.textContent = "Targets";

    let targetBtn = document.createElement('div');

    tagsJSON['target'].forEach(item => {
        let btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.classList.add('btn', 'btn-secondary', 'btn-sm');
        btn.setAttribute('data-tag', item);
        btn.textContent = capitalize(item);

        btn.addEventListener('click', function () {
            toggleTagFilter(btn, item);
        });

        targetBtn.appendChild(btn);
    });

    target.appendChild(targetTitle);
    target.appendChild(targetBtn);

    // Reset Btn
    let resetBtn = document.createElement('div');
    let btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.classList.add('btn', 'btn-dark', 'btn-sm');
    btn.setAttribute('data-tag', 'reset');
    btn.textContent = "RESET";
    btn.addEventListener('click', function () {
        toggleTagFilter(btn, 'reset');
    });
    resetBtn.appendChild(btn);

    // Append filters to filterList
    filterList.appendChild(technique);
    filterList.appendChild(category);
    filterList.appendChild(target);
    filterList.appendChild(resetBtn);
}

// Filter list items based on search and selected tags
function filterItems() {
    let searchFilter = document.getElementById('search').value.trim().toLowerCase();
    let listItems = document.querySelectorAll('.list-item');

    listItems.forEach(item => {
        let title = item.querySelector('.title').textContent.toLowerCase();
        let tags = Array.from(item.querySelectorAll('[data-tag]')).map(tag => tag.getAttribute('data-tag'));
        
        let matchesSearch = title.includes(searchFilter);
        let matchesTags = selectedTags.size === 0 || Array.from(selectedTags).some(tag => tags.includes(tag));

        item.style.display = matchesSearch && matchesTags ? 'block' : 'none';
    });
}

// Event listener for search filter
document.getElementById('search').addEventListener('input', function () {
    filterItems();
});

// Event listener for filter btns
function toggleTagFilter(button, tag) {
    if (tag === 'reset') {
        selectedTags.clear();
        document.querySelectorAll('button[data-tag]').forEach(btn => btn.classList.remove('active'));
        document.getElementById("search").value = "";
    } else {
        if (selectedTags.has(tag)) {
            selectedTags.delete(tag);
            button.classList.remove('active');
        } else {
            selectedTags.add(tag);
            button.classList.add('active');
        }
    }

    filterItems();
}

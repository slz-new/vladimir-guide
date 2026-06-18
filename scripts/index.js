let currentPage = 1;
const itemsPerPage = 6;

async function readConfig() {
    try {
        const response = await fetch('places.json'); 
        
        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка чтения файла:', error);
    }
}

function addElements() {
    readConfig()
        .then(places => {
            if (!places) return;
            const places_container = document.getElementById("places_list");
            places_container.innerHTML = ""; 
            places.forEach((info, index) => {
                const placeHTML = `
                <div class="places" id="place${index}" data-name="${info["name"]}" data-rating="${info["rating"]}" data-year="${info["year"]}">
                    <img src="${info["images"][0]}" alt="${info["name"]}">
                    <h4 class="placename">${info["name"]}</h4>
                    <h6 class="placecategory">${info["category"]}</h6>
                    <p class="placedesc">${info["description"]}</p>
                    <p class="placedate">${info["date"]}</p>
                    <span class="review-rating">★ ${info["rating"]}</span>
                </div>`;
                places_container.insertAdjacentHTML('beforeend', placeHTML);
            });
            updatePage();
        });
}

function updatePage() {
    const container = document.getElementById("places_list");
    const places = Array.from(container.querySelectorAll('.places'));
    const query = search_input.value.toLowerCase().trim();

    const filteredPlaces = places.filter(place => {
        const placeName = place.dataset.name.toLowerCase();
        return placeName.includes(query);
    });

    const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage) || 1;

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    places.forEach(place => {
        place.style.display = 'none';
    });

    filteredPlaces.forEach((place, index) => {
        if (index >= startIndex && index < endIndex) {
            place.style.display = '';
        }
    });

    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    if (prevBtn) {
        prevBtn.disabled = (currentPage === 1);
    }
    if (nextBtn) {
        nextBtn.disabled = (currentPage === totalPages);
    }
}

function sortPlaces(method) {
    const container = document.getElementById("places_list");
    const places = Array.from(container.querySelectorAll('.places'));
    if (method === 'default') return;
    
    places.sort((a, b) => {
        if (method === 'name') {
            return a.dataset.name.localeCompare(b.dataset.name, 'ru');
        }

        if (method === 'year-asc') {
            return Number(a.dataset.year) - Number(b.dataset.year);
        }

        if (method === 'year-desc') {
            return Number(b.dataset.year) - Number(a.dataset.year);
        }

        if (method === 'rating') {
            return Number(b.dataset.rating) - Number(a.dataset.rating);
        }
        return 0;
    });
    places.forEach(place => container.appendChild(place));
    updatePage();
}

const sort_method = document.getElementById("sort_method");
sort_method.addEventListener("change", (event) => {
    const method = event.target.value;
    sortPlaces(method);
});

const places_list = document.getElementById("places_list");
places_list.addEventListener("click", (event) => {
    let targetElement = event.target.closest('.places');
    if (!targetElement) return;
    window.location.href = 'details.html?id=' + String(Number(targetElement.id.replace("place", '')) + Number("1"));
});

const search_input = document.getElementById("search_input");
search_input.addEventListener("input", (event) => {
    currentPage = 1;
    updatePage();
});

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    });
}
if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        const container = document.getElementById("places_list");
        const places = Array.from(container.querySelectorAll('.places'));
        const query = search_input.value.toLowerCase().trim();
        const filteredCount = places.filter(place => place.dataset.name.toLowerCase().includes(query)).length;
        const totalPages = Math.ceil(filteredCount / itemsPerPage) || 1;

        if (currentPage < totalPages) {
            currentPage++;
            updatePage();
        }
    });
}

window.addEventListener("DOMContentLoaded", (event) => {
    addElements();
});
function renderReview(review) {
    const reviewsContainer = document.getElementById("reviews_list");
    if (!reviewsContainer) return;
    const reviewHTML = `
    <div class="review-card">
        <div class="review-header">
            <span class="review-author">${review.author}</span>
            <span class="review-rating">★ ${review.rating}</span>
        </div>
        <p class="review-text">${review.text}</p>
    </div>`;
    reviewsContainer.insertAdjacentHTML('beforeend', reviewHTML);
}

function showData(){
    if (!window.location.search.includes('?id=')) {
        window.location.search = '?id=1';
        return;
    }
    let current_id = Number(window.location.search.replace('?id=', '')) || 1;
    readConfig()
        .then(places => {
            if (!places) return;
            let info = places[current_id - 1];
            const details_container = document.querySelector(".details-container");
            document.getElementById("titletext").innerText = `${info["name"]} — Подробная информация`;
            details_container.innerHTML = ""; 
            let placeHTML = `
            <h2 class="details-title">${info["name"]}</h2>
            <h6 class="placecategory">${info["category"]}</h6>
            <div class="gallery">
                <div class="main-image">
                    <img src="${info["images"][0]}" id="mainphoto" alt="${info["name"]} — Фото 1">
                </div>
                <div class="thumbnails">`;
            for (let i = 1; i < info["images"].length; i++){
                placeHTML += `\n<img src="${info["images"][i]}" alt="${info["name"]} — Фото ${i + 1}">`;
            }
            placeHTML += `
            </div>
            </div>
            <section class="description-section">
                <h3>История и описание</h3>
                <p class="placedesc">${info["description"]}</p>
                <p class="placedate">${info["date"]}</p>
            </section>
            <hr class="separator">
            <section class="reviews-section">
                <h3>Отзывы посетителей</h3>
                <div id="reviews_list">`;
            let reviews = info["reviews"];
            for (let i = 0; i < reviews.length; i++){
                let review = reviews[i];
                placeHTML += `\n
                <div class="review-card">
                    <div class="review-header">
                        <span class="review-author">${review["author"]}</span>
                        <span class="review-rating">★ ${review["rating"]}</span>
                    </div>
                    <p class="review-text">${review["text"]}</p>
                </div>`;
            }
            placeHTML += `
                </div>
            </section>`;
            details_container.insertAdjacentHTML('beforeend', placeHTML);
            
            let localReviews = JSON.parse(localStorage.getItem(`reviews_place_${current_id}`)) || [];
            localReviews.forEach(review => {
                renderReview(review);
            });
            const thumbnails = document.querySelector(".thumbnails");
            if (thumbnails) {
                thumbnails.addEventListener("click", (event) => {
                    if (event.target.tagName !== 'IMG') return;
                    let blockphoto = event.target;
                    let blockmainphoto = document.querySelector('#mainphoto');
                    if (blockmainphoto) {
                        let tempSrc = blockmainphoto.src;
                        blockmainphoto.src = blockphoto.src;
                        blockphoto.src = tempSrc;
                    }
                });
            }
    });
}

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

function saveReview(current_id) {
    const authorInput = document.getElementById("review_author");
    const ratingSelect = document.getElementById("review_rating");
    const textInput = document.getElementById("review_text");
    const newReview = {
        author: authorInput.value.trim(),
        rating: ratingSelect.value,
        text: textInput.value.trim(),
        date: new Date().toLocaleDateString('ru-RU')
    };
    let localReviews = JSON.parse(localStorage.getItem(`reviews_place_${current_id}`)) || [];
    localReviews.push(newReview);
    localStorage.setItem(`reviews_place_${current_id}`, JSON.stringify(localReviews));
    return newReview;
}

const reviewForm = document.getElementById("review_form");
if (reviewForm) {
    reviewForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const current_id = Number(window.location.search.replace('?id=', '')) || 1;
        const createdReview = saveReview(current_id);
        renderReview(createdReview);
        reviewForm.reset();
    });
}

window.addEventListener("DOMContentLoaded", (event) =>{
    showData();
});
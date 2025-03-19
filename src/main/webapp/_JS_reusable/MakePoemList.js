"use strict";
function MakePoemList({ poemList = null, title = "Poem Collection", displayRating = true }) {
    if (poemList === null || poemList.length === 0) {
        const errorDiv = document.createElement("div");
        errorDiv.classList.add("error");
        errorDiv.textContent = "MakePoemList.js: Error generating component due to missing poem list.";
        return errorDiv;
    }

    const listComponent = document.createElement("div");
    listComponent.classList.add("poemList");
    listComponent.innerHTML = `<h2>${title}</h2>`;

    poemList.forEach(poem => {
        const poemComponent = MakePoem(poem);
        listComponent.appendChild(poemComponent);
    });

    return listComponent;

    function MakePoem({ poem_name = "Unknown", poem_author = "Anonymous", poem_text = "No text provided", poem_img = "pics/poem3.jpg", poem_genre, poem_date = new Date().toLocaleDateString(), poem_rating = "N/A" }) {
        const poemElement = document.createElement("div");
        poemElement.classList.add("poem");

        poemElement.innerHTML = `
            <div class="poemHeader">
                <h3>${poem_name} by ${poem_author}</h3>
                <span class="poemGenre">${poem_genre}</span>
                <span class="poemDate">${poem_date}</span>
                ${displayRating ? `<span class="poemRating">${poem_rating}</span>` : ''}
            </div>
            <img src="${poem_img}" alt="Image not available" class="poemImg">
            <p class="poemText">${poem_text}</p>
            <button class="toggleTextBtn">Show Text</button>
            <button class='changeRatingBtn'>Change Rating</button>
        `;

        // Reference interactive elements
        var changeRatingBtn = poemElement.querySelector('.changeRatingBtn');
        var toggleTextBtn = poemElement.querySelector('.toggleTextBtn');
        var poemTextElement = poemElement.querySelector('.poemText');

        // Event listener for changing the rating
        changeRatingBtn.addEventListener('click', function () {
            var newRating = prompt("Enter new rating:");
            if (newRating !== null && newRating >= 0 && newRating <= 5) {
                poemElement.querySelector('.poemRating').textContent = `Rating: ${newRating}`;
            } else {
                alert("Please enter a valid rating.");
            }
        });

        // Event listener for toggling poem text visibility
        toggleTextBtn.addEventListener('click', function () {
            poemTextElement.classList.toggle('hidden');
            toggleTextBtn.textContent = poemTextElement.classList.contains('hidden') ? 'Show Text' : 'Hide Text';
          });      
        return poemElement;
    };
}
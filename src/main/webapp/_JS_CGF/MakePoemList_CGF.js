"use strict";
function MakePoemList_CGF() {
    const container = document.createElement("div");
    container.classList.add("poemCGFContainer");

    // First list with full properties
    const fullList = MakePoemList({
        poemList: [
            { poem_name: "The Road Not Taken", poem_author: "Robert Frost", poem_text: `Two roads diverged in a yellow wood,
            And sorry I could not travel both
            And be one traveler, long I stood
            And looked down one as far as I could
            To where it bent in the undergrowth;
            
            Then took the other, as just as fair,
            And having perhaps the better claim,
            Because it was grassy and wanted wear;
            Though as for that the passing there
            Had worn them really about the same,
            
            And both that morning equally lay
            In leaves no step had trodden black.
            Oh, I kept the first for another day!
            Yet knowing how way leads on to way,
            I doubted if I should ever come back.
            
            I shall be telling this with a sigh
            Somewhere ages and ages hence:
            Two roads diverged in a wood, and I—
            I took the one less traveled by,
            And that has made all the difference.`, poem_img: "pics/poem5.jpg", poem_genre: "Nature", poem_date: "1916-08-01", poem_rating: "4.5" },
            { poem_name: "Daffodils", poem_author: "William Wordsworth", poem_text: `I wandered lonely as a cloud
            That floats on high o’er vales and hills,
            When all at once I saw a crowd,
            A host, of golden daffodils;
            Beside the lake, beneath the trees,
            Fluttering and dancing in the breeze.
            
            Continuous as the stars that shine
            And twinkle on the milky way,
            They stretched in never-ending line
            Along the margin of a bay:
            Ten thousand saw I at a glance,
            Tossing their heads in sprightly dance.
            
            The waves beside them danced; but they
            Out-did the sparkling waves in glee:
            A poet could not but be gay,
            In such a jocund company:
            I gazed—and gazed—but little thought
            What wealth the show to me had brought:
            
            For oft, when on my couch I lie
            In vacant or in pensive mood,
            They flash upon that inward eye
            Which is the bliss of solitude;
            And then my heart with pleasure fills,
            And dances with the daffodils.`, poem_img: "pics/poem6.jpg", poem_genre: "Nature", poem_date: "1804-04-01", poem_rating: "4.8" }
        ],
        title: "Famous Poems",
        displayRating: true
    });

    // Second list with poemList provided but without displayRating (to use default behavior)
    const minimalListDisplay = MakePoemList({
        poemList: [
            { poem_name: "Ozymandias", poem_author: "Percy Bysshe Shelley", poem_img: "pics/poem7.jpg", poem_genre: "Sonnet" },
            { poem_name: "Sonnet 18", poem_author: "William Shakespeare", poem_img: "pics/poem8.jpg", poem_genre: "Sonnet" }
        ],
        title: "Iconic Sonnets"
    });

    // Third list with minimal parameters
    const defaultList = MakePoemList({
        poemList: [
            {}, // Testing with an empty object to see default handling
        ],
        title: "Empty Poem List"
    });

       // Fourth list with empty parameters
       const emptyList = MakePoemList({
        poemList: [],
        title: "Empty Poem List"
    });

    container.appendChild(fullList);
    container.appendChild(document.createElement("hr")); 
    container.appendChild(minimalListDisplay);
    container.appendChild(document.createElement("hr"));
    container.appendChild(defaultList);
    container.appendChild(emptyList);
    return container;
}
"use strict";

const MakePoemListR = ({ poemList = [], title = "Poem Collection", displayRating = true }) => {
  if (!poemList.length) {
    return <div className="error">MakePoemListR.js: Error generating component due to missing poem list.</div>;
  }

  const Poem = ({ poem_name = "Unknown", poem_author = "Anonymous", poem_text = "No text provided", poem_img = "pics/poem3.jpg", poem_genre, poem_date = new Date().toLocaleDateString(), poem_rating = "N/A" }) => {
    const [rating, setRating] = React.useState(poem_rating);
    const [isTextHidden, setIsTextHidden] = React.useState(false);

    // Handler for changing the poem rating with validation
    const changeRating = () => {
      const newRating = prompt("Enter new rating:");
      if (newRating !== null) {
        const ratingValue = parseFloat(newRating);
        if (!isNaN(ratingValue) && ratingValue >= 0 && ratingValue <= 5) {
          setRating(ratingValue);
        } else {
          alert("Please enter a valid rating.");
        }
      }
    };

    const toggleTextVisibility = () => {
      setIsTextHidden(!isTextHidden);
    };

    return (
      <div className="poem">
        <div className="poemHeader">
          <h3>{poem_name} by {poem_author}</h3>
          <span className="poemGenre">{poem_genre}</span>
          <span className="poemDate">{poem_date}</span>
          {displayRating && <span className="poemRating">Rating: {rating}</span>}
        </div>
        <img src={poem_img} alt={`${poem_name} cover`} className="poemImg" />
        <p className={`poemText ${isTextHidden ? 'hidden' : ''}`}>
          {poem_text}
        </p>
        <button className="toggleTextBtn" onClick={toggleTextVisibility}>
          {isTextHidden ? 'Show Text' : 'Hide Text'}
        </button>
        <button class="changeRatingBtn" onClick={changeRating}>Change Rating</button>
      </div>
    );
  };

  return (
    <div className="poemList">
      <h2>{title}</h2>
      {poemList.map((poem, index) => <Poem key={index} {...poem} />)}
    </div>
  );
};
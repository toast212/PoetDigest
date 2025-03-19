package model.poem;

public class StringData {
    public String poemId = ""; // Corresponds to "poem_id" in poem table, auto-increment primary key
    public String poemName = ""; // Corresponds to "poem_name" in poem table, the unique descriptive field
    public String poemAuthor = ""; // Corresponds to "poem_author" in the poem table, optional
    public String poemText = ""; // Corresponds to "poem_text" in the poem table, unique
    public String poemImg = ""; // Corresponds to "poem_img" in the poem table
    public String poemGenre = ""; // Corresponds to "poem_genre" in the poem table
    public String poemDate = ""; // Corresponds to "poem_date" in the poem table, optional
    public String poemRating = ""; // Corresponds to "poem_rating" in the poem table, optional (decimal format)
    public String webUserId = ""; // Foreign key field from "other" DB table to the web_user table
    public String userEmail = ""; // Corresponds to "user_email" in the web_user table
    public String userImage = ""; // Corresponds to "user_image" in the web_user table
    public String errorMsg = ""; // For database error messages, not stored in the database

    // Default constructor
    public StringData() {
    }

    public int characterCount() {
        String s = this.poemId + this.poemName + this.poemAuthor +
                this.poemText + this.poemImg + this.poemGenre +
                this.poemRating + this.webUserId + this.userEmail + this.userImage + this.errorMsg;
        return s.length();
    }
    
}
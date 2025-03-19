package model.poem;

import java.util.ArrayList;

public class StringDataList {
    public String dbError = ""; // To hold any database error message
    public ArrayList<StringData> poemList = new ArrayList<>(); // Rename "webUserList" to "poemList"

    // Default constructor
    public StringDataList() {
    }

    // Method to add a StringData (Poem) object to the list
    public void add(StringData stringData) {
        this.poemList.add(stringData);
    }

}
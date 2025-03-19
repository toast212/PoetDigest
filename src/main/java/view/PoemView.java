package view;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import model.poem.*;
import dbUtils.*;

public class PoemView {

    public static StringDataList getAllPoems(DbConn dbc) {

        // sdl will be an empty array and DbError with ""
        StringDataList sdl = new StringDataList();

        sdl.dbError = dbc.getErr(); // returns "" if connection is good, else db error msg.
        if (sdl.dbError.length() > 0) {
            return sdl; // cannot proceed, db error (and that's been recorded in return object).
        }

        // sd will have all of it's fields initialized to ""
        StringData sd = new StringData();

        try {
            String sql = "SELECT p.*, u.user_email, u.user_image " +
                    "FROM poem p " +
                    "JOIN web_user u ON p.web_user_id = u.web_user_id " +
                    "ORDER BY p.poem_id"; // Ensuring a specific order in the result set
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();

            while (results.next()) {

                sd = new StringData();

                // the Format methods do not throw exceptions. If they find illegal data (like
                // you
                // tried to format a date as an integer), they return an error message (instead
                // of
                // returning the formatted value). So, you'll see these error messages right in
                // the
                // API output (JSON data) and/or you'll see it on the page in the UI.

                sd.poemId = Format.fmtInteger(results.getObject("poem_id"));
                sd.poemName = Format.fmtString(results.getObject("poem_name"));
                sd.poemAuthor = Format.fmtString(results.getObject("poem_author"));
                sd.poemText = Format.fmtString(results.getObject("poem_text"));
                sd.poemImg = Format.fmtString(results.getObject("poem_img"));
                sd.poemGenre = Format.fmtString(results.getObject("poem_genre"));
                sd.poemDate = Format.fmtDate(results.getObject("poem_date"));
                sd.poemRating = Format.fmtDecimal(results.getObject("poem_rating"));
                sd.webUserId = Format.fmtInteger(results.getObject("web_user_id"));
                sd.userEmail = Format.fmtString(results.getObject("user_email"));
                sd.userImage = Format.fmtString(results.getObject("user_image"));

                sdl.add(sd);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in PoemView.getAllPoems(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
}
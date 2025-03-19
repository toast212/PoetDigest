package model.poem;

import dbUtils.*;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class DbMods {
    private static StringData validate(StringData inputData) {
        StringData errorMsgs = new StringData();

        errorMsgs.poemName = Validate.stringMsg(inputData.poemName, 45, true);
        errorMsgs.poemAuthor = Validate.stringMsg(inputData.poemAuthor, 45, false);
        errorMsgs.poemText = Validate.stringMsg(inputData.poemText, 1000, true);
        errorMsgs.poemImg = Validate.stringMsg(inputData.poemImg, 300, false);
        errorMsgs.poemGenre = Validate.stringMsg(inputData.poemGenre, 20, false);
        errorMsgs.poemDate = Validate.dateMsg(inputData.poemDate, false);
        errorMsgs.poemRating = Validate.ratingMsg(inputData.poemRating, false);
        errorMsgs.webUserId = Validate.integerMsg(inputData.webUserId, true);

        return errorMsgs;
    }

    public static StringData insert(StringData inputData, DbConn dbc) {
        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.characterCount() > 0) {
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;
        } else {
            String sql = "INSERT INTO poem (poem_name, poem_author, poem_text, poem_img, poem_genre, " +
                    "poem_date, poem_rating, web_user_id) values (?,?,?,?,?,?,?,?)";

            PrepStatement pStatement = new PrepStatement(dbc, sql);

            pStatement.setString(1, inputData.poemName);
            pStatement.setString(2, inputData.poemAuthor);
            pStatement.setString(3, inputData.poemText);
            pStatement.setString(4, inputData.poemImg);
            pStatement.setString(5, inputData.poemGenre);
            pStatement.setDate(6, Validate.convertDate(inputData.poemDate));
            pStatement.setBigDecimal(7, Validate.convertRating(inputData.poemRating));
            pStatement.setInt(8, Validate.convertInteger(inputData.webUserId));

            int numRows = pStatement.executeUpdate();

            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = "";
                } else {
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid Web User Id - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "Duplicate poem name or text - " + errorMsgs.errorMsg;
            }
        }
        return errorMsgs;
    }

    public static StringData getById(DbConn dbc, String id) {
        StringData sd = new StringData();
        if (id == null) {
            sd.errorMsg = "Cannot getById (poem): id is null";
            return sd;
        }

        Integer intId;
        try {
            intId = Integer.valueOf(id);
        } catch (Exception e) {
            sd.errorMsg = "Cannot getById (poem): URL parameter 'id' can't be converted to an Integer.";
            return sd;
        }
        try {
            String sql = "SELECT poem_id, poem_name, poem_author, poem_text, poem_img, poem_genre, " +
                    "poem_date, poem_rating, web_user_id " +
                    "FROM poem WHERE poem_id = ?";
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            stmt.setInt(1, intId);

            ResultSet results = stmt.executeQuery();
            if (results.next()) {
                sd.poemId = Format.fmtInteger(results.getObject("poem_id"));
                sd.poemName = Format.fmtString(results.getObject("poem_name"));
                sd.poemAuthor = Format.fmtString(results.getObject("poem_author"));
                sd.poemText = Format.fmtString(results.getObject("poem_text"));
                sd.poemImg = Format.fmtString(results.getObject("poem_img"));
                sd.poemGenre = Format.fmtString(results.getObject("poem_genre"));
                sd.poemDate = Format.fmtDate(results.getObject("poem_date"));
                sd.poemRating = Format.fmtDecimal(results.getObject("poem_rating"));
                sd.webUserId = Format.fmtInteger(results.getObject("web_user_id"));
            } else {
                sd.errorMsg = "Poem Not Found.";
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in model.poem.DbMods.getById(): " + e.getMessage();
        }
        return sd;
    }

    public static StringData update(StringData updateData, DbConn dbc) {
        StringData errorMsgs = new StringData();
        errorMsgs = validate(updateData);

        errorMsgs.poemId = Validate.integerMsg(updateData.poemId, true);

        if (errorMsgs.characterCount() > 0) {
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;
        } else {
            String sql = "UPDATE poem SET poem_name = ?, poem_author = ?, poem_text = ?, poem_img = ?, " +
                    "poem_genre = ?, poem_date = ?, poem_rating = ?, web_user_id = ? WHERE poem_id = ?";

            PrepStatement pStatement = new PrepStatement(dbc, sql);

            pStatement.setString(1, updateData.poemName);
            pStatement.setString(2, updateData.poemAuthor);
            pStatement.setString(3, updateData.poemText);
            pStatement.setString(4, updateData.poemImg);
            pStatement.setString(5, updateData.poemGenre);
            pStatement.setDate(6, Validate.convertDate(updateData.poemDate));
            pStatement.setBigDecimal(7, Validate.convertRating(updateData.poemRating));
            pStatement.setInt(8, Validate.convertInteger(updateData.webUserId));
            pStatement.setInt(9, Validate.convertInteger(updateData.poemId));

            int numRows = pStatement.executeUpdate();

            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = "";
                } else {
                    errorMsgs.errorMsg = numRows + " records were updated when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid Web User Id - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "Duplicate poem name or text - " + errorMsgs.errorMsg;
            }
        }
        return errorMsgs;
    }

    public static StringData delete(DbConn dbc, String poemId) {

        StringData sd = new StringData();

        if (poemId == null) {
            sd.errorMsg = "model.poem.DbMods.delete: " +
                    "cannot delete poem record because 'poemId' is null";
            return sd;
        }

        sd.errorMsg = dbc.getErr();
        if (sd.errorMsg.length() > 0) { // cannot proceed, db error
            return sd;
        }

        try {

            String sql = "DELETE FROM poem WHERE poem_id = ?";

            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            pStatement.setString(1, poemId);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                sd.errorMsg = "Record not deleted - there was no record with poem_id " + poemId;
            } else if (numRowsDeleted > 1) {
                sd.errorMsg = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }

        } catch (Exception e) {
                sd.errorMsg = "There was an issue with deletion. Please try again later. Error: Exception thrown in model.poem.DbMods.delete(): " + e.getMessage();
        }

        return sd;
    }
}
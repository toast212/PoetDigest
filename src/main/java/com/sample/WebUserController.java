package com.sample;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import model.webUser.*;
import dbUtils.*;
import view.WebUserView;
import jakarta.servlet.http.*;

@RestController
public class WebUserController {

    @RequestMapping(value = "/webUser/getAll", produces = "application/json")
    public String allUsers() {

        StringDataList list = new StringDataList(); // dbError empty, list empty
        DbConn dbc = new DbConn();
        list = WebUserView.getAllUsers(dbc);

        dbc.close(); // EVERY code path that opens a db connection must close it
                     // (or else you have a database connection leak).

        return Json.toJson(list); // convert sdl obj to JSON Format and return that.
    }

    @RequestMapping(value = "/webUser/logon", produces = "application/json")
    public String logonAPI(@RequestParam("email") String email, @RequestParam("password") String password,
            HttpServletRequest request) {
        StringData sd = new StringData();
        DbConn dbc = new DbConn();
        try {
            sd = WebUserView.getUserByEmailAndPassword(dbc, email, password);
            if (sd.errorMsg.length() == 0) {
                HttpSession session = request.getSession();
                session.setAttribute("loggedOnUser", sd);
            } else {
                HttpSession session = request.getSession();
                session.invalidate();
                sd.errorMsg = "Credentials not found";
            }
        } catch (Exception e) {
            sd.errorMsg = "Exception in logonAPI: " + e.getMessage();
        } finally {
            dbc.close();
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/getProfile", produces = "application/json")
    public String getProfileAPI(HttpServletRequest request) {
        StringData sd = new StringData();
        try {
            HttpSession session = request.getSession();
            if (session.getAttribute("loggedOnUser") != null) {
                sd = (StringData) session.getAttribute("loggedOnUser");
            } else {
                sd.errorMsg = "No user logged on";
            }
        } catch (Exception e) {
            sd.errorMsg = "Exception in getProfileAPI: " + e.getMessage();
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/logoff", produces = "application/json")
    public String logoffAPI(HttpServletRequest request) {
        StringData sd = new StringData();
        try {
            HttpSession session = request.getSession();
            session.invalidate();
            sd.errorMsg = "User is now logged off";
        } catch (Exception e) {
            sd.errorMsg = "Exception in logoffAPI: " + e.getMessage();
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/insert", params = { "jsonData" }, produces = "application/json")
    public String insert(@RequestParam("jsonData") String jsonInsertData) {

        StringData errorMsgs = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorMsgs.errorMsg = "Cannot insert. No user data was provided in JSON format";
        } else {
            System.out.println("user data for insert (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData insertData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("user data for insert (java obj): " + insertData.toString());

                DbConn dbc = new DbConn();
                errorMsgs.errorMsg = dbc.getErr();
                if (errorMsgs.errorMsg.length() == 0) { // db connection OK
                    errorMsgs = DbMods.insert(insertData, dbc);
                } else {
                    errorMsgs.errorMsg = "Database unavailable, please try later. " + errorMsgs.errorMsg;
                }
                dbc.close();
            } catch (Exception e) {
                String msg = "Could not convert jsonData to model.webUser.StringData obj: " +
                        jsonInsertData + " - or other error in controller for 'user/insert': " +
                        e.getMessage();
                System.out.println(msg);
                errorMsgs.errorMsg += ". " + msg;
            }
        }
        return Json.toJson(errorMsgs);
    }

    @RequestMapping(value = "/webUser/getById", params = {
            "userId" }, produces = "application/json")
    public String getById(@RequestParam("userId") String userId) {
        StringData sd = new StringData();
        if (userId == null) {
            sd.errorMsg = "Error: URL must be user/getById/xx " +
                    "where xx is the web_user_id of the desired web_user record.";
        } else {
            DbConn dbc = new DbConn();
            sd.errorMsg = dbc.getErr();
            if (sd.errorMsg.length() == 0) {
                System.out.println("*** Ready to call DbMods.getById");
                sd = DbMods.getById(dbc, userId);
            }
            dbc.close(); // EVERY code path that opens a db connection must close it
            // (or else you have a database connection leak).
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/update", params = { "jsonData" }, produces = "application/json")
    public String update(@RequestParam("jsonData") String jsonInsertData) {

        StringData errorData = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorData.errorMsg = "Cannot update. No user data was provided in JSON format";
        } else {
            System.out.println("user data for update (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData updateData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("user data for update (java obj): " + updateData.toString());

                // The next 3 statements handle their own exceptions (so should not throw any
                // exception).
                DbConn dbc = new DbConn();
                errorData = DbMods.update(updateData, dbc);
                dbc.close();
            } catch (Exception e) {
                String msg = "Unexpected error in controller for 'webUser/insert'... " +
                        e.getMessage();
                System.out.println(msg);
                errorData.errorMsg = msg;
            }
        }
        return Json.toJson(errorData);
    }

    @RequestMapping(value = "/webUser/delete", params = {
            "userId" }, produces = "application/json")
    public String deleteUser(@RequestParam("userId") String deleteUserId) {
        StringData sd = new StringData();
        if (deleteUserId == null) {
            sd.errorMsg = "Cannot delete user. No user ID was provided.";
        } else {
            DbConn dbc = new DbConn();
            sd.errorMsg = dbc.getErr();
            if (sd.errorMsg.length() == 0) {
                sd = DbMods.delete(dbc, deleteUserId);
            } else {
                sd.errorMsg = "The database is currently unavailable. Please try later or contact support.";
            }
            dbc.close();
        }
        return Json.toJson(sd);
    }

}
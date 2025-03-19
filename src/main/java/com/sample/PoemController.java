package com.sample;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import model.poem.*;
import dbUtils.*;
import view.PoemView;

@RestController
public class PoemController {

    @RequestMapping(value = "/poem/getAll", produces = "application/json")
    public String getAllPoems() {

        StringDataList list = new StringDataList(); // dbError empty, list empty
        DbConn dbc = new DbConn();
        list = PoemView.getAllPoems(dbc);

        dbc.close(); // EVERY code path that opens a db connection must close it
        // (or else you have a database connection leak).

        return Json.toJson(list); // convert sdl obj to JSON Format and return that.
    }

    @RequestMapping(value = "/poem/insert", params = { "jsonData" }, produces = "application/json")
    public String insert(@RequestParam("jsonData") String jsonInsertData) {
        StringData errorMsgs = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorMsgs.errorMsg = "Cannot insert. No poem data was provided in JSON format";
        } else {
            System.out.println("Poem data for insert (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData insertData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("Poem data for insert (java obj): " + insertData.toString());

                DbConn dbc = new DbConn();
                errorMsgs.errorMsg = dbc.getErr();
                if (errorMsgs.errorMsg.length() == 0) { // db connection OK
                    errorMsgs = DbMods.insert(insertData, dbc);
                } else {
                    errorMsgs.errorMsg = "Database unavailable, please try later. " + errorMsgs.errorMsg;
                }
                dbc.close();
            } catch (Exception e) {
                String msg = "Could not convert jsonData to model.poem.StringData obj: " +
                        jsonInsertData + " - or other error in controller for 'poem/insert': " +
                        e.getMessage();
                System.out.println(msg);
                errorMsgs.errorMsg += ". " + msg;
            }
        }
        return Json.toJson(errorMsgs);
    }

    @RequestMapping(value = "/poem/getById", params = { "poemId" }, produces = "application/json")
    public String getById(@RequestParam("poemId") String poemId) {
        StringData sd = new StringData();
        if (poemId == null) {
            sd.errorMsg = "Error: URL must be poem/getById/xx where xx is the poem_id of the desired poem record.";
        } else {
            DbConn dbc = new DbConn();
            sd.errorMsg = dbc.getErr();
            if (sd.errorMsg.length() == 0) {
                sd = DbMods.getById(dbc, poemId);
            }
            dbc.close();
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/poem/update", params = { "jsonData" }, produces = "application/json")
    public String update(@RequestParam("jsonData") String jsonUpdateData) {
        StringData errorData = new StringData();
        if ((jsonUpdateData == null) || jsonUpdateData.length() == 0) {
            errorData.errorMsg = "Cannot update. No poem data was provided in JSON format";
        } else {
            System.out.println("Poem data for update (JSON): " + jsonUpdateData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData updateData = mapper.readValue(jsonUpdateData, StringData.class);
                System.out.println("Poem data for update (java obj): " + updateData.toString());
                DbConn dbc = new DbConn();
                errorData = DbMods.update(updateData, dbc);
                dbc.close();
            } catch (Exception e) {
                String msg = "Unexpected error in controller for 'poem/update'... " +
                        e.getMessage();
                System.out.println(msg);
                errorData.errorMsg = msg;
            }
        }
        return Json.toJson(errorData);
    }

    @RequestMapping(value = "/poem/delete", params = {
            "poemId" }, produces = "application/json")
    public String deletePoem(@RequestParam("poemId") String deletePoemId) {
        StringData sd = new StringData();
        if (deletePoemId == null) {
            sd.errorMsg = "Cannot delete poem. No poem ID was provided.";
        } else {
            DbConn dbc = new DbConn();
            sd.errorMsg = dbc.getErr();
            if (sd.errorMsg.length() == 0) {
                sd = DbMods.delete(dbc, deletePoemId);
            } else {
                sd.errorMsg = "The database is currently unavailable. Please try later or contact support.";
            }
            dbc.close();
        }
        return Json.toJson(sd);
    }

}
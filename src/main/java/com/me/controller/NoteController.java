package com.me.controller;

import com.me.entity.Note;
import com.me.entity.Result;
import com.me.service.NoteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@Slf4j
public class NoteController {

    @Autowired
    private NoteService noteService;

    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/api/{userId}/notes", method = RequestMethod.GET)
    public Result list(@PathVariable Integer userId) {
        log.info("Get Notes by UserId");
        List<Note> noteList = noteService.showNotes(userId);
        return Result.success(noteList);
    }


    @CrossOrigin(origins = "*")
    @DeleteMapping("/api/{userId}/notes/{noteId}")
    public Result deleteNote(@PathVariable Integer noteId, @PathVariable Integer userId) {
        log.info("{} delete note id: {}", userId, noteId);
        noteService.deletenote(noteId, userId);
        return Result.success();
    }

    /*
    @CrossOrigin(origins = "*")
    @PostMapping("/notes")
    public Result add(@RequestBody Note note) {
        log.info("add a new note", note);
        noteService.addNote(note);
        return Result.success();
    }
    */

    @CrossOrigin(origins = "*")
    @PostMapping("/api/{userId}/notes")
    public Result addNote(@PathVariable Integer userId) {
        log.info("{} adds a new note", userId);
        noteService.addNote(userId);
        return Result.success();
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/api/{userId}/notes")
    public Result updateNote(@RequestBody Note note) {
        log.info("Updates the note {}", note);
        noteService.updateNote(note);
        return Result.success();
    }

}

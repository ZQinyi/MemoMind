package com.me.service;

import com.me.Entity.Note;

import java.util.List;

public interface NoteService {
    List<Note> showNotes(Integer userid);

    void deletenote(Integer id);

    void addNote(Integer userId);

    void updateNote(Note note);
}

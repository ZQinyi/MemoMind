package com.me.service.impl;

import com.me.entity.Note;
import com.me.exception.UnauthorizedException;
import com.me.mapper.NoteMapper;
import com.me.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Service
public class NoteServiceImpl implements NoteService {

    @Autowired
    private NoteMapper noteMapper;
    @Override
    public List<Note> showNotes(Integer userid) {
        return noteMapper.searchNotes(userid);
    }

    @Override
    public void deletenote(Integer noteId, Integer userId) {
        Note note = noteMapper.findByNoteId(noteId);
        if (note == null) {
            throw new UnauthorizedException("Not found");
        }
        if (!note.getUserId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this note");
        }
        noteMapper.delete(noteId);
    }

    @Override
    public void addNote(Integer userId) {
        noteMapper.insert(userId);
    }

    @Override
    public void updateNote(Note note) { noteMapper.update(note); }

}

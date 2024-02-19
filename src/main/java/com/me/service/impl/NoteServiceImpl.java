package com.me.service.impl;

import com.me.Entity.Note;
import com.me.mapper.NoteMapper;
import com.me.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public void deletenote(Integer id) { noteMapper.delete(id); }
    @Override
    public void addNote(Integer userId) {
        noteMapper.insert(userId);
    }

    @Override
    public void updateNote(Note note) { noteMapper.update(note); }
}

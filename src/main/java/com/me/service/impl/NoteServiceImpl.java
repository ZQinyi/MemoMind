package com.me.service.impl;

import com.me.entity.Note;
import com.me.entity.SimpleNoteDto;
import com.me.exception.UnauthorizedException;
import com.me.mapper.NoteMapper;
import com.me.service.NoteService;
// import org.springframework.amqp.rabbit.core.RabbitTemplate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Service
public class NoteServiceImpl implements NoteService {

    @Autowired
    private NoteMapper noteMapper;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /*
    @Autowired
    private RabbitTemplate rabbitTemplate;
    */

    @Override
    public void addNote(Integer userId) { noteMapper.insert(userId); }

    @Override
    public Note findNote(Integer noteId) {
        String key = "note:" + noteId;
        Note note = (Note) redisTemplate.opsForValue().get(key);

        if (note != null) {
            return note;
        } else {
            note = noteMapper.findByNoteId(noteId);
            if (note != null) { redisTemplate.opsForValue().set(key, note, 1, TimeUnit.HOURS); }
            return note;
        }
    }

    @Transactional
    @Override
    public void deletenote(Integer noteId, Integer userId) {
        Note note = noteMapper.findByNoteId(noteId);
        if (note == null) {
            throw new UnauthorizedException("Not found");
        }
        if (!note.getUserId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this note");
        }

        String cacheKey = "note:" + noteId;
        noteMapper.delete(noteId);
        // rabbitTemplate.convertAndSend("note.delete", cacheKey);
        redisTemplate.delete(cacheKey);
    }

    @Override
    @Transactional
    public void updateNote(Note note) {
        if (noteMapper.update(note)) {
            String cacheKey = "note:" + note.getId();
            // rabbitTemplate.convertAndSend("note.delete", cacheKey);
            redisTemplate.delete(cacheKey);
        }

    }


    @Override
    public List<SimpleNoteDto> showSimpleNotes(Integer userId) {
        List<SimpleNoteDto> notes = noteMapper.searchNotes(userId);
        return notes;
    }
}
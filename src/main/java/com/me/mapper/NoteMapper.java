package com.me.mapper;

import com.me.entity.Note;
import com.me.entity.SimpleNoteDto;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface NoteMapper {
    @Delete("DELETE FROM notes WHERE id = #{id}")
    void delete(Integer id);

    @Delete("DELETE FROM notes WHERE user_id = #{userId}")
    void deleteByUserId(Integer userId);

    //@Options(useGeneratedKeys = true, keyProperty = "id")
    @Insert("INSERT INTO notes (user_id) VALUES (#{userId})")
    void insert(Integer userId);

    //@Update("UPDATE notes SET title = #{title}, content = #{content} WHERE id = #{id}")
    boolean update(Note note);

    @Select("<script>" +
            "SELECT * FROM (" +
            "SELECT id, title, updated_at FROM notes WHERE user_id = #{userId} " +
            "UNION " +
            "SELECT n.id, n.title, n.updated_at FROM notes n JOIN collaborators c ON n.id = c.note_id WHERE c.user_id = #{userId} " +
            ") AS combined_notes ORDER BY updated_at DESC" +
            "</script>")
    List<SimpleNoteDto> searchNotes(Integer userId);


    @Select("SELECT COUNT(*) > 0 FROM notes WHERE id = #{noteId} AND user_id = #{userId}")
    boolean isOwnerOrHasPermission(Integer noteId, Integer userId);

    @Select("SELECT * FROM notes WHERE id = #{noteId}")
    Note findByNoteId(Integer noteId);

}

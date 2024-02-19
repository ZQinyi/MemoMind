package com.me.mapper;

import com.me.Entity.Note;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface NoteMapper {
    @Delete("DELETE FROM notes WHERE id = #{id}")
    public void delete(Integer id);

    @Delete("DELETE FROM notes WHERE user_id = #{userId}")
    void deleteByUserId(Integer userId);

    //@Options(useGeneratedKeys = true, keyProperty = "id")
    @Insert("INSERT INTO notes (user_id) VALUES (#{userId})")
    public void insert(Integer userId);

    // @Update("UPDATE notes SET title = #{title}, content = #{content} WHERE id = #{id}")
    public void update(Note note);

    @Select("SELECT * FROM notes WHERE user_id = #{userId} ORDER BY updated_at desc")
    public List<Note> searchNotes(Integer userId);

}

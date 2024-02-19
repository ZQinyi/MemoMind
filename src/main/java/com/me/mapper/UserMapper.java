package com.me.mapper;

import com.me.entity.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {
    // delete notes
    @Delete("DELETE FROM users WHERE id = #{id}") // precompile
    public void delete(Integer id);

    @Options(useGeneratedKeys = true, keyProperty = "id")
    @Insert("INSERT INTO users (username, password, email) VALUES (#{username}, #{password}, #{email})")
    public void insert(User user);

    @Update("UPDATE users SET username = #{username}, password = #{password}, email = #{email} WHERE id = #{id}")
    public void update(User user);

    @Select("SELECT * FROM users WHERE id = #{id}")
    public User search(Long id);

    @Select("SELECT * FROM users WHERE username = #{username} and password = #{password}")
    public User getUP(User user);
}

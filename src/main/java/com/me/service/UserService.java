package com.me.service;


import com.me.Entity.User;

public interface UserService {
    User login(User user);

    void delete(Integer id);

    void insert(User user);
}

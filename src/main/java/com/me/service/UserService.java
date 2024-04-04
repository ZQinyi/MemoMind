package com.me.service;

import com.me.entity.User;

public interface UserService {
    User login(User user);

    void delete(Integer id);

    void insert(User user);

    User getUser(Integer id);

    User getId(String username);
}

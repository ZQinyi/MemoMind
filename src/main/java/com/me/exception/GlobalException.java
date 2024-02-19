package com.me.exception;

import com.me.entity.Result;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalException {
    public Result ex(Exception ex) {
        ex.printStackTrace();
        return Result.error("Failed, please contact the manager");
    }
}

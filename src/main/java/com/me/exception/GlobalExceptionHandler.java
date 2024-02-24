package com.me.exception;

import com.me.entity.Result;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Result> handleUnauthorizedException(UnauthorizedException ex) {
        // 打印堆栈跟踪，帮助调试
        ex.printStackTrace();

        // 创建并返回一个包含错误信息的Result对象
        Result result = Result.error("Access Denied: " + ex.getMessage());
        return new ResponseEntity<>(result, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Result> handleGeneralException(Exception ex) {
        // 打印堆栈跟踪，帮助调试
        ex.printStackTrace();

        // 创建并返回一个包含错误信息的Result对象
        Result result = Result.error("Failed, please contact the manager");
        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


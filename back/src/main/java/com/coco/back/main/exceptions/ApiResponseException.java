package com.coco.back.main.exceptions;

import javax.ws.rs.core.Response;

public class ApiResponseException extends Exception {

    public Response.Status code;
    public Object data;

    public ApiResponseException() {}

    public ApiResponseException(Response.Status code, Object data) {
        this.code = code;
        this.data = data;
    }

    public ApiResponseException(Integer code, Object data) {
        this.code = Response.Status.fromStatusCode(code);
        this.data = data;
    }

}

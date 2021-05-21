package com.coco.back.main.dtos;

import io.quarkus.runtime.annotations.RegisterForReflection;

import javax.ws.rs.core.Response;

@RegisterForReflection
public class ResponseDTO<T> {
    public Response.Status code;
    public T data;

    public ResponseDTO() {}

    public ResponseDTO(Response.Status status, T data) {
        this.code = status;
        this.data = data;
    }

    public static <U> Response buildResponse(Response.Status status, U data) {
        return Response.status(status).entity(new ResponseDTO<U>(status, data)).build();
    }
}

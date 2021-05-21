package com.coco.back.main.mappers;

import com.coco.back.main.dtos.ResponseDTO;
import com.coco.back.main.exceptions.ApiResponseException;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class ApiResponseExceptionMapper implements ExceptionMapper<ApiResponseException> {
    @Override
    public Response toResponse(ApiResponseException exception) {
        return ResponseDTO.buildResponse(exception.code, exception.data);
    }
}

<?php

use Illuminate\Validation\ValidationException;

function successResponse($data, $message = "Request was successful", $code = 200)
{
    return response()->json([
        'message' => $message,
        'data' => $data
    ], $code);
}


function errorResponse($message = "An error occurred", $code = 500)
{
    return response()->json([
        'message' => $message,
    ], $code);
}



function validationErrorResponse(ValidationException $e)
{
    $errors = $e->errors();
    $message = '';
    foreach ($errors as $field => $messages) {
        foreach ($messages as $msg) {
            $message .= $msg . ",";
        }
    }
    return errorResponse(rtrim($message, ','), 422);
}


function unauthorizedResponse($message = "Unauthorized access")
{
    return response()->json([
        'message' => $message,
    ], 401);
}

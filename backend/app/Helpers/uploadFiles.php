<?php

use Illuminate\Support\Facades\Storage;

function uploadFile($file, $destinationPath)
{
    $filename = time() . '_' . $file->getClientOriginalName();

    Storage::disk('public')->putFileAs($destinationPath, $file, $filename);

    return $destinationPath . '/' . $filename;
}

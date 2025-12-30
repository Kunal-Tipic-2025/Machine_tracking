<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate the file
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // 10 MB max
        ]);

        // 2. Generate a unique filename
        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();
        $filename = time() . '-' . Str::random(10) . '.' . $extension;

        // 3. Store in public/uploads (accessible via /storage/uploads)
        // $path = $file->storeAs('uploads', $filename, 'public');

        // 4. Build public URL
        // $u  // 3. Define upload path (inside public/)
    $uploadPath = public_path(env('UPLOAD_PATH') . 'upload/');
    
    // Ensure directory exists
    if (!file_exists($uploadPath)) {
        mkdir($uploadPath, 0777, true);
    }

    // 4. Move file to public folder
    $file->move($uploadPath, $filename);

    // 5. Build the public URL
    $url = asset(env('UPLOAD_PATH') . 'upload/' . $filename);
    $url1 = str_replace('/public_html/machinetrack', '', $url);

    // 6. Return JSON response
    return response()->json([
        'success'   => true,
        'message'   => 'File uploaded successfully',
        'fileName'  => $filename,
        'fileUrl'   => $url1,
    ]);
    }
}
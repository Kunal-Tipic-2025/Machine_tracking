<?php
namespace App\Helpers;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ImageCompressor
{
    public static function compressAndSave($image, $folder = 'product', $maxSizeKB = 1024)
    {
        try {
            $extension = strtolower($image->getClientOriginalExtension());
            $filename = Str::uuid() . '.' . $extension;

            $publicPath = public_path("bill/{$folder}");
            if (!file_exists($publicPath)) {
                mkdir($publicPath, 0755, true);
            }

            // Create ImageManager with GD driver (Intervention Image v3 syntax)
            $manager = new ImageManager(new Driver());
            
            // Read and process image
            $imageObj = $manager->read($image->getRealPath());

            // Resize if image is too large
            if ($imageObj->width() > 1600) {
                $imageObj->resize(1600, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }

            $quality = 90;
            $savePath = "{$publicPath}/{$filename}";
            
            // Compress image iteratively
            do {
                $imageObj->save($savePath, $quality);
                
                if (!file_exists($savePath)) {
                    throw new \Exception('Failed to save image file');
                }
                
                $sizeKB = filesize($savePath) / 1024;
                $quality -= 10;
            } while ($sizeKB > $maxSizeKB && $quality >= 50);

            return "bill/{$folder}/{$filename}";
            
        } catch (\Exception $e) {
            Log::error('Image compression failed: ' . $e->getMessage());
            throw new \Exception('Failed to process image: ' . $e->getMessage());
        }
    }
}
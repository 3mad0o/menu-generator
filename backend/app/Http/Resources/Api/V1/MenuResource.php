<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'title' => $this->title,
            'store_name' => $this->store_name,
            'store_logo' => $this->store_logo ? asset('storage/' . $this->store_logo) :  null,
            'store_subtitle' => $this->store_subtitle,
            'slug' => $this->slug,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'device_id' => $this->device_id,
            'user_id' => $this->user_id,
            'sections' => MenuSectionResource::collection($this->whenLoaded('Sections')),
            'contacts' => MenuContactResource::collection($this->whenLoaded('Contacts')),
        ];
    }
}

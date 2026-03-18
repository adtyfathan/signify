<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SavePracticeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'result_text' => ['required', 'string', 'max:500'],
            'letter_count' => ['required', 'integer', 'min:0'],
            'duration_sec' => ['required', 'integer', 'min:1'],
            'letters' => ['required', 'array', 'min:0', 'max:100'],
            'letters.*.letter' => ['required', 'string', 'size:1'],
            'letters.*.confidence' => ['required', 'numeric', 'between:0,100'],
            'letters.*.detected_at_sec' => ['required', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'result_text.required' => 'Result text wajib diisi',
            'letter_count.required' => 'Letter count wajib diisi',
            'duration_sec.required' => 'Duration wajib diisi',
        ];
    }
}

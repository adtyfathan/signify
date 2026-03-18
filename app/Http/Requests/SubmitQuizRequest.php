<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitQuizRequest extends FormRequest
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
            'lesson_id' => ['required', 'exists:lessons,id'],
            'quiz_item_id' => ['required', 'exists:quiz_items,id'],
            'score' => ['required', 'numeric', 'between:0,100'],
            'units_correct' => ['required', 'integer', 'min:0'],
            'units_total' => ['required', 'integer', 'min:1'],
            'duration_sec' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:completed,failed,abandoned'],
            'details' => ['required', 'array', 'min:1'],
            'details.*.letter' => ['required', 'string', 'regex:/^[A-Z0-9]$/'],
            'details.*.is_correct' => ['required', 'boolean'],
            'details.*.ai_predicted' => ['required', 'string', 'regex:/^[A-Z0-9?]$/'],
            'details.*.confidence' => ['required', 'numeric', 'between:0,1'],
            'details.*.time_taken_ms' => ['required', 'integer', 'min:0'],
            'details.*.attempts' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'lesson_id.required' => 'Lesson ID wajib diisi',
            'lesson_id.exists' => 'Lesson tidak ditemukan',
            'score.required' => 'Score wajib diisi',
            'units_correct.required' => 'Units correct wajib diisi',
            'units_total.required' => 'Units total wajib diisi',
            'duration_sec.required' => 'Duration wajib diisi',
        ];
    }
}

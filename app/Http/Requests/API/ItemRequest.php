<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // You can add permission checks here
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            
            'item_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0|max:100',
            'qty'       => 'numeric|min:0',
            'batch_number' => 'nullable|string|max:50',
        'expiry_date' => 'nullable|date',
            
            // 'status' => 'nullable|boolean',
        ];
    }

    /**
     * Optional: Custom error messages.
     */
    public function messages(): array
    {
        return [
            
            'item_name.required' => 'Item name is required.',
            'price.required' => 'Price is required.',
            'price.numeric' => 'Price must be a valid number.',
            'tax.numeric' => 'Tax must be a number.',
            'tax.min' => 'Tax cannot be negative.',
            'tax.max' => 'Tax cannot exceed 100%.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    public function failedValidation(Validator $validator)
    {
        throw new ExceptionHandler($validator->errors()->first(), 422);
    }
}

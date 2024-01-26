<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreMappingRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'kode.*' => 'required|string',
            'kfa.*' => 'required|string',

        ];
    }
    public function messages()
    {
        return [
            'kode.*.required' => 'Farmakes IF wajib dipilih',
            'kode.*.string' => 'Farmakes IF wajib berupa teks',
            'kfa.*.required' => 'KFA wajib dipilih',
            'kfa.*.string' => 'KFA wajib berupa teks',

        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(
            [
                'status' => false,
                'messages' => $validator->errors()->all()
            ],
            422
        ));
    }
}

<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:post_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:posts,slug'],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'is_hot' => ['nullable', 'boolean'],
            'status' => ['nullable', 'in:published,draft,hidden'],
        ];
    }

    public function attributes(): array
    {
        return [
            'category_id' => 'danh mục bài viết',
            'title' => 'tiêu đề',
            'slug' => 'đường dẫn tĩnh (slug)',
            'thumbnail' => 'ảnh đại diện bài viết',
            'summary' => 'tóm tắt',
            'content' => 'nội dung bài viết',
            'is_hot' => 'bài viết nổi bật',
            'status' => 'trạng thái',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Vui lòng chọn :attribute.',
            'category_id.exists' => ':Attribute không tồn tại.',
            'title.required' => 'Vui lòng nhập :attribute.',
            'title.max' => ':Attribute không được vượt quá :max ký tự.',
            'slug.unique' => ':Attribute đã tồn tại.',
            'content.required' => 'Vui lòng nhập :attribute.',
            'status.in' => ':Attribute không hợp lệ.',
        ];
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\Contact\StoreContactRequest;
use App\Http\Requests\Contact\UpdateContactRequest;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['status'] = 'pending';

        $contact = Contact::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Gửi yêu cầu liên hệ thành công! StyleRent sẽ phản hồi sớm nhất.',
            'data' => new ContactResource($contact),
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Contact::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $contacts = $query->latest()->paginate($request->integer('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => ContactResource::collection($contacts)->response()->getData(true),
        ]);
    }

    public function show($id): JsonResponse
    {
        $contact = Contact::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => new ContactResource($contact),
        ]);
    }

    public function update(UpdateContactRequest $request, $id): JsonResponse
    {
        $contact = Contact::findOrFail($id);
        $contact->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật trạng thái yêu cầu thành công',
            'data' => new ContactResource($contact),
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã chuyển yêu cầu hỗ trợ vào thùng rác',
        ]);
    }

    public function trash(): JsonResponse
    {
        $contacts = Contact::onlyTrashed()->latest('deleted_at')->get();

        return response()->json([
            'status' => 'success',
            'data' => ContactResource::collection($contacts),
        ]);
    }

    public function restore($id): JsonResponse
    {
        $contact = Contact::onlyTrashed()->findOrFail($id);
        $contact->restore();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã khôi phục yêu cầu hỗ trợ thành công',
        ]);
    }

    public function forceDelete($id): JsonResponse
    {
        $contact = Contact::onlyTrashed()->findOrFail($id);
        $contact->forceDelete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xóa vĩnh viễn yêu cầu hỗ trợ',
        ]);
    }
}

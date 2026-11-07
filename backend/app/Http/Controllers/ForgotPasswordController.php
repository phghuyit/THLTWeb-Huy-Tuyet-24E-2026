<?php

namespace App\Http\Controllers;

use App\Mail\ResetPasswordOtpMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends Controller
{
    public function sendResetCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'Vui lòng nhập địa chỉ email.',
            'email.email' => 'Địa chỉ email không đúng định dạng.',
            'email.exists' => 'Không tìm thấy tài khoản nào khớp với email này.',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->status === 'locked') {
            return response()->json([
                'message' => 'Tài khoản của bạn hiện đang bị khóa. Vui lòng liên hệ quản trị viên.',
            ], 403);
        }

        $code = (string) random_int(100000, 999999);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => $code,
                'created_at' => now(),
            ]
        );

        try {
            Mail::to($user->email)->send(new ResetPasswordOtpMail($code, $user->fullname ?? ''));
        } catch (\Throwable $e) {
            Log::error('SMTP Mail send failed: ' . $e->getMessage());

            if (config('app.debug')) {
                return response()->json([
                    'success' => true,
                    'message' => 'Lỗi kết nối máy chủ gửi thư Google SMTP (vui lòng kiểm tra lại MAIL_USERNAME và MAIL_PASSWORD trong .env). ' .
                                 'Chế độ thử nghiệm: mã OTP là: ' . $code,
                    'debug_code' => $code,
                ]);
            }

            return response()->json([
                'message' => 'Không thể gửi email xác thực lúc này. Vui lòng kiểm tra lại cấu hình hệ thống hoặc thử lại sau.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Mã xác thực 6 chữ số đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư (kể cả mục Thư rác/Spam).',
        ]);
    }

    public function verifyCodeAndResetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6',
        ], [
            'email.required' => 'Vui lòng cung cấp email.',
            'email.email' => 'Email không đúng định dạng.',
            'email.exists' => 'Email không tồn tại trong hệ thống.',
            'code.required' => 'Vui lòng nhập mã xác thực 6 số.',
            'code.size' => 'Mã xác thực phải gồm chính xác 6 chữ số.',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Yêu cầu không hợp lệ hoặc bạn chưa yêu cầu cấp mã xác thực.',
            ], 422);
        }

        $createdAt = Carbon::parse($record->created_at);
        if ($createdAt->addMinutes(10)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'Mã xác thực đã hết hạn (chỉ có hiệu lực trong 10 phút). Vui lòng yêu cầu gửi lại mã mới.',
            ], 422);
        }

        if (trim((string) $record->token) !== trim((string) $request->code)) {
            return response()->json([
                'message' => 'Mã xác thực không chính xác. Vui lòng kiểm tra lại.',
            ], 422);
        }

        $newPassword = $this->generateStrongPassword(8);

        $user = User::where('email', $request->email)->first();
        $user->password = $newPassword;
        $user->save();

        $user->tokens()->delete();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mật khẩu đã được đặt lại thành công! Bạn hãy sao chép mật khẩu mới bên dưới để đăng nhập.',
            'new_password' => $newPassword,
        ]);
    }

    private function generateStrongPassword(int $length = 8): string
    {
        $uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        $lowercase = 'abcdefghijkmnpqrstuvwxyz';
        $numbers   = '23456789';
        $specials  = '@#$%&*!';

        $password = [
            $uppercase[random_int(0, strlen($uppercase) - 1)],
            $lowercase[random_int(0, strlen($lowercase) - 1)],
            $numbers[random_int(0, strlen($numbers) - 1)],
            $specials[random_int(0, strlen($specials) - 1)],
        ];

        $pool = $uppercase . $lowercase . $numbers . $specials;
        $poolLength = strlen($pool);
        for ($i = count($password); $i < $length; $i++) {
            $password[] = $pool[random_int(0, $poolLength - 1)];
        }

        shuffle($password);

        return implode('', $password);
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ResetPasswordController extends Controller
{

    public function showResetPassword($token)
    {
        return Inertia::render('auth/ResetPassword', ['token' => $token]);
    }


    public function resetPassword(Request $request)
    {
        $request->validate([
            // 'email' => 'required|email|exists:users',
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required'
        ]);

        $updatePassword = DB::table('password_reset_tokens')
            ->where([
                'token' => $request->token
            ])
            ->first();

        if (!$updatePassword) {
            return back()->withInput()->with('error', 'Invalid token!');
        }

        if (\Carbon\Carbon::parse($updatePassword->created_at)->lt(now()->subMinutes(30))) {
            return back()->withInput()->with('error', 'Token expired!');
        }

        if ($updatePassword->is_admin) {
            Admin::where('email', $updatePassword->email)
                ->update(['password' => Hash::make($request->password)]);
        } else {
            User::where('registration_number', $updatePassword->email)
                ->update(['password' => Hash::make($request->password)]);
        }

        DB::table('password_reset_tokens')->where(['token' => $request->token])->delete();

        return redirect('/login')->with('success', 'Your password has been changed!');
    }
}

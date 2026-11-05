<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ForgotPasswordMail;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use DB;
use Carbon\Carbon;
use Mail;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{

    public function showForgotPassword()
    {
        if (Auth::check()) {
            return redirect('/alumni/home');
        } elseif (Auth::guard('admin')->check()) {
            return redirect('/admin/dashboard');
        }

        return Inertia::render('auth/ForgotPassword');
    }

    public function sendResetToken(Request $request)
    {
        $request->validate([
            'registration_number' => 'required',
        ]);

        $admin = Admin::where('email', $request->registration_number)->first();
        $user = User::where('registration_number', $request->registration_number)->first();
        $that = $admin && !$user ? "e-mail address" : "registration number";
        if (!$admin && !$user) {
            return back()->withErrors([
                'email' => "We can't find a user with that $that.",
            ])->onlyInput('email');
        }

        if ($user && !$user->email) {
            return back()->withErrors([
                'email' => "No email provided for this user yet, please contact admin.",
            ])->onlyInput('email');
        }

        $token = Str::random(64);
        DB::table('password_reset_tokens')
            ->updateOrInsert(
                ['email' => $request->registration_number],
                [
                    'token' => $token,
                    'is_admin' => $admin ? 1 : 0,
                    'created_at' => Carbon::now()
                ]
            );

        Mail::to($user ? $user->email : $request->registration_number)
            ->send(new ForgotPasswordMail($token));

        return back()->with('success', 'We have e-mailed your password reset link!');
    }
}

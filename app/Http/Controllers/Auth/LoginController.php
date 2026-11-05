<?php

namespace App\Http\Controllers\Auth;

use App\Constants\UserRoles;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function show()
    {
        if (Auth::check()) {
            $role_id = Auth::user()->role;
            $role_name = UserRoles::ROLES_ALPHA[$role_id];
            return redirect("/$role_name/dashboard");
        }

        return Inertia::render('auth/Login');
    }

    /**
     * Handle an authentication attempt.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()->route('admin.home');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function change_password(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|min:6',
        ]);

        if (!password_verify($request->old_password, $user->password)) {
            return back()->withErrors(['old_password' => 'Current password is incorrect.']);
        }

        $user->password = bcrypt($request->new_password);
        $user->save();

        return redirect()->back()->with('success', 'Password changed successfully.');
    }

    public function logout()
    {
        Auth::logout();

        return redirect()->route('home');
    }
}
<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AssistantSupervisorController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DocumentLayoutController;
use App\Http\Controllers\ManageDepartmentController;
use App\Http\Controllers\RegistrarController;
use App\Http\Controllers\StudentPortalController;
use App\Http\Controllers\SupervisorController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [LoginController::class, "show"])->name('home');

Route::get('/login', [LoginController::class, "show"])->name('login');
Route::post('/login', [LoginController::class, "authenticate"]);

Route::post('/logout', [LoginController::class, "logout"])->name('logout');

Route::get('/student-portal', [StudentPortalController::class, "show"])->name('student-portal');
Route::post('/student-portal', [StudentPortalController::class, "store"]);


// all auth routes
Route::middleware(['auth'])->group(function () {
    // admin routes
    Route::name('admin.')->middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('home');

        // manage users (registrars, supervisors, assistant supervisors)
        Route::get('/users', [AdminController::class, 'show_users'])->name('users_home');
        Route::post('/users', [AdminController::class, 'create_user']);
        Route::patch('/users/{uid}', [AdminController::class, 'update_user']);
        Route::delete('/users/{uid}', [AdminController::class, 'destroy_user']);

        // documents
        Route::get('/documents', [AdminController::class, 'show_documents'])->name('documents_home');
        Route::get('/documents/preview/{id}', [AdminController::class, 'show_document_preview']);

        // faculties & dpts
        Route::get('/faculties-and-departments', [ManageDepartmentController::class, 'showManageDpts'])->name('manage-dpts');
        Route::post('/manage-dpts', [ManageDepartmentController::class, 'storeDpt']);
        Route::patch('/manage-dpts', [ManageDepartmentController::class, 'patchDpt']);
        Route::post('/manage-faculties', [ManageDepartmentController::class, 'storeFaculty']);
        Route::patch('/manage-faculties', [ManageDepartmentController::class, 'patchFaculty']);

        // document layout
        Route::get('/document-layout', [DocumentLayoutController::class, 'showDocumentLayout'])->name('document-layout');
        Route::post('/document-layout', [DocumentLayoutController::class, 'storeDocumentLayoutProfile']);
        Route::patch('/document-layout-profiles/{layoutSettingProfile}', [DocumentLayoutController::class, 'updateLayoutSettingProfile']);
        Route::delete('/document-layout-profiles/{layoutSettingProfile}', [DocumentLayoutController::class, 'destroyLayoutSettingProfile']);
        Route::get('/document-layout/{layoutSettingProfile}', [DocumentLayoutController::class, 'showDocumentLayoutProfile'])->name('document-layout.profile');
        Route::patch('/document-layout/{layoutSettingProfile}', [DocumentLayoutController::class, 'updateDocumentLayout']);

        // profile
        Route::get('/settings', [AdminController::class, 'show_settings'])->name('settings_home');
        Route::post('/settings/change-password', [LoginController::class, 'change_password']);
    });

    // registrar routes
    Route::name('registrar.')->middleware(['registrar'])->prefix('registrar')->group(function () {
        Route::get('/dashboard', [RegistrarController::class, 'dashboard'])->name('home');

        // documents
        Route::get('/documents', [RegistrarController::class, 'show_documents'])->name('documents_home');
        Route::get('/documents/preview/{id}', [RegistrarController::class, 'show_document_preview']);
        Route::post('/documents/approve-refuse/{id}', [RegistrarController::class, 'approve_refuse_document']);

        // faculties & dpts
        Route::get('/faculties-and-departments', [ManageDepartmentController::class, 'showManageDpts'])->name('manage-dpts');
        Route::post('/manage-dpts', [ManageDepartmentController::class, 'storeDpt']);
        Route::patch('/manage-dpts', [ManageDepartmentController::class, 'patchDpt']);
        Route::post('/manage-faculties', [ManageDepartmentController::class, 'storeFaculty']);
        Route::patch('/manage-faculties', [ManageDepartmentController::class, 'patchFaculty']);

        // profile
        Route::get('/settings', [RegistrarController::class, 'show_settings'])->name('settings_home');
        Route::post('/settings/change-password', [LoginController::class, 'change_password']);
    });

    // supervisor routes
    Route::name('supervisor.')->middleware(['supervisor'])->prefix('supervisor')->group(function () {
        Route::get('/dashboard', [SupervisorController::class, 'dashboard'])->name('home');

        // documents
        Route::get('/documents', [SupervisorController::class, 'show_documents'])->name('documents_home');
        Route::get('/documents/issue-document', [SupervisorController::class, 'show_issue_document']);
        Route::post('/documents/issue-document', [SupervisorController::class, 'issue_document']);
        Route::get('/documents/preview/{id}', [SupervisorController::class, 'show_document_preview']);
        Route::get('/documents/update/{id}', [SupervisorController::class, 'show_update_document']);
        Route::patch('/documents/update/{id}', [SupervisorController::class, 'update_document']);

        // student submissions
        Route::get('/student-submissions', [SupervisorController::class, 'show_student_submissions'])->name('student_submissions_home');
        Route::patch('/student-submissions/{id}/approve', [SupervisorController::class, 'approve_student_submission']);
        Route::delete('/student-submissions/{id}', [SupervisorController::class, 'destroy_student_submission']);

        // document layout
        Route::get('/document-layout', [DocumentLayoutController::class, 'showDocumentLayout'])->name('document-layout');
        Route::post('/document-layout', [DocumentLayoutController::class, 'storeDocumentLayoutProfile']);
        Route::patch('/document-layout-profiles/{layoutSettingProfile}', [DocumentLayoutController::class, 'updateLayoutSettingProfile']);
        Route::delete('/document-layout-profiles/{layoutSettingProfile}', [DocumentLayoutController::class, 'destroyLayoutSettingProfile']);
        Route::get('/document-layout/{layoutSettingProfile}', [DocumentLayoutController::class, 'showDocumentLayoutProfile'])->name('document-layout.profile');
        Route::patch('/document-layout/{layoutSettingProfile}', [DocumentLayoutController::class, 'updateDocumentLayout']);

        // profile
        Route::get('/settings', [SupervisorController::class, 'show_settings'])->name('settings_home');
        Route::post('/settings/change-password', [LoginController::class, 'change_password']);
    });

    // assistant supervisor routes
    Route::name('assistant-supervisor.')->middleware(['assistant-supervisor'])->prefix('assistant-supervisor')->group(function () {
        Route::get('/dashboard', [AssistantSupervisorController::class, 'show'])->name('home');

        // student submissions
        Route::patch('/student-submissions/{id}/approve', [AssistantSupervisorController::class, 'approve_student_submission']);
        Route::patch('/student-submissions/{id}', [AssistantSupervisorController::class, 'update_student_submission']);
        Route::delete('/student-submissions/{id}', [AssistantSupervisorController::class, 'destroy_student_submission']);

        // profile
        Route::get('/settings', [AssistantSupervisorController::class, 'show_settings'])->name('settings_home');
        Route::post('/settings/change-password', [LoginController::class, 'change_password']);
    });
});


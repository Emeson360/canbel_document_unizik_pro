<?php

namespace App\Http\Controllers;

use App\Constants\DocumentStatuses;
use App\Constants\DocumentTypes;
use App\Constants\UserRoles;
use App\Models\Department;
use App\Models\Document;
use App\Models\DocumentParamsPositionSetting;
use App\Models\LayoutSettingProfile;
use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Validator;

class AdminController extends Controller
{

    private $role_name;

    public function __construct()
    {
        $role = UserRoles::ROLES_ALPHA[UserRoles::Admin];
        $this->role_name = $role;
    }

    private const MANAGEABLE_ROLES = [
        UserRoles::Registrar,
        UserRoles::Supervisor,
        UserRoles::AssistantSupervisor,
    ];

    public function dashboard()
    {
        $teamCount = User::whereIn('role', self::MANAGEABLE_ROLES)->count();
        $approvedCount = Document::where('status', DocumentStatuses::APPROVED)->count();

        $userRoleStats = User::whereIn('role', self::MANAGEABLE_ROLES)
            ->select('role', DB::raw('COUNT(*) as total'))
            ->groupBy('role')
            ->get()
            ->map(fn ($row) => [
                'role' => UserRoles::ROLES_ALPHA[$row->role],
                'total' => $row->total,
            ]);

        return Inertia::render('dashboard/admin/Dashboard', [
            "dashStats" => [
                "teamCount" => $teamCount,
                "approvedCount" => $approvedCount,
            ],
            "userRoleStats" => $userRoleStats,
        ]);
    }

    public function show_documents(Request $request)
    {
        // filters
        $query = $request->query('query');
        $status = $request->query('status');
        $type = $request->query('type');
        $department = $request->query('department');
        $page = $request->query('pg', 1);
        $limit = $request->query('limit', 20);

        $dpts = Department::get();
        $baseQuery = Document::with(["department", "issuer", "approver"]);

        if ($query) {
            $baseQuery->where(function ($q) use ($query) {
                $q->where('holders_name', 'like', '%' . $query . '%')
                    ->orWhere('registration_number', 'like', '%' . $query . '%');
            });
        }

        if ($status) {
            $baseQuery->where("status", $status);
        }

        if ($type) {
            $baseQuery->where("type", $type);
        }

        if ($department) {
            $baseQuery->where("department_id", $department);
        }

        $documents = $baseQuery->paginate($limit, ['*'], 'pg', $page);

        // dd($documents);
        $docStatuses = DocumentStatuses::STATUSES_ALPHA;
        $docTypes = DocumentTypes::Types;
        // dd($vv);
        return Inertia::render("dashboard/$this->role_name/Documents", [
            "allDocuments" => $documents,
            "documentStatuses" => $docStatuses,
            "documentTypes" => $docTypes,
            "departments" => $dpts,
            "filters" => [
                "query" => $query,
                "status" => $status,
                "type" => $type,
                "department" => $department,
            ]
        ]);
    }

    public function show_document_preview($id)
    {
        $document = Document::with(["department", "approver", "faculty"])->where('id', $id)->first();
        $docStatuses = DocumentStatuses::STATUSES_ALPHA;

        if ($document && $document->passport_photo) {
            $document->passport_photo_url = asset('storage/uploaded_student_passport/' . $document->passport_photo);
        }

        $positionSettings = $document
            ? DocumentParamsPositionSetting::where('document_type', $document->type)->get()
            : collect();

        // dd($document);
        return Inertia::render("dashboard/$this->role_name/PreviewDocument", [
            "document" => $document,
            "documentStatuses" => $docStatuses,
            "positionSettings" => $positionSettings,
            "layoutSettingProfiles" => LayoutSettingProfile::all(),
        ]);
    }

    public function show_users(Request $request)
    {
        // filters
        $query = $request->query('query');
        $role = $request->query('role');
        $page = $request->query('pg', 1);
        $limit = $request->query('limit', 20);

        $baseQuery = User::whereIn('role', self::MANAGEABLE_ROLES);

        if ($query) {
            $baseQuery->where('name', 'like', '%' . $query . '%');
        }

        if ($role) {
            $roleId = array_search($role, UserRoles::ROLES_ALPHA);
            if ($roleId !== false && in_array($roleId, self::MANAGEABLE_ROLES)) {
                $baseQuery->where('role', $roleId);
            }
        }

        $users = $baseQuery->paginate($limit, ['*'], 'pg', $page);

        $users->getCollection()->transform(function ($user) {
            $user->role = UserRoles::ROLES_ALPHA[$user->role] ?? $user->role;
            return $user;
        });

        return Inertia::render('dashboard/admin/Users', [
            'allUsers' => $users,
            'query' => $query,
            'role' => $role,
        ]);
    }

    public function create_user(Request $request)
    {

        $name = trim(strtolower($request->name));
        $email = $request->email;
        $role = $request->role;

        $vData = [
            'name' => 'required|max:60',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|in:' . implode(',', array_map(fn($r) => UserRoles::ROLES_ALPHA[$r], self::MANAGEABLE_ROLES)),
            'photo' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ];

        $validator = Validator::make($request->all(), $vData);

        if (!$validator->passes()) {
            return back()->withErrors($validator->errors()->all());
        }

        $file_name = null;
        if (!empty($_FILES) && $_FILES['photo']['size']) {
            $ext = explode('.', $_FILES['photo']['name']);
            $ext = array_pop($ext);

            $file_name = hash('sha256', $_FILES['photo']['name']);
            $file_name = $file_name . '.' . $ext;

            //Save to local
            $path = "public\uploaded_img\\";
            $request->file('photo')->storeAs($path, $file_name);
        }

        User::create([
            'name' => strtolower($name),
            'email' => $email,
            'role' => array_search($role, UserRoles::ROLES_ALPHA),
            'password' => Hash::make('password'),
            'coverUrl' => $file_name
        ]);

        // Define an array of success messages
        $successMessages = [
            'New user added!',
            'User added!',
            'Success!',
        ];

        // Get the last used message index from session (default to -1 if not set)
        $lastIndex = session('last_success_message_index', -1);

        // Calculate the next index, ensuring it's different from the last one
        $availableIndices = array_diff(range(0, count($successMessages) - 1), [$lastIndex]);
        $nextIndex = $availableIndices[array_rand($availableIndices)];

        // Store the current index for next time
        session(['last_success_message_index' => $nextIndex]);

        return redirect()->route('admin.users_home')->with('success', $successMessages[$nextIndex]);

    }

    public function update_user(Request $request, $uid)
    {

        $name = trim(strtolower($request->name));
        $email = $request->email;
        $role = $request->role;

        $getSup = User::where('id', $uid)->select('id', 'email', 'coverUrl')->first();

        $uniqueEmailValidation = '';
        if (strtolower($getSup->email) != strtolower($request->email)) {
            $uniqueEmailValidation = '|unique:users';
        }

        $vData = [
            'name' => 'required|max:60',
            'email' => 'required|string|email|max:255' . $uniqueEmailValidation,
            'role' => 'required|in:' . implode(',', array_map(fn($r) => UserRoles::ROLES_ALPHA[$r], self::MANAGEABLE_ROLES)),
            'photo' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ];

        $validator = Validator::make($request->all(), $vData);

        if (!$validator->passes()) {
            return back()->withErrors($validator->errors()->all());
        }

        $file_name = null;
        if (!empty($_FILES) && $_FILES['photo']['size']) {
            $ext = explode('.', $_FILES['photo']['name']);
            $ext = array_pop($ext);

            $file_name = hash('sha256', $_FILES['photo']['name']);
            $file_name = $file_name . '.' . $ext;

            //Save to local
            $path = "public\uploaded_img\\";
            $request->file('photo')->storeAs($path, $file_name);
        }

        User::where('id', $uid)->update($file_name ? [
            'name' => strtolower($name),
            'email' => $email,
            'role' => array_search($role, UserRoles::ROLES_ALPHA),
            'coverUrl' => $file_name
        ] : [
            'name' => strtolower($name),
            'email' => $email,
            'role' => array_search($role, UserRoles::ROLES_ALPHA),
        ]);


        // Define an array of success messages
        $successMessages = [
            'User updated!',
            'Success!',
            'Data updated.',
            'Update complete!'
        ];

        // Get the last used message index from session (default to -1 if not set)
        $lastIndex = session('last_success_message_index', -1);

        // Calculate the next index, ensuring it's different from the last one
        $availableIndices = array_diff(range(0, count($successMessages) - 1), [$lastIndex]);
        $nextIndex = $availableIndices[array_rand($availableIndices)];

        // Store the current index for next time
        session(['last_success_message_index' => $nextIndex]);

        return redirect()->back()->with('success', $successMessages[$nextIndex]);

    }

    public function destroy_user($uid)
    {
        $getSup = User::where('id', $uid)->select('id', 'coverUrl')->first();

        if (!$getSup) {
            return redirect()->back()->with('error', 'User not found.');
        }

        // delete the file if it exists
        if ($getSup->coverUrl) {
            $filePath = 'public/uploaded_img/' . $getSup->coverUrl;
            if (Storage::exists($filePath)) {
                Storage::delete($filePath);
            }
        }
        $getSup->delete();

        return redirect()->back()->with('success', 'User deleted!');
    }

    public function show_settings()
    {
        return Inertia::render('dashboard/admin/Settings');
    }


}

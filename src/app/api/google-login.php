<?php
session_start();

$client_id = "YOUR_GOOGLE_CLIENT_ID";
$client_secret = "YOUR_GOOGLE_CLIENT_SECRET";
$redirect_uri = "http://localhost:8000/google-callback.php"; // where Google will send the code

if (!isset($_GET['code'])) {
    // Step 1: Redirect to Google OAuth
    $auth_url = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=$client_id&redirect_uri=$redirect_uri&scope=email%20profile";
    header("Location: $auth_url");
    exit();
} else {
    // Step 2: Exchange code for access token (Google will redirect here with ?code=...)
    $code = $_GET['code'];

    $token_url = "https://oauth2.googleapis.com/token";
    $data = [
        'code' => $code,
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'redirect_uri' => $redirect_uri,
        'grant_type' => 'authorization_code'
    ];

    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
        ],
    ];

    $context  = stream_context_create($options);
    $result = file_get_contents($token_url, false, $context);
    $response = json_decode($result, true);

    $access_token = $response['access_token'];

    // Step 3: Get user info
    $user_info = file_get_contents("https://www.googleapis.com/oauth2/v1/userinfo?access_token=$access_token");
    $user_info = json_decode($user_info, true);

    // Step 4: Save user in database or start session
    $_SESSION['user'] = $user_info;
    header("Location: /dashboard.php"); // redirect after login
    exit();
}

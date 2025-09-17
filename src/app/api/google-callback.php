<?php
require 'vendor/autoload.php';

$client = new Google_Client();
$client->setClientId("YOUR_GOOGLE_CLIENT_ID");
$client->setClientSecret("YOUR_GOOGLE_CLIENT_SECRET");
$client->setRedirectUri("http://localhost/anubispaws/api/google-callback.php");

if (isset($_GET['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    $client->setAccessToken($token);

    $oauth2 = new Google_Service_Oauth2($client);
    $userInfo = $oauth2->userinfo->get();

    // Example: insert into MySQL
    $conn = new mysqli("localhost", "root", "", "anubispaws");
    $email = $userInfo->email;
    $nickname = $userInfo->name;

    $check = $conn->prepare("SELECT * FROM users WHERE email=?");
    $check->bind_param("s", $email);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows === 0) {
        $stmt = $conn->prepare("INSERT INTO users (nickname, email, password) VALUES (?, ?, ?)");
        $fakePass = password_hash(bin2hex(random_bytes(8)), PASSWORD_BCRYPT); // dummy password
        $stmt->bind_param("sss", $nickname, $email, $fakePass);
        $stmt->execute();
    }

    echo "Google login successful! Welcome, " . $nickname;
}

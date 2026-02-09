export function resetPasswordEmail(link: string, name: string) {
  return `
    <div style="font-family: sans-serif">
      <h2>Reset your password</h2>
      <p>Hi ${name},</p>
      <p>You requested a password reset.</p>
      <a href="${link}" style="padding:10px 15px;background:#7c3aed;color:white;border-radius:6px;text-decoration:none">
        Reset Password
      </a>
      <p>This link expires in 10 minutes.</p>
      <p>If you didn’t request this, ignore this email.</p>
    </div>
  `;
}

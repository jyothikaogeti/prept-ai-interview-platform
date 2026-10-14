export function isAdminEmailAddress(email) {
  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";

  return Boolean(
    configuredAdminEmail &&
    normalizedEmail &&
    normalizedEmail === configuredAdminEmail,
  );
}

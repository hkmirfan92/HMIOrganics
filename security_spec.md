# Security Specification: HMI Organics Firestore Rules

## 1. Data Invariants
- Products and categories are publicly readable by customers across the storefront.
- Store modifications (adding products, updating prices/images, editing settings, pages, or SEO) are strictly restricted to authenticated and email-verified store administrators.
- The bootstrapped administrator email is `hkirfan92@gmail.com`.
- Path identifiers must adhere to valid ID formats (`^[a-zA-Z0-9_\-]+$`) with a maximum length of 128 characters.

## 2. The Dirty Dozen Payloads (Rejection Matrix)
1. Anonymous write to `/products/test`: Rejected (Unauthorized).
2. Unverified email write: Rejected (Requires `email_verified == true`).
3. Non-admin write to `/products/tooth-powder`: Rejected (Permission denied).
4. Unauthenticated update to `/settings/brand`: Rejected (Permission denied).
5. Non-admin delete of `/categories/personal-care`: Rejected (Permission denied).
6. Non-admin read of `/admins/subadmin-1`: Rejected (Private collection).
7. Invalid path ID injection with special symbols: Rejected (`isValidId` check fails).
8. Product creation with missing required fields: Rejected.
9. Attempted write to arbitrary undefined path `/system/secrets`: Rejected by default-deny catch-all.
10. Unauthenticated modification of `/pages/content`: Rejected.
11. Unauthenticated modification of `/seo/config`: Rejected.
12. Attempt to grant admin role to oneself without super-admin authentication: Rejected.

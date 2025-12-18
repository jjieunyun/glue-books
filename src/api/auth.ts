
export function login({ payload }: { payload: { token: string, email: string } }) {
    return fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}
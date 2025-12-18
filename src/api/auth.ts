
export function login({ payload }: { payload: { token: string, email: string } }) {
    return fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}

export function logout() {
    return fetch('/api/auth/signout', {
        method: 'POST',
    });
}

export function getUserInfo() {
    return fetch('/api/auth/userInfo', {
        method: 'GET',
    });
}

interface ApiResponse {
    data: any;
}

export default async function apiClientHandler(
    fn: Promise<ApiResponse> | Promise<Response>,
): Promise<any> {
    try {
        const res = await fn;

        if (res instanceof Response) {
            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                const error: any = new Error('HTTP Error');
                error.response = {
                    status: res.status,
                    data: errorBody,
                    message: errorBody.message,
                };
                throw error;
            }
            return await res.json();
        }

        return res.data;
    } catch (error: any) {
        // Sentry.captureException(error);
        const errorMessage =
            error?.response?.data?.message ||
            error?.response?.message ||
            '오류가 발생했습니다.';
        if (error.response) {
            if (error.response.status === 401) {
                alert('토큰이 존재하지 않습니다.');
                location.href = '/login';
                return;
            } else {
                alert(errorMessage);
                return { result: false, message: errorMessage };
            }
        } else {
            alert(`Error: ${errorMessage}`);
            return { result: false, message: errorMessage };
        }
    }
}

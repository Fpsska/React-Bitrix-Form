export async function fetchUserIP(): Promise<any> {
    try {
        const URL = 'https://api.ipify.org?format=json';

        const response = await fetch(URL);

        if (!response.ok) {
            return new Error('some error with response!');
        }

        const data = await response.json();

        return data;
    } catch (err: any) {
        console.error(err.message);
    }
}

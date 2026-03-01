const forgotPassword = import.meta.env.VITE_API_RECUPERAR_PASSWORD;

export const recuperarPassword = async (email) => {
    try {
        const response = await fetch(forgotPassword, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return { error: error.message };
    }
}
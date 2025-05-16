export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    // Dividir el token en sus partes
    const [header, payload, signature] = token.split('.');

    if (!payload) throw new Error('Invalid JWT format');

    // Decodificar la parte del payload
    const decodedPayload = JSON.parse(
      atob(
        payload.replace(/-/g, '+').replace(/_/g, '/')
        .padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=')
      )
    );

    return {
      header: JSON.parse(atob(header)),
      payload: decodedPayload,
      signature
    };

  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};
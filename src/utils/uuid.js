// src/utils/uuid.js

/**
 * Gera um UUID v4. Usa a API nativa crypto.randomUUID se disponível,
 * caso contrário, usa um fallback para garantir a compatibilidade.
 */
export function generateUUID() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para navegadores mais antigos
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
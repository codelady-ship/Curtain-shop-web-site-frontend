export const fileToDataUrl = (file?: File | null): Promise<string> => {
  if (!file) return Promise.resolve("");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Fayl oxunmadı"));
    reader.readAsDataURL(file);
  });
};

export const textOrEmpty = (value: any) => String(value ?? "").trim();

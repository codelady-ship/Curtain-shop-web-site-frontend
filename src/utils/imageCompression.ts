import imageCompression from "browser-image-compression";

export const MAX_UPLOAD_IMAGE_BYTES = 5 * 1024 * 1024;

const replaceExtension = (name: string) => {
  const safeName = name?.trim() || "image";
  return safeName.replace(/\.[^.]+$/, "") + ".webp";
};

const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Şəkil oxunmadı"));
    reader.readAsDataURL(file);
  });

export const optimizeImageFile = async (
  file: File,
  options: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    initialQuality?: number;
  } = {},
): Promise<File> => {
  if (!file) {
    throw new Error("Şəkil seçilməyib.");
  }

  if (!file.type?.startsWith("image/")) {
    throw new Error("Yalnız şəkil faylı yükləmək olar.");
  }

  if (file.size > MAX_UPLOAD_IMAGE_BYTES) {
    throw new Error("Şəkil maksimum 5MB ola bilər.");
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: options.maxSizeMB ?? 0.45,
    maxWidthOrHeight: options.maxWidthOrHeight ?? 800,
    initialQuality: options.initialQuality ?? 0.82,
    fileType: "image/webp",
    useWebWorker: true,
    alwaysKeepResolution: false,
  });

  return new File([compressed], replaceExtension(file.name), {
    type: "image/webp",
    lastModified: Date.now(),
  });
};

export const optimizeImageToDataUrl = async (
  file: File,
  options?: Parameters<typeof optimizeImageFile>[1],
): Promise<string> => {
  const optimized = await optimizeImageFile(file, options);
  return readAsDataUrl(optimized);
};

export const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

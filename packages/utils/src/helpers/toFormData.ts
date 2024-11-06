export const toFormData = (
  payload: Record<string, string | Blob>,
): FormData => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return formData;
};

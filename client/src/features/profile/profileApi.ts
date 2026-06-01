import { API_URL, getAccessToken } from "../../api/apiClient";

export async function uploadAvatarRequest(file: File): Promise<{
  avatarUrl: string;
}> {
  const token = getAccessToken();

  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch(`${API_URL}/uploads/avatar`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    let message = "Не удалось загрузить аватар";

    try {
      const data = await response.json();
      message = data.message ?? message;
    } catch {
      message = response.statusText;
    }

    throw new Error(message);
  }

  return response.json();
}
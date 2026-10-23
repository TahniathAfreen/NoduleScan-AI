/**
 * NoduleScan AI - API Service
 * Handles communication with the FastAPI backend.
 */

const API_BASE_URL = ''; // Relative path leverages Vite dev proxy /api or same-origin in production

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        healthy: false,
        error: errorData?.detail || `Server returned HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      healthy: true,
      data,
    };
  } catch (err) {
    return {
      healthy: false,
      error: err.message || 'Cannot connect to backend server at http://127.0.0.1:8000',
    };
  }
}

export async function detectNodules(file, confidenceThreshold = 0.25) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('confidence_threshold', confidenceThreshold.toString());

  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      let errorMessage = 'An error occurred during inference.';
      if (data?.detail) {
        if (typeof data.detail === 'object' && data.detail.message) {
          errorMessage = data.detail.message;
        } else if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        }
      }
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

interface SubmitEmailResponse {
  success: boolean;
}

interface ErrorResponse {
  error: string;
}

export const submitEmail = async (
  cart_id: string,
  email: string
): Promise<SubmitEmailResponse | null> => {
  try {
    const response = await fetch("/api/checkout/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart_id, email }),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorResult = result as ErrorResponse;
      console.error("Email API error:", errorResult.error || "Unknown error");
      return null;
    }

    return result as SubmitEmailResponse;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to submit email:", error.message);
    } else {
      console.error("Unknown error occurred during submitEmail.");
    }
    return null;
  }
};

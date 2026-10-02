export async function runLangflow(message, sessionId) {
  const url = process.env.LANGFLOW_URL;
  const apiKey = process.env.LANGFLOW_API_KEY;

  if (!url) {
    const error = new Error("LANGFLOW_URL não configurada.");
    error.status = 500;
    error.code = "CONFIG_ERROR";
    throw error;
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 60000);

  try {
    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        ...(apiKey
          ? {
              "x-api-key": apiKey,
            }
          : {}),
      },

      body: JSON.stringify({
        input_value: message,
        output_type: "chat",
        input_type: "chat",
        session_id: sessionId,
      }),

      signal: controller.signal,
    });

    const rawText = await response.text();

    let data;

    try {
      data = JSON.parse(rawText);
    } catch {
      data = {
        message: rawText,
      };
    }

    // ==================================================
    // ERRO 429 - LIMITE / QUOTA DA IA
    // ==================================================

    if (
      response.status === 429 ||
      rawText.includes("RESOURCE_EXHAUSTED") ||
      rawText.includes("Quota exceeded") ||
      rawText.toLowerCase().includes("quota exceeded")
    ) {
      const error = new Error(
        "O limite de uso do modelo de IA foi atingido. Aguarde a renovação da cota ou utilize outro modelo."
      );

      error.status = 429;
      error.code = "AI_QUOTA_EXCEEDED";

      throw error;
    }

    // ==================================================
    // ERRO DE AUTENTICAÇÃO
    // ==================================================

    if (response.status === 401 || response.status === 403) {
      const error = new Error(
        "Não foi possível autenticar a requisição. Verifique a chave da API."
      );

      error.status = response.status;
      error.code = "AUTH_ERROR";

      throw error;
    }

    // ==================================================
    // OUTROS ERROS RETORNADOS PELO LANGFLOW
    // ==================================================

    if (!response.ok) {
      console.error("Erro retornado pelo Langflow:");
      console.error(rawText);

      const error = new Error(
        "O Langflow encontrou um problema ao processar a solicitação."
      );

      error.status = response.status;
      error.code = "LANGFLOW_ERROR";

      throw error;
    }

    // ==================================================
    // EXTRAI A RESPOSTA DO LANGFLOW
    // ==================================================

    const text =
      data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ??
      data?.outputs?.[0]?.outputs?.[0]?.results?.text ??
      data?.outputs?.[0]?.results?.message?.text ??
      data?.message ??
      "O fluxo foi executado, mas nenhuma resposta textual foi encontrada.";

    return {
      text,
      raw: data,
    };
  } catch (error) {
    // ==================================================
    // TIMEOUT
    // ==================================================

    if (error.name === "AbortError") {
      const timeoutError = new Error(
        "A IA demorou muito para responder. Tente novamente."
      );

      timeoutError.status = 504;
      timeoutError.code = "TIMEOUT";

      throw timeoutError;
    }

    // ==================================================
    // LANGFLOW FORA DO AR
    // ==================================================

    if (
      error.cause?.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      const connectionError = new Error(
        "Não foi possível conectar ao Langflow. Verifique se ele está em execução."
      );

      connectionError.status = 503;
      connectionError.code = "LANGFLOW_OFFLINE";

      throw connectionError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
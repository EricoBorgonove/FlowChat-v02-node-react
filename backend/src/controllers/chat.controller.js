import { runLangflow } from "../services/langflow.service.js";

export async function sendMessage(req, res) {
  try {
    const { message, sessionId } = req.body;

    // ==========================================
    // VALIDAÇÃO DA MENSAGEM
    // ==========================================

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        code: "EMPTY_MESSAGE",
        message: "Digite uma mensagem antes de enviar.",
      });
    }

    // ==========================================
    // ENVIA PARA O LANGFLOW
    // ==========================================

    const result = await runLangflow(
      message,
      sessionId
    );

    // ==========================================
    // RESPOSTA DE SUCESSO
    // ==========================================

    return res.json({
      success: true,
      message: result.text,
    });

  } catch (error) {

    // O erro completo continua aparecendo
    // apenas no terminal do servidor.

    console.error("Erro no chat:", error);

    // ==========================================
    // RESPOSTA AMIGÁVEL PARA O FRONTEND
    // ==========================================

    return res
      .status(error.status || 500)
      .json({
        success: false,

        code:
          error.code ||
          "INTERNAL_ERROR",

        message:
          error.message ||
          "Ocorreu um erro inesperado ao processar sua mensagem.",
      });
  }
}
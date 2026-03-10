// We now use an AI Execution Engine to execute code remotely via Gemini since Piston shut down public access
import axiosInstance from "./axios";

const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

export async function executeCode(language, code) {
  try {
    const res = await axiosInstance.post("/interview/run-code", { language, code });
    // AI executor returns native LeetCode styled JSON: {success, output, error, errorType}
    return res.data;
  } catch (error) {
    return {
      success: false,
      errorType: "Server Error",
      error: `Failed to execute code: ${error.message}`,
    };
  }
}

function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language] || "txt";
}

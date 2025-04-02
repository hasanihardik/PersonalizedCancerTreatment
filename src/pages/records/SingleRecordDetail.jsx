import {
  IconChevronRight,
  IconFileUpload,
  IconProgress,
} from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import RecordDetailsHeader from "./components/RecordDetailsHeader";
import { useLocation, useNavigate } from "react-router-dom";
import FileUploadModal from "./components/FileUploadModal";
import { useUserStateContext } from "../../context/UserContext";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "markdown-to-jsx";
import { PROMPT_DATA_DESCRIPTION } from "@/constants";
import { isJSON, promptDataStructure } from "../../lib/utils";

// Access the API key directly from import.meta.env
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

const SingleRecordDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(
    state.analysisResults || "",
  );
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [apiKeyValid, setApiKeyValid] = useState(true);
  const { updateRecord } = useUserStateContext();

  // Check if API key is available on component mount
  useEffect(() => {
    if (!geminiApiKey) {
      console.error("Gemini API key is missing. Please check your .env file.");
      setApiKeyValid(false);
    }
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileType(selectedFile.type);
      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async () => {
    // Check for API key and file before proceeding
    if (!geminiApiKey) {
      alert("API key is missing. Please check your environment variables.");
      return;
    }

    if (!file) {
      alert("Please select a file to upload first.");
      return;
    }

    setUploading(true);
    setUploadSuccess(false);

    try {
      // Initialize the API with the key
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      
      const base64Data = await readFileAsBase64(file);
      const imageParts = [
        { inlineData: { data: base64Data, mimeType: fileType } },
      ];
      
      // Create the model with explicit API key validation
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        apiKey: geminiApiKey  // Explicitly pass the API key again
      });
      
      const result = await model.generateContent([
        PROMPT_DATA_DESCRIPTION,
        ...imageParts,
      ]);
      
      const response = await result.response;
      const text = response.text();

      setAnalysisResult(text);
      await updateRecord({
        documentID: state.id,
        analysisResults: text,
        kanbanRecords: "test",
      });

      setUploadSuccess(true);
      setIsModalOpen(false);
      setFileName("");
      setFile(null);
      setFileType("");
    } catch (error) {
      console.error("Error during file upload/analysis:", error);
      
      // Provide more specific error messages based on error type
      if (error.message && error.message.includes("403")) {
        alert("API authentication failed. Please check that your API key is valid and properly configured.");
      } else {
        alert(`File upload or analysis failed: ${error.message || 'Unknown error'}`);
      }
      
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const processTreatmentPlan = async () => {
    if (!geminiApiKey) {
      alert("API key is missing. Please check your environment variables.");
      return;
    }

    if (state.kanbanRecords !== "test") {
      const text = state.kanbanRecords;
      if (isJSON(text)) {
        const parsedResponse = JSON.parse(text);
        navigate("/screening-schedules", { state: parsedResponse });
      } else {
        alert("Create a new record, then try to reupload the report");
        setAnalysisResult("test");
        await updateRecord({
          documentID: state.id,
          analysisResults: "test",
          kanbanRecords: "test",
        });
        return;
      }
    } else {
      setIsProcessing(true);
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          apiKey: geminiApiKey  // Explicitly pass the API key
        });

        const prompt = promptDataStructure({ analysisResult });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
          const parsedResponse = JSON.parse(text);
          await updateRecord({ documentID: state.id, kanbanRecords: text });
          navigate("/screening-schedules", { state: parsedResponse });
        } catch (jsonError) {
          console.error("Failed to parse JSON response:", jsonError);
          alert("Received an invalid response from the AI. Please try again.");
        }
      } catch (error) {
        console.error("Error processing treatment plan:", error);
        if (error.message && error.message.includes("403")) {
          alert("API authentication failed. Please check that your API key is valid and properly configured.");
        } else {
          alert(`Error generating treatment plan: ${error.message || 'Unknown error'}`);
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-[26px] bg-[#f5f5f5] dark:bg-[#13131a]">
      {!apiKeyValid && (
        <div className="w-full p-4 mt-4 text-red-700 bg-red-100 rounded-lg">
          API key is missing or invalid. Please check your environment variables.
        </div>
      )}
      
      <button
        type="button"
        onClick={handleOpenModal}
        disabled={analysisResult !== "test" || !apiKeyValid}
        className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#1c1c24] dark:text-white dark:hover:bg-neutral-800"
      >
        <IconFileUpload className="text-[#1ec070] dark:text-[#1dc071]" />
        Upload Reports
      </button>
      <FileUploadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onFileChange={handleFileChange}
        onFileUpload={handleFileUpload}
        uploading={uploading}
        uploadSuccess={uploadSuccess}
        fileName={fileName}
      />
      <RecordDetailsHeader recordName={state.recordName} />
      <div className="w-full">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="inline-block min-w-full p-1.5 align-middle">
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-[#13131a]">
                <div className="border-b border-neutral-300 px-6 py-4 dark:border-neutral-700">
                  <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                    Personalized AI-Driven Treatment Plan
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    A tailored medical strategy leveraging advanced AI insights.
                  </p>
                </div>
                <div className="flex w-full flex-col px-6 py-4 text-neutral-800 dark:text-white">
                  <div>
                    <h2 className="text-lg font-semibold">Analysis Result</h2>
                    <div className="space-y-2">
                      <Markdown>{analysisResult}</Markdown>
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={processTreatmentPlan}
                    disabled={analysisResult === "test" || !apiKeyValid}
                    className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                  >
                    View Treatment Plan{" "}
                    <IconChevronRight
                      className="text-neutral-500 dark:text-neutral-400"
                      size={20}
                    />
                    {isProcessing && (
                      <IconProgress
                        size={10}
                        className="mr-3 h-5 w-5 animate-spin"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleRecordDetail;
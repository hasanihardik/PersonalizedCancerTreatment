# Cancer Cure ⚕️ Personalized AI Cancer Care Assistant

<p align="left">
  <img src="https://www.animatedimages.org/data/media/562/animated-line-image-0184.gif" width="1920" 
</p>

![Screenshot 2024-08-10 at 3 38 55 PM](https://github.com/user-attachments/assets/e264ff9a-3a0d-4424-9574-72bd22fa5eb4)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Inspiration](#inspiration)
- [Setup and Deployment](#setup-and-deployment)
- [Usage](#usage)
- [Gemini AI Integration](#gemini-ai-integration)
- [Contributing](#contributing)

## Introduction

`Cancer Cure` is a groundbreaking AI-driven platform designed to deliver personalized cancer care by analyzing patient data, medical records, and clinical guidelines. Leveraging advanced AI capabilities, the platform identifies screening gaps, crafts individualized treatment plans, and enhances the overall quality of patient care. By integrating with Gemini AI, the assistant provides real-time insights and tailored recommendations, empowering healthcare providers to offer optimized treatment plans that improve patient outcomes.

<p align="left">
  <img src="https://www.animatedimages.org/data/media/562/animated-line-image-0184.gif" width="1920" 
</p>

## Features

### Personalized Treatment Plans
AI Cancer Cure analyzes patient data, including medical history, lab results, and imaging reports, to identify gaps in cancer screening and follow-up care. The AI generates personalized treatment plans that are tailored to the specific needs and conditions of each patient, ensuring that care is both comprehensive and timely.

### Secure Data Sharing
The platform ensures the secure handling of sensitive patient information through encryption and cryptographic features. This allows for safe and compliant data sharing between patients and healthcare providers, while maintaining the privacy and integrity of medical records.

### Advanced Diagnostic Capabilities
Integrating Gemini AI enables advanced diagnostic capabilities, including the analysis of medical images and natural language processing. These tools enhance the accuracy of treatment plans and improve the precision of data interpretation.

### Real-Time Monitoring and Alerts
The platform offers a user-friendly dashboard that allows patients to monitor their progress, view completed screenings, and receive alerts for upcoming appointments. This feature helps in reducing the risk of missed appointments and delayed treatments.

<p align="left">
  <img src="https://www.animatedimages.org/data/media/562/animated-line-image-0184.gif" width="1920" 
</p>

## Inspiration

The inspiration for AI Cancer Cure is rooted in a personal experience. Witnessing a loved one struggle with cancer, and observing the challenges they faced in coordinating care and managing treatment, highlighted the need for a more effective and supportive system. This project aims to alleviate those challenges by providing a solution that improves care coordination and ensures that patients receive timely and personalized treatment.

<p align="left">
  <img src="https://www.animatedimages.org/data/media/562/animated-line-image-0184.gif" width="1920" 
</p>

## Setup and Deployment

### Prerequisites
- Node.js and npm installed on your system

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mendsalbert/beat-cancer.git
   cd beat-cancer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Create a `.env` file in the root directory with the following content:
   ```plaintext
   VITE_GEMINI_API_KEY='Your Gemini API key here'
   ```

4. **Build the Project**
   ```bash
   npm run build
   ```

<p align="left">
  <img src="https://www.animatedimages.org/data/media/562/animated-line-image-0184.gif" width="1920" 
</p>

## Usage

### Uploading Reports
Patients or healthcare providers can upload medical reports directly into the system. The AI assistant then processes these reports to generate a comprehensive and personalized treatment plan.

### Viewing Treatment Plans
After analysis, the AI assistant generates a detailed treatment plan that outlines the necessary screenings, follow-ups, and treatment steps based on the identified gaps and patient data.

### Tracking Progress
The platform provides a dashboard where patients can track their treatment progress, view completed screenings, and monitor upcoming appointments. This ensures that patients stay informed and engaged in their care journey.

<p align="left">
  <img src="https://www.animatedimages.org/data/media/562/animated-line-image-0184.gif" width="1920" 
</p>

## Gemini AI Integration

The integration with Gemini AI significantly enhances the platform’s capabilities by providing:

### Detailed Image Analysis
Gemini AI processes medical images uploaded by patients or healthcare providers, offering advanced diagnostic insights that contribute to more accurate treatment planning.

### Advanced Natural Language Processing
Gemini AI's NLP capabilities improve the accuracy of patient data analysis and the generation of treatment plans, ensuring that recommendations are both relevant and precise.

### Scalable AI Infrastructure
Leveraging Gemini AI's robust infrastructure allows for real-time data processing and analysis, ensuring that the platform can scale to meet the needs of multiple users simultaneously.

### Example of Gemini AI Usage
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleFileUpload = async (file, filetype) => {
  const base64Data = await readFileAsBase64(file);
  const imageParts = [
    {
      inlineData: {
        data: base64Data,
        mimeType: filetype,
      },
    },
  ];

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const prompt = "Analyze this medical image and provide insights.";

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  console.log(response.text());
};
```
---

## Contributing

Contributions to the AI Cancer Cure project are welcome! Whether you have ideas for new features, improvements to existing functionality, or bug fixes, please feel free to fork the repository and submit a pull request. We encourage collaboration and are excited to see the project evolve with your input.

<p align="left">
  <img src="https://www.animatedimages.org/data/media/562/animated-line-image-0184.gif" width="1920" 
</p>

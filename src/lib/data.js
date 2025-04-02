import {
  Calendar,
  Stethoscope,
  Activity,
  BarChart3,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

export const navLinks = [
  {
    name: "dashboard",
    imageUrl: "/apps.svg",
    link: "/dashboard",
  },
  {
    name: "records",
    imageUrl: "/records.svg",
    link: "/medical-records",
  },
  {
    name: "screenings",
    imageUrl: "/screening.svg",
    link: "/screening-schedules",
  },
  {
    name: "profile",
    imageUrl: "/user.svg",
    link: "/profile",
  },
  { name: "Home", imageUrl: "/home.svg", link: "/" },
];

export const features = [
  {
    icon: Calendar,
    title: "Advanced Diagnosis",
    description:
      "Leverage AI to assist in diagnosing diseases with high accuracy.",
  },
  {
    icon: Stethoscope,
    title: "Symptom Monitoring",
    description:
      "Track and analyze patient symptoms in real-time for proactive intervention.",
  },
  {
    icon: Activity,
    title: "Personalized Treatment Plans",
    description:
      "Generate tailored treatment plans using AI based on patient data.",
  },
  {
    icon: BarChart3,
    title: "Predictive Health Insights",
    description:
      "Utilize AI to predict potential health risks and recommend preventive measures.",
  },
  {
    icon: MessageCircle,
    title: "Virtual Health Assistant",
    description: "Provide patients with AI-driven health guidance and support.",
  },
  {
    icon: ShieldCheck, // suggests secure data and privacy
    title: "Data Security & Compliance",
    description:
      "Ensure patient data is protected with secure, compliant AI-driven solutions.",
  },
];

export const howItWorks = [
  {
    step: "Sign Up",
    description:
      "Create a free account to access AI-driven medical treatment tools.",
  },
  {
    step: "Onboarding",
    description:
      "Complete the onboarding process to set up your profile and preferences.",
  },
  {
    step: "Upload Medical Reports",
    description:
      "Easily upload and organize patient medical reports for analysis.",
  },
  {
    step: "Receive Personalized Treatment",
    description:
      "Get AI-generated, personalized treatment plans tailored to individual needs.",
  },
];

export const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Oncologist",
    content:
      "CureWise has revolutionized patient care in my practice. The personalized treatment recommendations save me time and offer my patients optimized care pathways.",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "David Lee",
    role: "Medical Research Scientist",
    content:
      "With CureWise AI, I can analyze patient data quickly and more accurately. The AI-driven insights are invaluable for developing targeted treatment plans.",
    image: "https://i.pravatar.cc/150?img=6",
  },
  {
    name: "Emily Chen",
    role: "Healthcare Administrator",
    content:
      "CureWise AI simplifies patient data management and appointment scheduling. The streamlined workflow has improved patient engagement and care quality in our facility.",
    image: "https://i.pravatar.cc/150?img=7",
  },
  {
    name: "Dr. Michael Brown",
    role: "Neurologist",
    content:
      "The AI recommendations from CureWise AI allow me to deliver tailored treatments to my patients. It’s a game-changer for precision medicine.",
    image: "https://i.pravatar.cc/150?img=8",
  },
];

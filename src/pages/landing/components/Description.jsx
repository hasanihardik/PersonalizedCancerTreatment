import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Description = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
      <div className="lg:w-1/2">
        <div className="mb-6 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-900/50 dark:text-green-300">
          AI-POWERED CANCER TREATMENT
        </div>
        <h1 className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text pb-6 text-4xl font-extrabold text-transparent dark:from-green-400 dark:to-blue-400 md:text-5xl lg:text-6xl">
          CureWise: Transform Cancer Care with AI
        </h1>
        <p className="mb-10 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
          Leverage our platform to streamline patient records, enhance treatment
          tracking, and automate follow-ups—all powered by advanced AI
          technology designed specifically for personalized cancer treatment.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link to={"/dashboard"}>
            <Button size="lg" className="w-full text-lg sm:w-auto">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full text-lg sm:w-auto"
          >
            <PlayCircle className="mr-2 h-5 w-5" /> Watch Demo
          </Button>
        </div>
      </div>
      <div className="flex justify-center lg:w-1/2">
        <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 opacity-30"></div>
          <img
            alt="medical care illustration"
            src="/medical-care.svg"
            className="relative z-10 rounded-2xl object-cover p-4" 
          />
          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-green-500/20 blur-2xl"></div>
          <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-blue-500/20 blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Description;

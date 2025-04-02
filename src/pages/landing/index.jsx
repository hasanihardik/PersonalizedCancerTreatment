import Testimonials from "@/pages/landing/components/Testimonials";
import HowItWorks from "@/pages/landing/components/HowItWorks";
import Features from "@/pages/landing/components/Features";
import Description from "@/pages/landing/components/Description";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 opacity-50"></div>
        <div className="container relative mx-auto px-6 py-24">
          <Description />
        </div>
      </div>

      {/* Features Section with Cards */}
      <div className="container mx-auto px-6 py-20">
        <div className="mb-16 text-center">
          <span className="mb-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-900/50 dark:text-green-300">
            POWERFUL FEATURES
          </span>
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
            Key Features
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            CureWise provides cutting-edge tools powered by AI to revolutionize cancer treatment
          </p>
        </div>
        <Features />
      </div>

      {/* Testimonials Section with Background */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-20">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              TESTIMONIALS
            </span>
            <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
              What Our Users Say
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Hear from healthcare professionals who have transformed their practice with CureWise
            </p>
          </div>
          <Testimonials />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="mb-16 text-center">
          <span className="mb-2 inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
            SIMPLE PROCESS
          </span>
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Get started with CureWise in just a few simple steps
          </p>
        </div>
        <HowItWorks />
      </div>

      {/* Trust Indicators */}
      <div className="container mx-auto mb-20 px-6">
        <div className="grid grid-cols-1 gap-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800 md:grid-cols-3">
          <div className="flex items-center">
            <Shield className="mr-4 h-10 w-10 text-green-500" />
            <div>
              <h3 className="font-bold dark:text-white">HIPAA Compliant</h3>
              <p className="text-gray-600 dark:text-gray-400">Your data is secure and protected</p>
            </div>
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="mr-4 h-10 w-10 text-green-500" />
            <div>
              <h3 className="font-bold dark:text-white">Clinically Validated</h3>
              <p className="text-gray-600 dark:text-gray-400">Backed by medical research</p>
            </div>
          </div>
          <div className="flex items-center">
            <Star className="mr-4 h-10 w-10 text-green-500" />
            <div>
              <h3 className="font-bold dark:text-white">5-Star Rated</h3>
              <p className="text-gray-600 dark:text-gray-400">Trusted by healthcare professionals</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 py-16 dark:from-green-700 dark:to-blue-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Transform Patient Care with AI
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90 sm:text-xl">
            Join countless healthcare professionals leveraging CureWise to enhance
            patient management and improve treatment outcomes.
          </p>

          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link to={"/dashboard"}>
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 dark:bg-white dark:text-green-700 dark:hover:bg-gray-100"
              >
                Start For Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to={"/dashboard"}>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 dark:border-white dark:text-white dark:hover:bg-white/10"
              >
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

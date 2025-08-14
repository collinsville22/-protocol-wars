'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  action: string;
  reward?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Protocol Wars!',
    description: 'You are now the commander of a DAO in an epic blockchain battle for supremacy.',
    target: 'header',
    action: 'Click NEXT to begin your training',
    reward: '+100 XP'
  },
  {
    id: 'resources',
    title: 'Resource Management',
    description: 'Monitor your treasury! You have 4 resource types: Computing, Liquidity, Community, and Governance.',
    target: 'resources',
    action: 'Check your resource panel on the left',
    reward: '+50 Computing'
  },
  {
    id: 'battlefield',
    title: 'The Combat Zone',
    description: 'This is your 3D battlefield! Blue hexagons are your territories, red are enemies, gray are neutral.',
    target: 'battlefield',
    action: 'Click on a neutral (gray) territory to attack',
    reward: '+200 XP'
  },
  {
    id: 'deploy',
    title: 'Deploy Your Forces',
    description: 'Build an army! Deploy Validators for defense, Developers for resources, Degens for raids, or Whales for massive attacks.',
    target: 'deploy',
    action: 'Deploy your first unit',
    reward: '+300 XP + First Unit Bonus'
  },
  {
    id: 'missions',
    title: 'Complete Missions',
    description: 'Earn massive rewards by completing missions! Check your active objectives.',
    target: 'missions',
    action: 'Complete your first mission',
    reward: '+500 XP + 1000 SOL'
  }
];

interface TutorialSystemProps {
  onComplete: () => void;
}

export default function TutorialSystem({ onComplete }: TutorialSystemProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const currentTutorial = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCompletedSteps(prev => [...prev, currentTutorial.id]);
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  const handleComplete = () => {
    setCompletedSteps(prev => [...prev, currentTutorial.id]);
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-gradient-to-br from-gray-900 via-black to-red-900 border-2 border-red-500/50 rounded-lg p-8 max-w-2xl mx-4 shadow-2xl shadow-red-500/30"
        >
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-red-400 font-mono text-sm">TUTORIAL PROGRESS</span>
              <span className="text-white font-bold">{currentStep + 1}/{tutorialSteps.length}</span>
            </div>
            <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 to-yellow-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Tutorial Content */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-4xl">
                {currentStep === 0 && '🎯'}
                {currentStep === 1 && '💰'}
                {currentStep === 2 && '🌍'}
                {currentStep === 3 && '⚔️'}
                {currentStep === 4 && '🏆'}
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">{currentTutorial.title}</h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">{currentTutorial.description}</p>
            
            <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div className="text-yellow-400 font-bold mb-2">📋 YOUR MISSION:</div>
              <div className="text-white">{currentTutorial.action}</div>
              {currentTutorial.reward && (
                <div className="text-green-400 mt-2 font-bold">🎁 Reward: {currentTutorial.reward}</div>
              )}
            </div>
          </div>

          {/* Tutorial Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-mono"
            >
              Skip Tutorial
            </button>
            
            <div className="flex space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
                >
                  ← Back
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-bold transition-all shadow-lg animate-pulse"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Start Playing! 🚀' : 'Next →'}
              </button>
            </div>
          </div>

          {/* Completed Steps Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {tutorialSteps.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-all ${
                  index < currentStep
                    ? 'bg-green-500'
                    : index === currentStep
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
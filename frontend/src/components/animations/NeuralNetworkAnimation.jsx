import React, { useState, useEffect } from 'react';
import AnimationPlayerWrapper from './AnimationPlayerWrapper';
import { Cpu, Zap, Activity } from 'lucide-react';

const NN_STEPS = [
  {
    step: 0,
    activeLayer: 'inputs',
    inputs: [1.5, 0.8],
    hiddenValues: [0, 0, 0],
    outputVal: 0,
    explanation: 'Step 1 [Input Features]: Normalized input vector [x1 = 1.5, x2 = 0.8] loaded into input layer neurons.',
  },
  {
    step: 1,
    activeLayer: 'weights_1',
    inputs: [1.5, 0.8],
    hiddenValues: [0, 0, 0],
    outputVal: 0,
    explanation: 'Step 2 [Synaptic Transmission]: Input signals multiply across weight matrix: z = W1 · x + b1.',
  },
  {
    step: 2,
    activeLayer: 'hidden',
    inputs: [1.5, 0.8],
    hiddenValues: [2.1, 0.0, 1.4],
    outputVal: 0,
    explanation: 'Step 3 [ReLU Activation]: Non-linear activation f(z) = max(0, z) executed on hidden neurons (neuron 2 clipped to 0.0).',
  },
  {
    step: 3,
    activeLayer: 'output',
    inputs: [1.5, 0.8],
    hiddenValues: [2.1, 0.0, 1.4],
    outputVal: 0.94,
    explanation: 'Step 4 [Output Prediction]: Output layer computes weighted sum and Sigmoid probability. Predicted Probability: 94% (Class 1).',
  },
];

const NeuralNetworkAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= NN_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const activeData = NN_STEPS[currentStep];

  return (
    <AnimationPlayerWrapper
      title="Deep Neural Network Forward Propagation"
      subtitle="Visualizing signal flow from Inputs → Weighted Synapses → Hidden ReLU → Output Probability."
      currentStep={currentStep}
      totalSteps={NN_STEPS.length}
      isPlaying={isPlaying}
      playbackSpeed={speed}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onNext={() => setCurrentStep((p) => Math.min(p + 1, NN_STEPS.length - 1))}
      onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
      onRestart={() => { setCurrentStep(0); setIsPlaying(false); }}
      onSpeedChange={(s) => setSpeed(s)}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        {/* Visual Neuron Graph */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', maxWidth: '650px', padding: '1.5rem 0' }}>
          {/* Input Layer (2 Neurons) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>INPUT LAYER</div>
            {activeData.inputs.map((val, idx) => (
              <div
                key={idx}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: activeData.activeLayer === 'inputs' ? 'rgba(6, 182, 212, 0.3)' : '#1e293b',
                  border: `2px solid ${activeData.activeLayer === 'inputs' ? '#06b6d4' : 'var(--border-color)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  boxShadow: activeData.activeLayer === 'inputs' ? '0 0 15px rgba(6, 182, 212, 0.4)' : 'none',
                  transition: 'all 0.3s'
                }}
              >
                x{idx + 1}:{val}
              </div>
            ))}
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>➔</div>

          {/* Hidden Layer (3 Neurons) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>HIDDEN (ReLU)</div>
            {activeData.hiddenValues.map((val, idx) => (
              <div
                key={idx}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: activeData.activeLayer === 'hidden' ? 'rgba(168, 85, 247, 0.35)' : '#1e293b',
                  border: `2px solid ${activeData.activeLayer === 'hidden' ? '#c084fc' : 'var(--border-color)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  boxShadow: activeData.activeLayer === 'hidden' ? '0 0 15px rgba(168, 85, 247, 0.5)' : 'none',
                  transition: 'all 0.3s'
                }}
              >
                h{idx + 1}:{val}
              </div>
            ))}
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>➔</div>

          {/* Output Layer (1 Neuron) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>OUTPUT (Sigmoid)</div>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: activeData.activeLayer === 'output' ? 'rgba(16, 185, 129, 0.35)' : '#1e293b',
                border: `3px solid ${activeData.activeLayer === 'output' ? '#10b981' : 'var(--border-color)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1rem',
                color: '#34d399',
                fontFamily: 'var(--font-mono)',
                boxShadow: activeData.activeLayer === 'output' ? '0 0 25px rgba(16, 185, 129, 0.6)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              {activeData.outputVal > 0 ? `${Math.round(activeData.outputVal * 100)}%` : '0%'}
            </div>
          </div>
        </div>

        {/* Explanation Card */}
        <div style={{
          width: '100%',
          maxWidth: '650px',
          padding: '14px 20px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#c7d2fe', lineHeight: 1.5 }}>
            {activeData.explanation}
          </p>
        </div>
      </div>
    </AnimationPlayerWrapper>
  );
};

export default NeuralNetworkAnimation;

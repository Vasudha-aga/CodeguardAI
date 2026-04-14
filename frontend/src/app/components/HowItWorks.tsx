import { Link } from 'react-router-dom';
import { Shield, Upload, Cpu, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import AnimatedBackground from './AnimatedBackground';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: Upload,
      title: 'Paste Your Code',
      description: 'Simply paste your code. We support multiple programming languages and frameworks.',
      details: [
        'Paste code directly into the editor',
        'Currently supporting for Python, JavaScript, Java and C++  programming languages'
      ]
    },
    {
      number: 2,
      icon: Cpu,
      title: 'AI Analysis',
      description: 'Our advanced AI engine analyzes your code for bugs, vulnerabilities, and optimization opportunities.',
      details: [
        'Deep learning-based bug detection',
        'Security vulnerability scanning',
        'Performance bottleneck identification',
        'Code quality assessment'
      ]
    },
    {
      number: 3,
      icon: FileText,
      title: 'Get Results',
      description: 'Receive detailed reports with actionable insights and recommendations to improve your code quality.',
      details: [
        'Comprehensive analysis reports',
        'Line-by-line issue highlighting',
        'Actionable recommendations',
        'Code quality scores and metrics'
      ]
    }
  ];

  return (
    <div className="min-h-screen animated-bg relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 w-full z-50 glass-card border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
                <Shield className="w-8 h-8 text-blue-500" />
                <span className="text-2xl gradient-text">CodeGuard AI</span>
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <Link to="/features" className="text-gray-300 hover:text-blue-400 transition-colors">Features</Link>
                <Link to="/how-it-works" className="text-blue-400 font-semibold">How It Works</Link>
                <Link to="/why-choose" className="text-gray-300 hover:text-blue-400 transition-colors">Why Choose</Link>
                <Link to="/signin" className="text-gray-300 hover:text-blue-400 transition-colors">Sign In</Link>
                <Link to="/signup" className="gradient-button text-white px-6 py-2 rounded-lg">Get Started</Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-blue-400 mb-8 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
            </motion.div>

            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl text-white mb-6">
                How It <span className="gradient-text">Works</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Three simple steps to better code. Our AI-powered platform makes code analysis 
                fast, accurate, and easy to understand.
              </p>
            </motion.div>

            {/* Steps */}
            <div className="space-y-12 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="glass-card p-8 rounded-2xl"
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Step Number and Icon */}
                    <div className="flex-shrink-0">
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <step.icon className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl text-white font-bold">
                          {step.number}
                        </div>
                      </motion.div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl text-white mb-3">{step.title}</h3>
                      <p className="text-lg text-gray-400 mb-4">{step.description}</p>
                      
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="flex justify-center mt-8"
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-8 h-8 text-blue-400 rotate-90" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Process Flow Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-20"
            >
              <div className="glass-card p-8 md:p-12 rounded-2xl neon-border">
                <h2 className="text-3xl text-white mb-8 text-center">Behind The Scenes</h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h3 className="text-xl text-white mb-2">Code Parsing</h3>
                    <p className="text-gray-400 text-sm">
                      Your code is parsed and converted into an Abstract Syntax Tree (AST) 
                      for deep structural analysis.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <h3 className="text-xl text-white mb-2">AI Processing</h3>
                    <p className="text-gray-400 text-sm">
                      Machine learning models trained on millions of code samples 
                      analyze patterns and identify issues.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="text-xl text-white mb-2">Report Generation</h3>
                    <p className="text-gray-400 text-sm">
                      Findings are compiled into comprehensive reports with 
                      visualizations and actionable recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-16 text-center"
            >
              <h2 className="text-3xl text-white mb-4">Ready to Try It?</h2>
              <p className="text-gray-400 mb-8">
                Start analyzing your code in less than a minute
              </p>
              <Link to="/signup" className="gradient-button text-white px-10 py-4 rounded-lg text-lg inline-block">
                Get Started Now
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-blue-500/20 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-500" />
                <span className="gradient-text">CodeGuard AI</span>
              </div>
              <p className="text-gray-500 text-sm">
                © 2026 CodeGuard AI. B.Tech Final Year Project.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

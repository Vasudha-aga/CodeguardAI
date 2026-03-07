import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Code, Sparkles, ArrowRight, Star, Zap, Lock, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import AnimatedBackground from './AnimatedBackground';

export default function LandingPage() {
  return (
    <div className="min-h-screen animated-bg relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed top-0 w-full z-50 glass-card border-b border-blue-500/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="w-8 h-8 text-blue-500" />
                <span className="text-2xl gradient-text">CodeGuard AI</span>
              </motion.div>
              <nav className="hidden md:flex items-center gap-8">
                <Link to="/features" className="text-gray-300 hover:text-blue-400 transition-colors">Features</Link>
                <Link to="/how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors">How It Works</Link>
                <Link to="/why-choose" className="text-gray-300 hover:text-blue-400 transition-colors">Why Choose</Link>
                <Link to="/signin" className="text-gray-300 hover:text-blue-400 transition-colors">Sign In</Link>
                <Link to="/signup" className="gradient-button text-white px-6 py-2 rounded-lg">Get Started</Link>
              </nav>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto text-center w-full">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Powered by Advanced AI Technology</span>
              <Star className="w-4 h-4 text-yellow-400" />
            </motion.div>
            
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl md:text-7xl mb-6"
            >
              <span className="text-white">Intelligent Code Review &</span>
              <br />
              <span className="gradient-text">Automated Bug Detection</span>
            </motion.h1>
            
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
            >
              CodeGuard AI leverages cutting-edge artificial intelligence to analyze your code, 
              detect bugs, identify security vulnerabilities, and provide actionable recommendations 
              to improve your code quality instantly.
            </motion.p>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link to="/signup" className="gradient-button text-white px-8 py-4 rounded-lg text-lg w-full sm:w-auto flex items-center justify-center gap-2 group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/signin" className="glass-card text-white px-8 py-4 rounded-lg text-lg w-full sm:w-auto neon-border">
                Sign In
              </Link>
            </motion.div>

            {/* Hero Visual - Enhanced */}
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="glass-card p-8 rounded-2xl pulse-glow max-w-4xl mx-auto relative overflow-hidden"
            >
              {/* Floating code snippets in background */}
              <motion.div
                className="absolute top-4 right-4 text-xs text-blue-400 opacity-50"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {'</>'}
              </motion.div>
              <motion.div
                className="absolute bottom-4 left-4 text-xs text-purple-400 opacity-50"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {'{ }'}
              </motion.div>

              <div className="bg-[#0B0F1A] rounded-lg p-6 border border-blue-500/20 relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-500 text-sm ml-4">CodeGuard AI Analysis</span>
                </div>
                <div className="text-left font-mono text-sm space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="text-gray-500"
                  >
                    // Analyzing your code...
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                    className="text-green-400 flex items-center gap-2"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ✓
                    </motion.span>
                    Security vulnerabilities: 0
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 }}
                    className="text-blue-400 flex items-center gap-2"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    >
                      ✓
                    </motion.span>
                    Code quality score: 95/100
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8 }}
                    className="text-purple-400 flex items-center gap-2"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    >
                      ✓
                    </motion.span>
                    Performance issues detected: 2
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.0 }}
                    className="text-yellow-400 flex items-center gap-2"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                    >
                      ✓
                    </motion.span>
                    Recommendations ready
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Features Preview */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl text-white mb-4">Discover What We Offer</h2>
              <p className="text-xl text-gray-400">Explore our powerful features and capabilities</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-8 rounded-2xl stat-card"
              >
                <Zap className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-2xl text-white mb-3">Powerful Features</h3>
                <p className="text-gray-400 mb-6">
                  Discover all the advanced capabilities that make CodeGuard AI the best choice for code analysis.
                </p>
                <Link to="/features" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 group">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-8 rounded-2xl stat-card"
              >
                <Terminal className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-2xl text-white mb-3">How It Works</h3>
                <p className="text-gray-400 mb-6">
                  See how our AI-powered platform analyzes your code in three simple steps.
                </p>
                <Link to="/how-it-works" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 group">
                  See The Process
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-8 rounded-2xl stat-card"
              >
                <Lock className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-2xl text-white mb-3">Why Choose Us</h3>
                <p className="text-gray-400 mb-6">
                  Learn why CodeGuard AI stands out from traditional code analysis tools.
                </p>
                <Link to="/why-choose" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 group">
                  See Why
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-12 rounded-2xl neon-border"
            >
              <Code className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-4xl text-white mb-4">Ready to improve your code?</h2>
              <p className="text-xl text-gray-400 mb-8">
                Join thousands of developers using CodeGuard AI to write better, 
                safer, and more efficient code.
              </p>
              <Link to="/signup" className="gradient-button text-white px-10 py-4 rounded-lg text-lg inline-block">
                Start Free Trial
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
              <div className="flex gap-6 text-sm text-gray-500">
                <Link to="/features" className="hover:text-blue-400 transition-colors">Features</Link>
                <Link to="/how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link>
                <Link to="/why-choose" className="hover:text-blue-400 transition-colors">Why Choose</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Shield, Search, Zap, Lock, TrendingUp, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import AnimatedBackground from './AnimatedBackground';

export default function Features() {
  const features = [
    {
      icon: Search,
      title: 'Bug Detection',
      description: 'Advanced AI algorithms scan your codebase to identify bugs, logic errors, and potential runtime issues before they impact production.',
      delay: 0
    },
    {
      icon: Shield,
      title: 'Security Analysis',
      description: 'Detect security vulnerabilities, injection flaws, and insecure patterns to protect your application from potential threats.',
      delay: 0.1
    },
    {
      icon: Zap,
      title: 'AI Code Review',
      description: 'Get intelligent suggestions and best practices recommendations powered by machine learning trained on millions of code repositories.',
      delay: 0.2
    },
    {
      icon: Lock,
      title: 'Code Quality Metrics',
      description: 'Track code quality scores, maintainability index, and technical debt with detailed analytics and reporting.',
      delay: 0.3
    },
    {
      icon: TrendingUp,
      title: 'Performance Optimization',
      description: 'Identify performance bottlenecks and receive actionable recommendations to optimize your code efficiency.',
      delay: 0.4
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
                <Link to="/features" className="text-blue-400 font-semibold">Features</Link>
                <Link to="/how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors">How It Works</Link>
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
                Powerful <span className="gradient-text">Features</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Everything you need for professional code analysis and security scanning. 
                Our AI-powered platform delivers comprehensive insights to help you write better code.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card p-8 rounded-2xl stat-card group"
                >
                  <motion.div
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Additional Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-20"
            >
              <div className="glass-card p-8 md:p-12 rounded-2xl neon-border">
                <h2 className="text-3xl text-white mb-6 text-center">More Than Just Analysis</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl text-blue-400 mb-3">Real-Time Feedback</h3>
                    <p className="text-gray-400">
                      Get instant feedback as you code. Our AI engine processes your code in real-time 
                      and provides immediate suggestions for improvements.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl text-blue-400 mb-3">Detailed Reports</h3>
                    <p className="text-gray-400">
                      Generate comprehensive reports with charts, metrics, and actionable insights. 
                      Perfect for team reviews and documentation.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl text-blue-400 mb-3">Learning Resources</h3>
                    <p className="text-gray-400">
                      Each recommendation includes educational content to help you understand 
                      the issue and learn best practices.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl text-blue-400 mb-3">Version Tracking</h3>
                    <p className="text-gray-400">
                      Track improvements over time. Compare analysis results across different 
                      versions of your code.
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
              <Link to="/signup" className="gradient-button text-white px-10 py-4 rounded-lg text-lg inline-block">
                Start Using These Features Now
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

import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Zap, Clock, Target, Users, TrendingUp, Award, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import AnimatedBackground from './AnimatedBackground';

export default function WhyChoose() {
  const reasons = [
    {
      icon: Zap,
      title: '99% Accuracy Rate',
      description: 'Our AI models achieve 99% accuracy in bug detection, trained on millions of code samples.'
    },
    {
      icon: Clock,
      title: 'Real-Time Analysis',
      description: 'Get instant feedback with analysis results delivered in seconds, not hours.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Your code is encrypted and secure. We never store your code permanently.'
    },
    {
      icon: Target,
      title: 'Highly Accurate',
      description: 'Minimize false positives with context-aware analysis and intelligent filtering.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share reports, track progress, and collaborate with your team seamlessly.'
    },
    {
      icon: TrendingUp,
      title: 'Continuous Improvement',
      description: 'Track code quality metrics over time and measure your improvement.'
    }
  ];

  const benefits = [
    'AI-powered analysis',
    'Real-time bug detection and alerts',
    'Comprehensive security vulnerability scanning',
    'Detailed performance metrics and insights',
    'Integration with popular development tools',
    'Fast analysis - results in seconds',
    'Continuous monitoring and tracking',
    'Historical analysis comparison'
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
                <Link to="/how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors">How It Works</Link>
                <Link to="/why-choose" className="text-blue-400 font-semibold">Why Choose</Link>
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
                Why Choose <span className="gradient-text">CodeGuard AI?</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                The most advanced code analysis platform trusted by developers worldwide. 
                Experience the difference that intelligent automation makes.
              </p>
            </motion.div>

            {/* Key Reasons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-20"
            >
              <h2 className="text-4xl text-white mb-12 text-center">What Makes Us Different</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reasons.map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    className="glass-card p-6 rounded-xl stat-card"
                  >
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                      <reason.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl text-white mb-3">{reason.title}</h3>
                    <p className="text-gray-400">{reason.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Benefits Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-20"
            >
              <div className="glass-card p-8 md:p-12 rounded-2xl neon-border">
                <h2 className="text-4xl text-white mb-8 text-center">Complete Feature Set</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 * index }}
                      className="flex items-center gap-3 glass-card p-4 rounded-lg"
                    >
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Comparison Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-20"
            >
              <h2 className="text-4xl text-white mb-12 text-center">CodeGuard AI vs Traditional Tools</h2>
              <div className="glass-card p-8 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-blue-500/30">
                        <th className="pb-4 text-gray-400 font-normal">Feature</th>
                        <th className="pb-4 text-center">
                          <span className="gradient-text font-bold text-lg">CodeGuard AI</span>
                        </th>
                        <th className="pb-4 text-center text-gray-400">Traditional Tools</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      {[
                        ['AI-Powered Analysis', true, false],
                        ['Real-Time Results', true, false],
                        ['Python Language Support', true, "Limited (Multiple Tools Required)"],
                        ['Security Scanning', true, 'Basic'],
                        ['Code Quality Metrics', true, "Static only"],
                        ['Learning Recommendations', true, false],
                        ['Team Collaboration', true, false],
                        ['Analysis Speed', '< 3 seconds', 'Minutes']
                      ].map((row, index) => (
                        <tr key={index} className="border-b border-blue-500/10">
                          <td className="py-4">{row[0]}</td>
                          <td className="py-4 text-center">
                            {typeof row[1] === 'boolean' ? (
                              row[1] ? (
                                <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                              ) : (
                                <span className="text-gray-600">✗</span>
                              )
                            ) : (
                              <span className="text-blue-400 font-semibold">{row[1]}</span>
                            )}
                          </td>
                          <td className="py-4 text-center">
                            {typeof row[2] === 'boolean' ? (
                              row[2] ? (
                                <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                              ) : (
                                <span className="text-gray-600">✗</span>
                              )
                            ) : (
                              <span className="text-gray-500">{row[2]}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-center"
            >
              <div className="glass-card p-12 rounded-2xl neon-border inline-block">
                <Award className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                <h2 className="text-4xl text-white mb-4">Ready to Experience The Difference?</h2>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  Join thousands of developers who have improved their code quality with CodeGuard AI
                </p>
                <Link to="/signup" className="gradient-button text-white px-10 py-4 rounded-lg text-lg inline-block">
                  Start Your Free Trial
                </Link>
                <p className="text-gray-500 text-sm mt-4">No credit card required • 14-day free trial</p>
              </div>
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
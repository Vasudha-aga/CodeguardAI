# CodeGuard AI - Frontend

## B.Tech Final Year Project

A professional, production-ready frontend for an AI-powered code analysis and bug detection platform.

---

## 🚀 Features

### Pages Included:

1. **Landing Page** (`/`)
   - Modern hero section with AI-focused design
   - Feature showcase
   - How it works section
   - Why choose us section
   - Professional footer

2. **Authentication Pages**
   - Sign In (`/signin`)
   - Sign Up (`/signup`)
   - Clean, centered card design with dark theme

3. **Dashboard** (`/dashboard`)
   - Overview statistics
   - Interactive charts (quality trend, issues by category)
   - Recent analysis history
   - Quick action cards

4. **Code Analyzer** (`/analyzer`)
   - Multi-language code editor
   - Real-time analysis
   - Detailed results panel
   - Quick code templates

5. **Bug Detection** (`/bugs`)
   - Comprehensive bug list
   - Severity filtering
   - Search functionality
   - Detailed issue descriptions

6. **AI Code Review** (`/ai-review`)
   - AI-powered insights
   - Security, performance, and quality analysis
   - Detailed recommendations
   - Code examples

7. **Recommendations** (`/recommendations`)
   - Best practices
   - Security tips
   - Performance optimizations
   - Learning resources

8. **History** (`/history`)
   - Analysis history table
   - Filter by language and date
   - Export functionality
   - Detailed statistics

---

## 🎨 Design System

### Color Palette:
- **Primary Background:** Deep Navy (#0B0F1A, #0E1325)
- **Primary Accent:** Neon Blue (#3B82F6, #2563EB)
- **Secondary Accent:** Purple (#7C3AED, #9333EA)
- **Text:** White (#FFFFFF), Soft Gray (#CBD5E1)

### Key Features:
- ✨ Glassmorphism effects
- 🌈 Gradient buttons with glow
- 🎯 Neon borders and accents
- 📊 Interactive charts (Recharts)
- 📱 Fully responsive design
- 🎭 Smooth animations

---

## 🛠️ Tech Stack

- **React** 18.3.1
- **TypeScript**
- **React Router DOM** - Navigation
- **Tailwind CSS** 4.x - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Vite** - Build tool

---

## 📁 Project Structure

```
src/
├── app/
│   ├── App.tsx                    # Main app with routing
│   └── components/
│       ├── LandingPage.tsx        # Landing page
│       ├── SignIn.tsx             # Sign in page
│       ├── SignUp.tsx             # Sign up page
│       ├── DashboardLayout.tsx    # Dashboard layout wrapper
│       ├── Dashboard.tsx          # Main dashboard
│       ├── CodeAnalyzer.tsx       # Code analysis tool
│       ├── BugDetection.tsx       # Bug list & details
│       ├── AICodeReview.tsx       # AI review insights
│       ├── Recommendations.tsx    # Best practices
│       └── History.tsx            # Analysis history
├── styles/
│   ├── index.css                  # Main CSS imports
│   ├── tailwind.css               # Tailwind base
│   ├── theme.css                  # Theme variables
│   └── codeguard.css              # Custom styles
```

---

## 🚀 Getting Started

### Installation:
```bash
npm install
```

### Development:
```bash
npm run dev
```

### Build for Production:
```bash
npm run build
```

---

## 🎯 Key Components

### Navigation:
- **Landing:** Full-page marketing site
- **Auth:** Centered card authentication
- **Dashboard:** Sidebar layout with navigation

### Mock Data:
All pages use realistic mock data to demonstrate functionality. Ready for API integration.

### Responsive Design:
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Hamburger menu for mobile
- Responsive tables and charts

---

## 🔐 Demo Accounts

For demonstration purposes, any credentials will work:
- Click "Sign In" or "Sign Up" with any input to access the dashboard
- No backend required for frontend demonstration

---

## 📊 Charts & Visualizations

Using Recharts for:
- Line charts (Quality trend)
- Area charts (Score progression)
- Bar charts (Issues by category)
- Pie charts (Severity distribution)

---

## 🎨 Custom Styles

### Glassmorphism Cards:
```css
.glass-card {
  background: rgba(14, 19, 37, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.2);
}
```

### Gradient Buttons:
```css
.gradient-button {
  background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%);
}
```

---

## 📝 Notes for Presentation

### Professional Highlights:
- ✅ Production-ready code quality
- ✅ Modern AI SaaS aesthetic
- ✅ Fully responsive design
- ✅ Smooth animations and transitions
- ✅ Comprehensive feature set
- ✅ Clean, maintainable code structure

### Future Enhancements:
- Backend API integration
- Real AI/ML model integration
- User authentication system
- Database for history storage
- Real-time code analysis
- Export reports (PDF/CSV)

---

## 👨‍🎓 B.Tech Project Information

**Project Name:** CodeGuard AI  
**Tagline:** Intelligent Code Review & Automated Bug Detection  
**Category:** AI/ML, Web Development, Software Engineering  
**Year:** 2026  

---

## 📄 License

This is a B.Tech final year project. All rights reserved.

---

**Built with ❤️ for academic excellence**

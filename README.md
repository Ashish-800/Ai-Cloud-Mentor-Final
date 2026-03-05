# 🚀 AI Cloud Mentor - Production-Grade Cloud Architecture Analysis Platform

> An AI-powered, futuristic web application that analyzes cloud architectures and provides intelligent feedback on scalability, reliability, security, and cost optimization.

## ✨ Features

- **Real-time Architecture Analysis** - Get instant feedback on your AWS architecture
- **Four-Pillar Scoring System**:
  - 🎯 **Scalability** (0-40 points) - How well your architecture handles growth
  - 🛡️ **Reliability** (0-30 points) - Fault tolerance and availability
  - 🔒 **Security** (0-20 points) - Protection and compliance measures
  - 💰 **Cost Efficiency** (0-10 points) - Resource optimization
- **Cost Analysis** - See current vs. optimized costs with monthly savings
- **Smart Rule-Based Scoring** - Detects AWS best practices and anti-patterns
- **Futuristic UI** - Glassmorphism design with smooth animations
- **Mobile Responsive** - Works perfectly on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Framer Motion** - Premium animations
- **Tailwind CSS v4** - Modern styling
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **FastAPI** (Python) - High-performance REST API
- **Pydantic** - Data validation
- **CORS** - Cross-origin requests enabled

## 📋 Prerequisites

- **Node.js** v18+ (for frontend)
- **Python** 3.8+ (for backend)
- **npm** or **yarn** (package manager)

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app:app --reload
```

The backend will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📊 Using the Analyzer

### Example Architecture Description

```
Single EC2 instance running Node.js API, RDS PostgreSQL database with multi-AZ enabled, 
ALB in front for load balancing, S3 for static assets with CloudFront CDN, 
VPC with public and private subnets, security groups configured, 
WAF enabled on ALB, CloudWatch monitoring, backup strategy in place, 
expecting 50,000 concurrent users with auto-scaling group.
```

### How Scoring Works

The analyzer examines your architecture description and:

1. **Detects Keywords** - Looks for AWS services and patterns
2. **Applies Rules** - Evaluates against cloud best practices
3. **Calculates Scores** - Weighted scoring for each pillar
4. **Estimates Costs** - Provides optimization recommendations
5. **Animates Results** - Displays insights with beautiful animations

## 🎯 Scoring Rules

### Scalability Boosters (+Points)
- Application Load Balancer (ALB) - +25
- Auto-scaling groups - +20
- Serverless (Lambda) - +15
- ElastiCache/Redis - +15
- API Gateway - +10

### Scalability Penalties (-Points)
- Single EC2 instance - -30
- Monolithic architecture - -20
- No scaling mentioned - -25

### Reliability Boosters (+Points)
- Multi-AZ deployment - +30
- Read replicas - +20
- RDS with backups - +15
- Health checks - +10

### Security Boosters (+Points)
- WAF enabled - +25
- HTTPS/TLS encryption - +20
- IAM configuration - +20
- VPC with security groups - +20
- KMS/Secrets Manager - +15

### Cost Optimization
- On-demand instances flag as less efficient
- Reserved instances boost cost score
- Spot instances provide savings
- Serverless reduces overall costs
- Right-sizing recommendations

## 🎨 UI/UX Features

### Home Page
- **Hero Section** with animated gradient text
- **Floating Background Elements** with parallax motion
- **Feature Pills** highlighting key capabilities
- **Dual CTA Buttons** for analysis and docs
- **Responsive Design** for all devices

### Analyse Page
- **Large Input Panel** with glassmorphism effect
- **Animated Analyze Button** with loading state
- **Score Counter Animation** (0 → final value)
- **Gradient Progress Bars** with glow effects
- **Breakdown Cards** with hover animations
- **Cost Analysis Section** with savings highlight

## 📁 Project Structure

```
ai-cloud-mentor/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero landing page
│   │   │   └── analyse.jsx       # Main analyzer page
│   │   ├── components/
│   │   │   ├── AnimatedGrid.jsx
│   │   │   ├── GlowCard.jsx
│   │   │   └── CircularScore.jsx
│   │   ├── services/
│   │   │   └── api.js            # API client
│   │   ├── app.jsx               # Router setup
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── backend/
    ├── app.py                    # FastAPI server
    ├── requirements.txt
    └── venv/                     # Virtual environment
```

## 🔧 Configuration

### Backend Environment Variables
No special config needed for local development. Update `API_BASE` in `frontend/src/services/api.js` if running on different port.

### Frontend Build
```bash
npm run build      # Production build
npm run preview    # Preview production build
```

## 🐛 Troubleshooting

### White Screen Issue
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check browser console (F12) for errors
- Ensure backend is running on port 8000

### CORS Errors
- Backend has CORS enabled for all origins
- Check if backend is accessible

### Connection Issues
- Verify backend runs on `http://localhost:8000`
- Check API endpoint in `frontend/src/services/api.js`
- Ensure firewall allows local connections

## 📈 Future Enhancements

- [ ] User authentication and profiles
- [ ] History of analyses
- [ ] Saved architecture designs
- [ ] PDF report generation
- [ ] LLM-powered recommendations
- [ ] Architecture diagram generation
- [ ] Multi-cloud support (Azure, GCP)
- [ ] Real-time collaboration
- [ ] Advanced cost modeling
- [ ] Custom scoring rules

## 📚 Learning Resources

- [AWS Architecture Best Practices](https://aws.amazon.com/architecture/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)

## 📝 License

MIT License - Feel free to use this project for learning and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 💬 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for cloud architects and AWS learners**

*Last Updated: February 2026*


# LinkedIn Profile Plausibility Check

## 🚀 Overview
The **LinkedIn Profile Plausibility Check** is a web application designed to analyze the credibility of a LinkedIn profile based on its publicly available data. The app evaluates followers, connections, engagement levels, and activity patterns to provide an **Overall Credibility Score** and a breakdown of real vs. fake followers.

## Demo 
check the demo [here](https://superlative-frangollo-d58b31.netlify.app/)

## ✨ Features
- **🔍 Profile Analysis** – Users enter a **public LinkedIn profile URL** for evaluation.
- **📊 Dynamic Credibility Score** – Analyzes engagement, connection authenticity, and activity.
- **📈 Real vs. Fake Followers Breakdown** – Uses machine learning-based heuristics to detect fake connections.
- **📅 Engagement & Activity Metrics** – Assesses post frequency, comments, and interaction quality.
- **📄 Professional UI** – Clean, minimal, and LinkedIn-like experience.
- **🖥️ Deployment-ready** – Fully hosted with **Vercel (frontend) and AWS Lambda/Heroku (backend)**.
- **🔗 Monetization-friendly** – Designed for one-time purchase on platforms like Acquire.com.

## 🛠️ Tech Stack
- **Frontend:** React + Next.js + Tailwind CSS
- **Backend:** FastAPI (Python) / Express.js (Node.js)
- **Data Analysis:** Pandas, NumPy, Scikit-learn (for anomaly detection)
- **Deployment:** Vercel (frontend), AWS Lambda / Heroku (backend)
- **Database (Optional):** PostgreSQL / Firebase (for saving past analyses)

## ⚙️ How It Works
1. **Enter a LinkedIn Profile URL** – Paste the **public** LinkedIn profile link in the input field.
2. **Automated Data Fetching** – The backend extracts available public data like:
   - Number of Followers
   - Number of Connections
   - Number of Posts
   - Engagement stats (likes, comments, shares)
3. **Credibility Score Calculation** – The app assigns a **score (0-100%)** based on:
   - Profile Completeness (Image, Bio, Work Experience)
   - Engagement Quality (Likes-to-Follow Ratio, Comment Authenticity)
   - Connection Patterns (Mutuals, Industry Relevance, Suspicious Growth)
4. **Visualization & Insights** – Results are displayed in **charts and tables**, highlighting key credibility factors.
5. **User Decision** – The final report helps users assess the **authenticity of their LinkedIn network**.

## 🔧 Installation & Setup

### **1. Clone the Repository**
```sh
git clone https://github.com/yourusername/LinkedIn-Plausibility-Check.git
cd LinkedIn-Plausibility-Check
```
### **2. Install Dependencies**
### Frontend  
```
sh
cd frontend
npm install
```
### Backend  
```
sh
cd backend
pip install -r requirements.txt  # (For Python/FastAPI) 
npm install  # (For Node.js/Express.js)
```

### **3. Run the Application**
### Start Backend Server  
```
sh
cd backend
uvicorn main:app --reload  # (For FastAPI)
node server.js  # (For Express.js)
```
### Start Frontend
```
sh
cd frontend
npm run dev
```
## ⚠️ Disclaimer  
This application, *LinkedIn Profile Plausibility Check*, is an independent project and is **not affiliated with, endorsed by, or associated with LinkedIn Corporation, Microsoft, or any of their subsidiaries**. All trademarks, registered trademarks, and trade names belong to their respective owners.  

This app has been **created using AI technologies**, including **OpenAI’s GPT-4** for concept generation, **Scikit-learn** for anomaly detection, and **NumPy/Pandas** for data analysis. The **frontend** is developed using **React and Next.js**, while the **backend** is built with **FastAPI (Python) and Express.js (Node.js)**. **Data visualization and scoring models** leverage **Matplotlib, D3.js, and Chart.js**.  

By using this software, you acknowledge that it is **for informational purposes only** and does not guarantee accuracy or compliance with third-party policies, including LinkedIn's terms of service. The **buyer or end-user assumes full responsibility** for its use. 🚀










[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/farshadav/linkedincheck)

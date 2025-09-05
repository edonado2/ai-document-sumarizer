#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up AI Document Summarizer...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Create .env files if they don't exist
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');

if (!fs.existsSync(backendEnvPath)) {
  console.log('📝 Creating backend .env file...');
  fs.copyFileSync(path.join(__dirname, 'backend', 'env.example'), backendEnvPath);
  console.log('✅ Backend .env file created');
} else {
  console.log('✅ Backend .env file already exists');
}

if (!fs.existsSync(frontendEnvPath)) {
  console.log('📝 Creating frontend .env file...');
  fs.copyFileSync(path.join(__dirname, 'frontend', 'env.example'), frontendEnvPath);
  console.log('✅ Frontend .env file created');
} else {
  console.log('✅ Frontend .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Installing backend dependencies...');
  execSync('cd backend && npm install', { stdio: 'inherit' });
  
  console.log('Installing frontend dependencies...');
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  
  console.log('✅ All dependencies installed successfully!');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Final instructions
console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Add your OpenAI API key to backend/.env');
console.log('2. Run "npm run dev" to start both frontend and backend');
console.log('3. Open http://localhost:5173 in your browser');
console.log('\n📚 For detailed instructions, see README.md');
console.log('\nHappy coding! 🚀');



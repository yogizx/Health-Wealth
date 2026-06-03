const fs = require('fs');
const files = [
  'src/assets/pages/Finance.jsx',
  'src/assets/pages/Health.jsx',
  'src/assets/pages/Mindset.jsx',
  'src/assets/pages/Profile.jsx',
  'src/assets/pages/AdminLogin.jsx',
  'src/assets/pages/AdminDashboard.jsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log('Skipping', file);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');

  // Replace wrapper classes
  content = content.replaceAll('bg-[#f0f4ff]', 'bg-slate-50');
  content = content.replaceAll('text-[#111827]', 'text-slate-900');
  
  // Update blue to brand
  content = content.replace(/bg-blue-/g, 'bg-brand-');
  content = content.replace(/text-blue-/g, 'text-brand-');
  content = content.replace(/border-blue-/g, 'border-brand-');
  content = content.replace(/ring-blue-/g, 'ring-brand-');
  content = content.replace(/from-blue-/g, 'from-brand-');
  content = content.replace(/shadow-blue-/g, 'shadow-brand-');

  // Glassmorphism components
  content = content.replaceAll('bg-white/80 backdrop-blur-xl', 'glass-card');
  content = content.replaceAll('bg-white/90 backdrop-blur-md', 'glass-card');
  content = content.replaceAll('bg-white/20 backdrop-blur-sm', 'glass');

  // Fix up specific hardcoded background objects in Finance and Mindset
  const oldBg1 = '<div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-300/20 blur-[120px] rounded-full pointer-events-none"></div>';
  const newBg1 = '<div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-brand-400/20 blur-[120px] rounded-full pointer-events-none"></div>\n      <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/15 blur-[150px] rounded-full pointer-events-none"></div>';
  content = content.replaceAll(oldBg1, newBg1);

  // Fix for another possible string (if the original hasn't been changed yet)
  const oldBg2 = '<div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-300/20 blur-[120px] rounded-full pointer-events-none"></div>';
  content = content.replaceAll(oldBg2, newBg1);

  fs.writeFileSync(file, content);
  console.log('Processed', file);
});

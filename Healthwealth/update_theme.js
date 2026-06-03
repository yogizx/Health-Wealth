const fs = require('fs');

const file = 'src/assets/pages/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Global Backgrounds & Text
content = content.replace(/bg-\[\#070b14\]/g, 'bg-slate-50 relative');
content = content.replace(/text-white/g, 'text-slate-900');
content = content.replace(/bg-\[\#0d1220\]/g, 'bg-white/80 backdrop-blur-2xl');
content = content.replace(/bg-\[\#151d2e\]/g, 'bg-white');

// Borders & Dividers
content = content.replace(/border-white\/\[0\.06\]/g, 'border-white shadow-xl shadow-slate-200/50');
content = content.replace(/border-white\/10/g, 'border-white shadow-md shadow-slate-200/30');
content = content.replace(/border-white\/5/g, 'border-slate-100');
content = content.replace(/divide-white\/\[0\.03\]/g, 'divide-slate-100');

// Subdued Backgrounds
content = content.replace(/bg-white\/5/g, 'bg-white/60 backdrop-blur-md');
content = content.replace(/bg-white\/3/g, 'bg-slate-100/50');
content = content.replace(/bg-white\/10/g, 'bg-white');
content = content.replace(/bg-white\/\[0\.02\]/g, 'bg-slate-50/50');

// Typography Colors
content = content.replace(/text-slate-300/g, 'text-slate-700');
content = content.replace(/text-slate-400/g, 'text-slate-500');
content = content.replace(/hover:text-white/g, 'hover:text-violet-600');

// Insert decorative background elements inside the main wrapper
const mainWrapperStart = '<div className="min-h-screen bg-slate-50 relative text-slate-900 flex overflow-hidden" style={{ fontFamily:"\'DM Sans\',\'Inter\',sans-serif" }}>';
const decorativeBgs = `
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-violet-400/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-sky-400/20 blur-[100px] rounded-full pointer-events-none mix-blend-multiply"></div>
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-emerald-400/10 blur-[90px] rounded-full pointer-events-none mix-blend-multiply"></div>
`;
content = content.replace(/<div className="min-h-screen bg-slate-50 relative text-slate-900 flex overflow-hidden" style=\{\{ fontFamily:"'DM Sans','Inter',sans-serif" \}\}>/, mainWrapperStart + decorativeBgs);

// Fix empty states and small badges text colors
content = content.replace(/text-slate-200/g, 'text-slate-800');

// Fix gradients for cards to be a bit lighter if needed, though they might look okay.
content = content.replace(/from-slate-600 to-slate-700/g, 'from-violet-100 to-violet-200 text-violet-700');

// Update sidebar collapse toggle
content = content.replace(/bg-\[\#1a2235\]/g, 'bg-white text-slate-600');

fs.writeFileSync(file, content);
console.log('AdminDashboard theme converted');

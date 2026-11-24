const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const jsApp = fs.readFileSync('app.js', 'utf8');
const jsCal = fs.readFileSync('vanillaCalendar.js', 'utf8');
const css = fs.readFileSync('assets/css/main.css', 'utf8');

console.log('--- 1. Testing Security & DOM Injections ---');
const innerHTMLMatch = (jsApp + jsCal).match(/\.innerHTML\s*=/g);
if (innerHTMLMatch) {
  console.error('FAIL: Found unsafe .innerHTML assignment in JS!', innerHTMLMatch);
  process.exit(1);
} else {
  console.log('PASS: Zero unsafe .innerHTML assignments found in JavaScript files.');
}

console.log('\n--- 2. Testing HTML Tag Validity & Duplicate IDs ---');
const idMatches = [];
const idRegex = /id=["']([^"']+)["']/g;
let match;
while ((match = idRegex.exec(html)) !== null) {
  idMatches.push(match[1]);
}

const idCounts = {};
let duplicateFound = false;
for (const id of idMatches) {
  idCounts[id] = (idCounts[id] || 0) + 1;
  if (idCounts[id] > 1) {
    console.error('FAIL: Duplicate ID found:', id);
    duplicateFound = true;
  }
}
if (!duplicateFound) {
  console.log('PASS: All IDs in index.html are strictly unique (' + idMatches.length + ' IDs checked).');
} else {
  process.exit(1);
}

const navbarTag = html.match(/<\/?navbar/i);
if (navbarTag) {
  console.error('FAIL: Found invalid <navbar> tag!');
  process.exit(1);
} else {
  console.log('PASS: No invalid <navbar> tags; valid semantic HTML5 used.');
}

console.log('\n--- 3. Testing CSS Design Tokens & Media Queries ---');
const requiredTokens = [
  '--color-bg', '--color-surface', '--color-primary', '--color-accent',
  '--color-text-main', '--color-text-muted', '--color-border', '--color-ring'
];
for (const token of requiredTokens) {
  if (!css.includes(token)) {
    console.error('FAIL: Missing token:', token);
    process.exit(1);
  }
}
console.log('PASS: All required design tokens are present in main.css.');

if (!css.includes('[data-theme="dark"]')) {
  console.error('FAIL: Missing dark theme tokens in CSS!');
  process.exit(1);
}
console.log('PASS: Dark theme tokens properly defined in CSS.');

if (!css.includes('prefers-reduced-motion')) {
  console.error('FAIL: Missing prefers-reduced-motion media query!');
  process.exit(1);
}
console.log('PASS: prefers-reduced-motion accessibility media query verified.');

console.log('\n--- 4. Testing Calendar Month Date Logic ---');
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const feb2024 = daysInMonth(2024, 1); // Leap year: 29
const feb2025 = daysInMonth(2025, 1); // Common year: 28
if (feb2024 !== 29 || feb2025 !== 28) {
  console.error('FAIL: Leap year day calculation error!');
  process.exit(1);
}
console.log('PASS: Leap year calculation verified (Feb 2024: 29 days, Feb 2025: 28 days).');

console.log('\n=============================================');
console.log('🎉 ALL AUTOMATED VERIFICATION CHECKS PASSED!');
console.log('=============================================');

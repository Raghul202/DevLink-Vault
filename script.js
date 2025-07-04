// script.js
// DevLink Vault - All logic for form, preview, theme, and clipboard

const form = document.getElementById('profile-form');
const preview = document.getElementById('markdown-preview');
const copyBtn = document.getElementById('copy-btn');
const techInput = document.getElementById('techInput');
const addTechBtn = document.getElementById('addTechBtn');
const techStackTags = document.getElementById('tech-stack-tags');
const toggleTheme = document.getElementById('toggle-theme');
const themeIcon = document.getElementById('theme-icon');

let techStack = [];

function renderTechTags() {
  techStackTags.innerHTML = '';
  techStack.forEach((tech, idx) => {
    const tag = document.createElement('span');
    tag.className = 'bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1';
    tag.innerHTML = `${tech} <button type="button" class="ml-1 text-red-500 hover:text-red-700" title="Remove" onclick="removeTech(${idx})">&times;</button>`;
    techStackTags.appendChild(tag);
  });
}

window.removeTech = function(idx) {
  techStack.splice(idx, 1);
  renderTechTags();
  updatePreview();
};

function addTech() {
  const val = techInput.value.trim();
  if (val && !techStack.includes(val)) {
    techStack.push(val);
    techInput.value = '';
    renderTechTags();
    updatePreview();
  }
}

addTechBtn.addEventListener('click', addTech);
techInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTech();
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  updatePreview();
});

function getBadgeMarkdown(label, value, color, logo, url) {
  return `[![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(value)}-${color}?style=for-the-badge&logo=${logo})](${url})`;
}

function getSkillBadge(skill) {
  // Try to map some common skills to shields logos/colors
  const map = {
    'JavaScript': { color: 'F7DF1E', logo: 'javascript', logoColor: 'black', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    'TypeScript': { color: '3178C6', logo: 'typescript', logoColor: 'white', url: 'https://www.typescriptlang.org/' },
    'React': { color: '20232A', logo: 'react', logoColor: '61DAFB', url: 'https://reactjs.org' },
    'Python': { color: '3776AB', logo: 'python', logoColor: 'white', url: 'https://python.org' },
    'HTML': { color: 'E34F26', logo: 'html5', logoColor: 'white', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
    'CSS': { color: '1572B6', logo: 'css3', logoColor: 'white', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
    'Node.js': { color: '339933', logo: 'node.js', logoColor: 'white', url: 'https://nodejs.org' },
    'Vue': { color: '4FC08D', logo: 'vue.js', logoColor: 'white', url: 'https://vuejs.org' },
    'Angular': { color: 'DD0031', logo: 'angular', logoColor: 'white', url: 'https://angular.io' },
    'Java': { color: '007396', logo: 'java', logoColor: 'white', url: 'https://www.java.com' },
    'C++': { color: '00599C', logo: 'cplusplus', logoColor: 'white', url: 'https://isocpp.org' },
    'C#': { color: '239120', logo: 'csharp', logoColor: 'white', url: 'https://docs.microsoft.com/en-us/dotnet/csharp/' },
    'Go': { color: '00ADD8', logo: 'go', logoColor: 'white', url: 'https://golang.org' },
    'PHP': { color: '777BB4', logo: 'php', logoColor: 'white', url: 'https://www.php.net' },
    'Django': { color: '092E20', logo: 'django', logoColor: 'white', url: 'https://www.djangoproject.com/' },
    'Flask': { color: '000000', logo: 'flask', logoColor: 'white', url: 'https://flask.palletsprojects.com/' },
    'Tailwind CSS': { color: '38B2AC', logo: 'tailwindcss', logoColor: 'white', url: 'https://tailwindcss.com/' },
  };
  const s = map[skill] || { color: 'gray', logo: 'code', logoColor: 'white', url: '#' };
  return `[![${skill}](https://img.shields.io/badge/${encodeURIComponent(skill)}-${s.color}?style=for-the-badge&logo=${s.logo}&logoColor=${s.logoColor})](${s.url})`;
}

function updatePreview() {
  const fullName = form.fullName.value.trim();
  const github = form.github.value.trim();
  const linkedin = form.linkedin.value.trim();
  const portfolio = form.portfolio.value.trim();

  if (!fullName || !github || !linkedin || !portfolio) {
    preview.textContent = 'Fill out the form to generate your Markdown profile card.';
    return;
  }

  let md = `# Hi, I'm ${fullName} 👋\n\n`;
  md += getBadgeMarkdown('GitHub', `@${github}`, '181717', 'github', `https://github.com/${github}`) + '\n';
  md += getBadgeMarkdown('LinkedIn', linkedin.replace(/https:\/\/|www\.|linkedin.com\//g, ''), 'blue', 'linkedin', linkedin) + '\n';
  md += getBadgeMarkdown('Portfolio', portfolio.replace(/https:\/\/|www\./g, ''), '24292e', 'google-chrome', portfolio) + '\n';
  if (techStack.length) {
    md += techStack.map(getSkillBadge).join('\n') + '\n';
  }
  md += '\n';
  md += `![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${github}&show_icons=true&theme=default)\n`;
  md += `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${github}&layout=compact)\n`;

  preview.textContent = md;
}

copyBtn.addEventListener('click', () => {
  const text = preview.textContent;
  if (!text || text.startsWith('Fill out')) return;
  navigator.clipboard.writeText(text).then(() => {
    copyBtn.textContent = 'Copied!';
    setTimeout(() => (copyBtn.textContent = 'Copy Markdown'), 1500);
  });
});

// Theme toggle
function setTheme(dark) {
  document.documentElement.classList.toggle('dark', dark);
  themeIcon.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

toggleTheme.addEventListener('click', () => {
  const isDark = document.documentElement.classList.contains('dark');
  setTheme(!isDark);
});

// On load, set theme from localStorage or system
(function () {
  const userTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(userTheme === 'dark' || (!userTheme && systemDark));
})();

// Initial preview
updatePreview();

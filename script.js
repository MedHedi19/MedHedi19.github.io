const output = document.getElementById("output");
const form = document.getElementById("command-form");
const input = document.getElementById("command-input");
const history = [];
let historyIndex = 0;

let cachedStats = null;

async function fetchGitHubStats() {
  const username = "MedHedi19";
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
    ]);
    const user = await userRes.json();
    let totalStars = 0;
    let totalForks = 0;
    if (reposRes.ok) {
      const repos = await reposRes.json();
      if (Array.isArray(repos)) {
        totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
        totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
      }
    }
    cachedStats = {
      username: user.login || username,
      public_repos: user.public_repos ?? 0,
      totalStars,
      totalForks,
      followers: user.followers ?? 0,
      following: user.following ?? 0
    };
    return cachedStats;
  } catch (error) {
    console.error("GitHub API error:", error);
    return cachedStats || {
      username,
      public_repos: 0,
      totalStars: 0,
      totalForks: 0,
      followers: 0,
      following: 0
    };
  }
}

// Pre-fetch in background
fetchGitHubStats();

const commands = {
  help() {
    return `<div class="output-title">Available commands</div>
      <ul>
        <li><b>about</b> — who I am</li>
        <li><b>skills</b> — technologies and areas I work with</li>
        <li><b>projects</b> — selected projects</li>
        <li><b>github</b> — live GitHub statistics</li>
        <li><b>education</b> — academic background</li>
        <li><b>contact</b> — ways to reach me</li>
        <li><b>social</b> — GitHub and LinkedIn</li>
        <li><b>clear</b> — clear the terminal</li>
        <li><b>banner</b> — show the welcome message</li>
      </ul>`;
  },
  about() {
    return `<div class="output-title">About me</div>
      <p>I'm Mohamed Hedi Ben Salah, a cybersecurity and cloud computing engineering student at ESPRIT.</p>
      <p>I'm interested in building secure systems, investigating threats, ethical hacking, and exploring cloud infrastructure.</p>`;
  },
  skills() {
    return `<div class="output-title">Skills & technologies</div>
      <p><b>Security Operations:</b> Wazuh, pfSense, OpenVPN, MITRE ATT&CK, MISP, TheHive, Cortex, Shuffle, Suricata, Active Directory, Keycloak, Snort, SIEM, SOAR, Threat Hunting</p>
      <p><b>Offensive Security:</b> Metasploit, Burp Suite, Hydra, BeEF, Nmap, Wireshark, Penetration Testing</p>
      <p><b>Tools & Platforms:</b> Docker, Kubernetes, Jenkins, Terraform, Git, GitHub, GitLab, Linux, Azure, AWS</p>
      <p><b>Development & Languages:</b> Python, Java, JavaScript, Node.js, React, SQL</p>`;
  },
  projects() {
    return `< div class="output-title" > Selected projects</div >
      <p><i>🛡️ Not everything makes it into public repositories. Some projects are built for real-world challenges, and the most interesting work isn't always visible.</i></p>
      <p><b>Notable Work & Deployments:</b></p>
      <ul>
        <li><b>Banking Threat Hunting & Intelligence Ecosystem</b> — Wazuh, Shuffle, MISP, network monitoring and security automation.</li>
        <li><b>IDS/IPS Management Platform</b> — NestJS, MySQL, Wazuh API and Suricata integration.</li>
        <li><b>Hosted Mobile Application (Android & iOS)</b> — Production-ready cross-platform mobile application, deployed and live on both Android and iOS app stores.</li>
        <li><b>IAM Integration</b> — Keycloak, MidPoint and Active Directory.</li>
        <li><b>Cloud & Server Labs</b> — cloud infrastructure, Linux administration and deployment practice.</li>
      </ul>
      <p class="muted">Add your repository URLs in script.js when you're ready.</p>`;
  },
  async github() {
    const stats = cachedStats || await fetchGitHubStats();
    return `<div class="github-stats">
  <div class="stats-title">GITHUB STATISTICS</div>
  <div class="stats-line">------------------------------</div>
  <div>Username: <span>${stats.username}</span></div>
  <div>Repositories: <span>${stats.public_repos}</span></div>
  <div>Total Stars: <span>${stats.totalStars}</span></div>
  <div>Total Forks: <span>${stats.totalForks}</span></div>
  <div>Followers: <span>${stats.followers}</span></div>
  <div>Following: <span>${stats.following}</span></div>
  <div class="stats-line">------------------------------</div>
</div >
  <p>Profile: <a href="https://github.com/MedHedi19" target="_blank" rel="noreferrer">https://github.com/MedHedi19</a></p>`;
  },
  education() {
    return `<div class="output-title">Education</div>
      <p><b>ESPRIT</b> — Engineering studies in Cybersecurity (NIDS).</p>
      <p><b>ISIMA</b> — Bachelor's degree in Computer Science, 2021–2024.</p>
      <p class="muted">Review dates and wording before publishing.</p>`;
  },
  contact() {
    return `< div class="output-title" > Contact</div >
      <p>Email: <a href="mailto:YOUR_EMAIL@example.com">YOUR_EMAIL@example.com</a></p>
      <p>LinkedIn: <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">Add your LinkedIn profile URL</a></p>
      <p>GitHub: <a href="https://github.com/MedHedi19" target="_blank" rel="noreferrer">github.com/MedHedi19</a></p>`;
  },
  social() {
    return `<div class="output-title">Find me online</div>
      <p>GitHub: <a href="https://github.com/MedHedi19" target="_blank" rel="noreferrer">github.com/MedHedi19</a></p>
      <p>LinkedIn: <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">Add your LinkedIn URL</a></p>`;
  },
  banner() {
    return `<p>Welcome to my terminal portfolio. Type <span class="accent">help</span> to explore.</p>`;
  }
};

async function runCommand(raw) {
  const value = raw.trim();
  if (!value) return;
  history.push(value);
  historyIndex = history.length;
  const command = value.toLowerCase().split(/\s+/)[0];
  if (command === "clear") {
    output.innerHTML = "";
    return;
  }
  const result = commands[command];
  const block = document.createElement("div");
  block.className = "output-block";
  const safeCommand = value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let content = "";
  if (result) {
    const res = result();
    content = res instanceof Promise ? await res : res;
  } else {
    content = `<p>Command not found: <b>${safeCommand}</b>. Type <span class="accent">help</span> to see available commands.</p>`;
  }

  block.innerHTML = `<div><span class="user">visitor</span><span class="at">@</span><span class="host">medhedi19.github.io</span><span class="path">:~$ ${safeCommand}</span></div>` + content;
  output.appendChild(block);
  input.scrollIntoView({ block: "nearest" });
}

form.addEventListener("submit", event => {
  event.preventDefault();
  runCommand(input.value);
  input.value = "";
});

document.querySelectorAll("[data-command]").forEach(button => {
  button.addEventListener("click", () => {
    runCommand(button.dataset.command);
    input.focus();
  });
});

input.addEventListener("keydown", event => {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (historyIndex > 0) input.value = history[--historyIndex];
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    if (historyIndex < history.length - 1) input.value = history[++historyIndex];
    else { historyIndex = history.length; input.value = ""; }
  } else if (event.key === "Tab") {
    event.preventDefault();
    const typed = input.value.trim().toLowerCase();
    const match = Object.keys(commands).find(command => command.startsWith(typed));
    if (match) input.value = match;
  }
});

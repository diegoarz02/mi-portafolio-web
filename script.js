const GITHUB_USERNAME = 'diegoarz02';
const API_URL_REPOS = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`;
const API_URL_PROFILE = `https://api.github.com/users/${GITHUB_USERNAME}`;

document.addEventListener('DOMContentLoaded', () => {
    // Set Current Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Fetch and render data
    fetchProfileData();
    fetchRepositories();
});

async function fetchProfileData() {
    try {
        const response = await fetch(API_URL_PROFILE);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        
        const statsHtml = `
            <div class="stat-card">
                <h3>${data.public_repos}</h3>
                <p>Repositorios</p>
            </div>
            <div class="stat-card">
                <h3>${data.followers}</h3>
                <p>Seguidores</p>
            </div>
        `;
        document.getElementById('github-stats').innerHTML = statsHtml;
    } catch (error) {
        console.error('Error fetching profile:', error);
        document.getElementById('github-stats').innerHTML = `
            <div class="stat-card">
                <h3>8+</h3>
                <p>Repositorios</p>
            </div>
            <div class="stat-card">
                <h3>Data</h3>
                <p>Curiosity</p>
            </div>
        `;
    }
}

async function fetchRepositories() {
    const loader = document.getElementById('loader');
    const container = document.getElementById('projects-container');
    
    try {
        const response = await fetch(API_URL_REPOS);
        if (!response.ok) throw new Error('Failed to fetch repos');
        
        const repos = await response.json();
        loader.style.display = 'none';
        
        if (repos.length === 0) {
            container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-muted);">Aún no hay repositorios públicos.</p>';
            return;
        }

        // Filter out forks if desired, or just show all. 
        // We show them sorted by recently updated
        const reposHtml = repos.map(repo => createProjectCard(repo)).join('');
        container.innerHTML = reposHtml;

    } catch (error) {
        console.error('Error fetching repositories:', error);
        loader.style.display = 'none';
        container.innerHTML = `
            <div style="text-align: center; grid-column: 1/-1; color: var(--secondary);">
                <p>Error al cargar los proyectos desde GitHub.</p>
                <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="btn-primary" style="margin-top: 1rem;">Visitar mi GitHub directamente</a>
            </div>
        `;
    }
}

function createProjectCard(repo) {
    // Determine language color class
    let langClass = '';
    let languageDisplay = repo.language || 'Markdown';
    if (languageDisplay.includes('Jupyter')) langClass = 'lang-Jupyter';
    else if (languageDisplay.includes('Python')) langClass = 'lang-Python';
    else langClass = ''; // default

    // Description fallback
    const description = repo.description ? repo.description : 'Un proyecto interesante de Ciencia de Datos / Desarrollo alojado en GitHub.';
    
    // Project Icon (SVG folder/code)
    const folderIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
    const linkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
    const starIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    const forkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18H7a2 2 0 0 1-2-2V6"></path><circle cx="5" cy="4" r="2"></circle><circle cx="5" cy="20" r="2"></circle><circle cx="19" cy="4" r="2"></circle><polyline points="14 9 19 4 24 9"></polyline></svg>`;

    return `
        <div class="project-card">
            <div class="project-header">
                <div class="project-icon">
                    ${folderIcon}
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" title="Ver en GitHub">
                        ${linkIcon}
                    </a>
                </div>
            </div>
            <h3 class="project-title">${repo.name.replace(/-/g, ' ')}</h3>
            <p class="project-description">${description}</p>
            
            <div class="project-footer">
                <div class="project-language">
                    <span class="language-dot ${langClass}"></span>
                    <span>${languageDisplay}</span>
                </div>
                <div class="project-stats">
                    ${repo.stargazers_count > 0 ? `<span>${starIcon} ${repo.stargazers_count}</span>` : ''}
                    ${repo.forks_count > 0 ? `<span>${forkIcon} ${repo.forks_count}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

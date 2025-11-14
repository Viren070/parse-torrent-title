import { parseTorrentTitle } from 'https://cdn.jsdelivr.net/npm/@viren070/parse-torrent-title@latest/dist/index.js';

// Field categories with icons
const categories = {
    basic: {
        title: 'Basic Information',
        icon: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
        fields: ['title', 'year', 'date']
    },
    video: {
        title: 'Video Quality',
        icon: '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>',
        fields: ['resolution', 'quality', 'codec', 'bitDepth', 'hdr', 'threeD']
    },
    audio: {
        title: 'Audio',
        icon: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>',
        fields: ['audio', 'channels']
    },
    episodes: {
        title: 'Episodes & Seasons',
        icon: '<rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline>',
        fields: ['seasons', 'episodes', 'episodeCode', 'complete', 'volumes']
    },
    languages: {
        title: 'Languages',
        icon: '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
        fields: ['languages', 'dubbed', 'subbed', 'hardcoded']
    },
    release: {
        title: 'Release Info',
        icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
        fields: ['group', 'site', 'network', 'edition', 'releaseTypes']
    },
    flags: {
        title: 'Release Flags',
        icon: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>',
        fields: ['repack', 'proper', 'retail', 'remastered', 'unrated', 'uncensored', 'extended', 'convert', 'documentary', 'commentary', 'upscaled']
    },
    technical: {
        title: 'Technical Details',
        icon: '<rect x="2" y="6" width="20" height="12" rx="2"></rect><line x1="6" y1="10" x2="6" y2="10"></line><line x1="10" y1="10" x2="10" y2="10"></line>',
        fields: ['container', 'extension', 'region', 'size']
    }
};

// Format field value for display
function formatValue(value) {
    if (Array.isArray(value)) {
        return `<div class="field-value array">${value.map(v => `<span>${v}</span>`).join('')}</div>`;
    } else if (typeof value === 'boolean') {
        return `<div class="field-value boolean">✓ ${value ? 'Yes' : 'No'}</div>`;
    } else if (typeof value === 'number') {
        return `<div class="field-value number">${value}</div>`;
    } else {
        return `<div class="field-value">${value}</div>`;
    }
}

// Render parsed result
function renderOutput(result) {
    const outputDiv = document.getElementById('output');
    const jsonCode = document.getElementById('json-code');
    
    // Update JSON output
    jsonCode.textContent = JSON.stringify(result, null, 2);
    
    // If no fields parsed
    if (Object.keys(result).length === 0) {
        outputDiv.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <p>No metadata could be extracted from this filename</p>
            </div>
        `;
        return;
    }
    
    // Group fields by category
    let html = '';
    for (const [categoryKey, category] of Object.entries(categories)) {
        const categoryFields = category.fields.filter(field => result[field] !== undefined);
        
        if (categoryFields.length === 0) continue;
        
        html += `
            <div class="field-category">
                <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${category.icon}
                    </svg>
                    ${category.title}
                </h3>
                <div class="field-grid">
                    ${categoryFields.map(field => `
                        <div class="field-item">
                            <div class="field-label">${field}</div>
                            ${formatValue(result[field])}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    outputDiv.innerHTML = html;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Parse and update
const parseInput = debounce((value) => {
    if (!value.trim()) {
        renderOutput({});
        return;
    }
    
    try {
        const result = parseTorrentTitle(value);
        renderOutput(result);
    } catch (error) {
        console.error('Parse error:', error);
        renderOutput({});
    }
}, 300);

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const copyBtn = document.getElementById('copy-btn');
    const exampleBtns = document.querySelectorAll('.example-btn');
    
    // Input handling
    input.addEventListener('input', (e) => {
        parseInput(e.target.value);
    });
    
    // Example buttons
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const example = btn.dataset.example;
            input.value = example;
            parseInput(example);
        });
    });
    
    // Copy JSON button
    copyBtn.addEventListener('click', async () => {
        const jsonCode = document.getElementById('json-code');
        try {
            await navigator.clipboard.writeText(jsonCode.textContent);
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Copied!
            `;
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy JSON
                `;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
});

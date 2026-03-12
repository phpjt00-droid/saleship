const fs = require('fs');
const homeFile = 'src/views/Home.css';
const boardFile = 'src/views/Board.css';

let homeCss = fs.readFileSync(homeFile, 'utf8');
let boardCss = fs.readFileSync(boardFile, 'utf8');

// Home.css Cleanup
const homeTargets = [
  `.hot-card {
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}`,
  `.hot-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  border-color: var(--accent-primary);
}`,
  `[data-theme='dark'] .hot-card {
  background: var(--bg-secondary);
  border-color: rgba(255, 255, 255, 0.05);
}`,
  `.hot-card__image-wrap {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}`,
  `.hot-card__content {
  padding: 24px;
}`,
  `.hot-card__store {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 12px;
}`,
  `.hot-card__title {
  font-size: 1.25rem;
  font-weight: 850;
  line-height: 1.4;
  margin-bottom: 24px;
  height: 3.5rem;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`,
  `.hot-card__title a {
  text-decoration: none;
  color: inherit;
  transition: color 0.3s ease;
}`,
  `.hot-card__title a:hover {
  color: var(--accent-primary);
}`,
  `.hot-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}`,
  `[data-theme='dark'] .hot-card__footer {
  border-color: rgba(255, 255, 255, 0.1);
}`,
  `.hot-card__author {
  display: flex;
  align-items: center;
  gap: 12px;
}`,
  `.hot-card__author-avatar {
  width: 38px;
  height: 38px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 4px solid #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}`,
  `[data-theme='dark'] .hot-card__author-avatar {
  background: #1e293b;
  border-color: #0f172a;
}`,
  `.hot-card__author-info {
  display: flex;
  flex-direction: column;
}`,
  `.hot-card__author-name {
  font-size: 0.9rem;
  font-weight: 800;
}`,
  `.hot-card__date {
  font-size: 0.75rem;
  color: var(--text-muted);
}`,
  `.hot-card__stats {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
}`,
  `.hot-card__stats span {
  display: flex;
  align-items: center;
  gap: 6px;
}`,
  `/* Card Image Area */`
];

let homeChanged = false;
for (const target of homeTargets) {
    if (homeCss.includes(target)) {
        homeCss = homeCss.replace(target, '');
        homeChanged = true;
    }
}
if (homeChanged) fs.writeFileSync(homeFile, homeCss, 'utf8');

// Board.css Cleanup
const boardTargets = [
    `.board__post-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  height: 100%;
}`,
    `.board__post-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  background: var(--bg-secondary);
  border-color: var(--accent-primary);
}`,
    `.board__post-thumbnail {
  width: 100%;
  height: 180px;
  overflow: hidden;
}`,
    `.board__post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}`,
    `.board__post-card:hover .board__post-thumbnail img {
  transform: scale(1.05);
}`,
    `.board__post-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}`,
    `.board__post-card--list .board__post-top {
  flex-shrink: 0;
  min-width: 100px;
}`,
    `.board__post-card--list .board__post-title {
  flex: 1;
  -webkit-line-clamp: 1;
}`,
    `.board__post-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}`,
    `.board__post-category {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: var(--bg-tertiary);
  color: var(--accent-primary);
  border: 1px solid var(--border-color);
}`,
    `.board__post-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--text-muted);
}`,
    `.board__post-title {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`,
    `.board__post-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}`,
    `.board__post-author {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}`,
    `.board__post-avatar {
  font-size: 1.1rem;
}`,
    `.board__post-stats {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: var(--text-muted);
}`,
    `.board__post-stats span {
  display: flex;
  align-items: center;
  gap: 3px;
}`
];

let boardChanged = false;
for (const target of boardTargets) {
    if (boardCss.includes(target)) {
        boardCss = boardCss.replace(target, '');
        boardChanged = true;
    }
}
if (boardChanged) fs.writeFileSync(boardFile, boardCss, 'utf8');

console.log('CSS Cleanup completed.');

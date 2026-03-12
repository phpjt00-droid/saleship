const fs = require('fs');
const file = 'src/views/Board.jsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `                {viewMode === 'grid' && (
                  <div className="board__post-thumbnail relative overflow-hidden rounded-t-2xl">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    {/* 할인율 뱃지 (좌상단) */}
                    {post.discount && (
                      <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 transition-transform group-hover:scale-110">
                        {post.discount}
                      </div>
                    )}
                    {/* 북마크 버튼 (우상단) */}
                    <button 
                      className={\`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 \${bookmarks.has(post.id.toString()) ? 'bg-amber-400 text-white' : 'bg-slate-900/40 text-white hover:bg-slate-900/60'}\`}
                      onClick={(e) => handleBookmarkToggle(e, post.id)}
                    >
                      <Bookmark size={14} fill={bookmarks.has(post.id.toString()) ? "currentColor" : "none"} />
                    </button>
                  </div>
                )}`;

const replacement1 = `                {viewMode === 'grid' && (
                  <div className="relative w-full h-52 overflow-hidden bg-slate-50 dark:bg-slate-800/80 shrink-0">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {/* 할인율 뱃지 (좌상단) */}
                    {post.discount && (
                      <div className="absolute top-3 left-3 bg-rose-500/95 backdrop-blur-sm text-white text-[11px] font-black px-2.5 py-1 rounded-sm shadow-lg z-10">
                        {post.discount}
                      </div>
                    )}
                    {/* 북마크 버튼 (우상단) */}
                    <button 
                      className={\`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all z-20 shadow-sm \${bookmarks.has(post.id.toString()) ? 'bg-amber-400 text-white' : 'bg-slate-900/30 text-white hover:bg-slate-900/60'}\`}
                      onClick={(e) => handleBookmarkToggle(e, post.id)}
                    >
                      <Bookmark size={14} fill={bookmarks.has(post.id.toString()) ? "currentColor" : "none"} />
                    </button>
                  </div>
                )}`;

const target2 = `                <div className="board__post-info p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase border border-slate-200">{post.store}</span>
                      <span className="text-[10px] font-medium text-slate-400">{post.shipping}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} />{post.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-3 h-10 leading-snug group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-lg font-black text-slate-900">{post.currentPrice}</span>
                      {post.originalPrice && (
                        <span className="text-xs text-slate-400 line-through decoration-slate-300">{post.originalPrice}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <span className="text-sm">{post.avatar}</span>
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><Eye size={12} />{post.views.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Heart size={12} fill={post.likes > 0 ? "currentColor" : "none"} />{post.likes.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><MessageSquare size={12} />{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>`;

const replacement2 = `                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md uppercase border border-slate-200 dark:border-slate-600 shadow-sm">{post.store}</span>
                       <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1"><MapPin size={10} />{post.shipping}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} />{post.date}</span>
                  </div>

                  <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100 line-clamp-2 mb-4 h-11 leading-snug group-hover:text-amber-500 transition-colors">
                    {post.title}
                  </h3>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">{post.currentPrice}</span>
                      {post.originalPrice && (
                        <span className="text-sm font-medium text-slate-400 line-through decoration-slate-300 dark:decoration-slate-500">{post.originalPrice}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <span className="text-sm">{post.avatar}</span>
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5"><Eye size={12} />{post.views.toLocaleString()}</span>
                        <button className={\`flex items-center gap-1.5 transition-colors \${post.likes > 0 ? 'text-blue-500 font-bold' : 'hover:text-blue-500'}\`}>
                           <Heart size={12} fill={post.likes > 0 ? "currentColor" : "none"} />{post.likes.toLocaleString()}
                        </button>
                        <span className="flex items-center gap-1.5"><MessageSquare size={12} />{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>`;

const target3 = `className={\`board__post-card animate-fadeInUp \${viewMode === 'list' ? 'board__post-card--list' : ''}\`}`;
const replacement3 = `className={\`animate-fadeInUp group relative block h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden cursor-pointer transition-all duration-300 \${viewMode === 'list' ? 'board__post-card--list' : 'hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:border-orange-500'}\`}`;

let changed = false;
if(content.includes(target1)) { content = content.replace(target1, replacement1); changed = true; }
if(content.includes(target2)) { content = content.replace(target2, replacement2); changed = true; }
if(content.includes(target3)) { content = content.replace(target3, replacement3); changed = true; }

if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully updated Board.jsx');
} else {
    console.log('Target string not found in Board.jsx');
}

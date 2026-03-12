const fs = require('fs');
const file = 'src/views/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = `              filteredAndSortedDeals.map((deal, i) => (
                <div key={deal.id} className="hot-card animate-fadeInUp group cursor-pointer" style={{ animationDelay: \`\${i * 0.1}s\` }}>
                  <Link href={\`/post/\${deal.id}\`} className="block h-full flex flex-col">
                    <div className="hot-card__image-wrap relative overflow-hidden h-48">
                      <Image 
                        src={deal.image} 
                        alt={deal.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="hot-card__image object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                      
                      {/* 할인율 뱃지 (좌상단) */}
                      <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 transition-transform group-hover:scale-110">
                        {deal.discount}
                      </div>

                      {/* 북마크 버튼 추가 */}
                      <button 
                        className={\`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all z-20 \${bookmarks.has(deal.id.toString()) ? 'bg-amber-400 text-white' : 'bg-slate-900/40 text-white hover:bg-slate-900/60'}\`}
                        onClick={(e) => handleBookmarkToggle(e, deal.id)}
                      >
                        <Bookmark size={12} fill={bookmarks.has(deal.id.toString()) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    
                    <div className="hot-card__content p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase border border-slate-200">{deal.store}</span>
                         <span className="text-[10px] text-slate-400 ml-auto">{deal.shipping}</span>
                      </div>

                      <h3 className="hot-card__title text-sm font-bold text-slate-900 line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 transition-colors h-10">
                        {deal.title}
                      </h3>

                      <div className="mt-auto">
                        <div className="flex items-baseline gap-1.5 mb-3">
                          <span className="text-lg font-black text-slate-900">{deal.currentPrice}</span>
                          {deal.originalPrice && (
                            <span className="text-xs text-slate-400 line-through decoration-slate-300">{deal.originalPrice}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-[10px] text-slate-400">
                          <div className="flex items-center gap-3">
                            <button 
                              className={\`flex items-center gap-1 transition-colors hover:text-blue-500 \${userLikes.has(deal.id.toString()) ? 'text-blue-500 font-bold' : ''}\`}
                              onClick={(e) => handleLikeToggle(e, deal.id)}
                            >
                              <ThumbsUp size={10} fill={userLikes.has(deal.id.toString()) ? "currentColor" : "none"} /> 
                              {deal.upvotes}
                            </button>
                            <span className="flex items-center gap-1"><MessageSquare size={10} /> {deal.comments}</span>
                          </div>
                          <span className="flex items-center gap-1"><Eye size={10} /> {deal.views}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))`;

const replacement = `              filteredAndSortedDeals.map((deal, i) => (
                <Link 
                  href={\`/post/\${deal.id}\`} 
                  key={deal.id} 
                  className="animate-fadeInUp group relative block h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:border-orange-500" 
                  style={{ animationDelay: \`\${i * 0.1}s\` }}
                >
                    <div className="relative w-full h-52 overflow-hidden bg-slate-50 dark:bg-slate-800/80 shrink-0">
                      <Image 
                        src={deal.image} 
                        alt={deal.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      
                      {/* 할인율 뱃지 (좌상단) */}
                      {deal.discount && (
                        <div className="absolute top-3 left-3 bg-rose-500/95 backdrop-blur-sm text-white text-[11px] font-black px-2.5 py-1 rounded-sm shadow-lg z-10">
                          {deal.discount}
                        </div>
                      )}

                      {/* 북마크 버튼 추가 */}
                      <button 
                        className={\`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all z-20 shadow-sm \${bookmarks.has(deal.id.toString()) ? 'bg-amber-400 text-white' : 'bg-slate-900/30 text-white hover:bg-slate-900/60'}\`}
                        onClick={(e) => handleBookmarkToggle(e, deal.id)}
                      >
                        <Bookmark size={14} fill={bookmarks.has(deal.id.toString()) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2.5">
                         <span className="text-[10px] font-bold text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md uppercase border border-slate-200 dark:border-slate-600 shadow-sm">{deal.store}</span>
                         <span className="text-[11px] font-medium text-slate-400 ml-auto flex items-center gap-1"><MapPin size={10} />{deal.shipping}</span>
                      </div>

                      <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100 line-clamp-2 mb-4 leading-snug group-hover:text-blue-600 dark:group-hover:text-amber-500 transition-colors h-11">
                        {deal.title}
                      </h3>

                      <div className="mt-auto">
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">{deal.currentPrice}</span>
                          {deal.originalPrice && (
                            <span className="text-sm font-medium text-slate-400 line-through decoration-slate-300 dark:decoration-slate-500">{deal.originalPrice}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-700/50 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                          <div className="flex items-center gap-3">
                            <button 
                              className={\`flex items-center gap-1.5 transition-colors hover:text-blue-500 \${userLikes.has(deal.id.toString()) ? 'text-blue-500 font-bold' : ''}\`}
                              onClick={(e) => handleLikeToggle(e, deal.id)}
                            >
                              <ThumbsUp size={12} fill={userLikes.has(deal.id.toString()) ? "currentColor" : "none"} /> 
                              {deal.upvotes.toLocaleString()}
                            </button>
                            <span className="flex items-center gap-1.5"><MessageSquare size={12} /> {deal.comments.toLocaleString()}</span>
                          </div>
                          <span className="flex items-center gap-1.5"><Eye size={12} /> {typeof deal.views === 'number' ? deal.views.toLocaleString() : deal.views}</span>
                        </div>
                      </div>
                    </div>
                </Link>
              ))`;

if(content.includes(target)) {
    fs.writeFileSync(file, content.replace(target, replacement), 'utf8');
    console.log('Successfully updated Home.jsx');
} else {
    console.log('Target string not found in Home.jsx');
}

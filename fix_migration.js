import { createClient } from '@supabase/supabase-js';
import { Parser } from 'xml2js';
import dotenv from 'dotenv';
dotenv.config({ path: '.local.env' }); // try both names just in case
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function decodeHtml(html) {
    if (!html) return '';
    return html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&');
}

async function run() {
    const rssUrl = 'https://rss.blog.naver.com/saleship?rv=2.0&count=1000';
    console.log(`Fetching RSS...`);
    
    const res = await fetch(rssUrl);
    const xml = await res.text();
    
    const parser = new Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xml);
    let items = result.rss.channel.item || [];
    if (!Array.isArray(items)) items = [items];

    const posts = items.map(item => {
        const desc = decodeHtml(item.description);
        const imgMatch = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
        let imageUrl = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=800';
        
        imageUrl = imageUrl.split('"')[0].split("'")[0].split(' ')[0];

        // Surgical replacement for Naver w800
        const originalUrl = imageUrl;
        if (imageUrl.includes('naver.net') || imageUrl.includes('pstat.net')) {
            if (imageUrl.includes('type=')) {
                imageUrl = imageUrl.replace(/type=[^&?#\s"'>]+/, 'type=w800');
            } else {
                imageUrl += (imageUrl.includes('?') ? '&' : '?') + 'type=w800';
            }
        }
        
        if (originalUrl !== imageUrl) {
            console.log(`[FIXED] ${imageUrl}`);
        }

        const storeMatch = item.title.match(/\[(.*?)\/(.*?)\]/) || item.title.match(/\[(.*?)\]/);
        const store = storeMatch ? storeMatch[1].trim() : '세일쉽';

        return {
            title: item.title,
            content: desc.replace(/<img.*?>/g, '').trim(),
            category: item.category || '기타',
            store: store,
            date: new Date(item.pubDate).toISOString(),
            timestamp: new Date(item.pubDate).getTime(),
            image: imageUrl,
            link: item.link,
            views: (Math.floor(Math.random() * 5000) + 1000).toString(),
            likes: Math.floor(Math.random() * 200),
            comments: Math.floor(Math.random() * 50),
            price_info: {
                currentPrice: '특가 확인',
                originalPrice: '세일 중',
                discount: '핫딜'
            }
        };
    });

    console.log(`Upserting ${posts.length} posts...`);
    const { error } = await supabase.from('posts').upsert(posts, { onConflict: 'link' });
    if (error) console.error('Supabase Error:', error);
    else console.log('Successfully completed high-res migration.');
}

run();

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { Parser } from 'xml2js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function importBlog() {
  console.log('--- Naver Blog Migration Debug ---');
  console.log(`URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  
  try {
    const rssUrl = 'https://rss.blog.naver.com/saleship?rv=2.0&count=1000';
    console.log(`Fetching RSS from: ${rssUrl}`);
    const response = await fetch(rssUrl);
    
    if (!response.ok) {
      console.error(`HTTP Error: ${response.status} ${response.statusText}`);
      return;
    }

    const xml = await response.text();
    console.log(`Received XML of length: ${xml.length}`);
    
    const parser = new Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xml);
    
    if (!result || !result.rss || !result.rss.channel) {
      console.error('Unexpected RSS structure. Result keys:', Object.keys(result || {}));
      return;
    }

    let items = result.rss.channel.item || [];
    if (!Array.isArray(items)) {
      items = [items];
    }

    console.log(`Found ${items.length} items in RSS feed.`);

    if (items.length === 0) {
      console.log('No posts found to import.');
      return;
    }

    const postsToInsert = items.map(item => {
      const storeMatch = item.title.match(/\[(.*?)\/(.*?)\]/) || item.title.match(/\[(.*?)\]/);
      const store = storeMatch ? (storeMatch[1].trim()) : '세일쉽';
      
      // 이미지 추출 개선: 웅앵웅.jpg?type=w80 형태 또는 일반 URL 추출
      // description에서 첫 번째 img 태그의 src를 찾음 (따옴표 인코딩 대응)
      const description = item.description || '';
      const imgMatch = description.match(/<img[^>]+src=["']?([^"'\s>]+)["']?/i) || 
                       description.match(/&lt;img[^&]+src=&quot;(.*?)&quot;/i);
      let imageUrl = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=800';
      
      // 따옴표나 HTML 엔터티가 섞여있을 경우 정제
      imageUrl = imageUrl.split('&quot;')[0].split('&apos;')[0].split('"')[0].split("'")[0];

      // 고화질 이미지로 변환
      if (imageUrl.match(/type=[a-zA-Z0-9]+/)) {
        imageUrl = imageUrl.replace(/type=[a-zA-Z0-9]+/, 'type=w800');
      } else if (imageUrl.includes('blogthumb.phinf.naver.net') || imageUrl.includes('blogthumb.pstat.net')) {
        // Naver 썸네일 도메인인데 type이 아예 없는 경우
        imageUrl += (imageUrl.includes('?') ? '&' : '?') + 'type=w800';
      }
      const cleanContent = item.description.replace(/<img.*?>/g, '').trim();
      const priceMatch = item.description.match(/([0-9,]+)원/);
      const discountMatch = item.description.match(/(\d+)%/);
      const pubDate = new Date(item.pubDate);
      
      return {
        title: item.title,
        content: cleanContent,
        category: item.category || '기타',
        store: store,
        date: pubDate.toISOString(),
        timestamp: pubDate.getTime(),
        image: imageUrl,
        link: item.link,
        views: (Math.floor(Math.random() * 5000) + 1000).toString(),
        likes: Math.floor(Math.random() * 200),
        comments: Math.floor(Math.random() * 50),
        price_info: {
          currentPrice: priceMatch ? `${priceMatch[1]}원` : '특가 확인',
          originalPrice: '정가 확인 중',
          discount: discountMatch ? `${discountMatch[1]}% 할인` : '핫딜'
        }
      };
    });

    console.log(`Parsed ${postsToInsert.length} posts. Upserting to Supabase...`);

    const { data, error } = await supabase
      .from('posts')
      .upsert(postsToInsert, { onConflict: 'link' });

    if (error) {
      console.error('Supabase Error:', error.message);
      if (error.hint) console.error('Hint:', error.hint);
    } else {
      console.log(`Successfully upserted ${postsToInsert.length} posts to Supabase!`);
    }

  } catch (error) {
    console.error('Migration crashed:', error);
  }
}

importBlog();

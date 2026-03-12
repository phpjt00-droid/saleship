export const categoryMapping: Record<string, string> = {
  '패션': 'fashion',
  '푸드': 'food',
  '뷰티': 'beauty',
  '리빙': 'home',
  '가전': 'electronics',
  '게임': 'game',
  '상품권/이용권': 'ticket',
  '오프라인': 'offline',
  '트렌드': 'trend',
  '꿀팁': 'tips',
  'Q&A': 'qna'
};

export function extractDealInfo(text: string) {
  const result = {
    name: "",
    price: 0,
    store: "기타"
  };
  const storeRegex = /\[(쿠팡|네이버|11번가|G마켓|알리익스프레스|알리|아마존|티몬|위메프)\]/;
  const storeMatch = text.match(storeRegex);
  if (storeMatch) result.store = storeMatch[1];
  const priceRegex = /([\d,]+)원/;
  const priceMatch = text.match(priceRegex);
  if (priceMatch) result.price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
  let name = text;
  if (storeMatch) name = name.replace(storeMatch[0], '');
  name = name.split(/가격\s*[:：]?|가\s*[:：]?|특가\s*[:：]?/)[0];
  name = name.replace(/[\d,]+원?$/, '').trim();
  result.name = name;
  return result;
}

export function calculatePriceMetrics(history: any[]) {
  if (!history || history.length < 2) return null;
  const sorted = [...history].sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));
  const current = sorted[0].price;
  const previous = sorted[1].price;
  const diff = current - previous;
  const rate = previous > 0 ? Math.round((diff / previous) * 100) : 0;
  return {
    current, previous, diff, rate,
    diffText: `${diff > 0 ? '+' : ''}${diff.toLocaleString()}원`,
    rateText: `${rate > 0 ? '+' : ''}${rate}%`
  };
}

export function calculateLowestPrice(history: any[], productId: number) {
  const productHistory = history.filter(h => h.product_id === productId);
  if (productHistory.length === 0) return null;
  const sortedByDate = [...productHistory].sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));
  const current = sortedByDate[0].price;
  const lowest = Math.min(...productHistory.map(h => h.price));
  const diff = current - lowest;
  return {
    current, lowest, diff,
    diffText: `${diff > 0 ? '+' : ''}${diff.toLocaleString()}원`
  };
}

export function parsePrice(val: any): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const str = val.toString().toLowerCase();
  if (str.includes('%')) return parseFloat(str) || 0;
  if (str.includes('k')) return parseFloat(str) * 1000;
  return parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
}

export function filterDeals(deals: any[], { category, query }: { category?: string, query?: string }) {
  return deals.filter(deal => {
    const matchesCategory = !category || category === '전체' || category === 'all' || 
                          deal.category === category || 
                          categoryMapping[deal.category] === category;
    const matchesSearch = !query || 
                         deal.title.toLowerCase().includes(query.toLowerCase()) ||
                         deal.store.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

export function sortDeals(deals: any[], sortBy: string) {
  return [...deals].sort((a, b) => {
    switch (sortBy) {
      case 'views': return parsePrice(b.views) - parsePrice(a.views);
      case 'comments': return (b.comments || 0) - (a.comments || 0);
      case 'discount': return parsePrice(b.discount || b.price_info?.discount) - parsePrice(a.discount || a.price_info?.discount);
      case 'popular':
        const scoreA = parsePrice(a.views) + ((a.likes || 0) * 3) + ((a.comments || 0) * 2);
        const scoreB = parsePrice(b.views) + ((b.likes || 0) * 3) + ((b.comments || 0) * 2);
        return scoreB - scoreA;
      case 'latest':
      default: return (b.id || 0) - (a.id || 0);
    }
  });
}

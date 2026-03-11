export function extractDealInfo(text) {
  const result = {
    name: "",
    price: 0,
    store: "기타"
  };

  // 1. 쇼핑몰 추출 (쿠팡, 네이버, 11번가, G마켓, 알리 등)
  const storeRegex = /\[(쿠팡|네이버|11번가|G마켓|알리익스프레스|알리|아마존|티몬|위메프)\]/;
  const storeMatch = text.match(storeRegex);
  if (storeMatch) {
    result.store = storeMatch[1];
  }

  // 2. 가격 추출 (숫자와 콤마 조합 후 정수 변환)
  const priceRegex = /([\d,]+)원/;
  const priceMatch = text.match(priceRegex);
  if (priceMatch) {
    result.price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
  }

  // 3. 상품명 추출 (쇼핑몰 태그와 가격 관련 문구 제거)
  let name = text;
  if (storeMatch) name = name.replace(storeMatch[0], '');
  
  // '가격:', '가:', '특가:' 등의 키워드 이후 내용 및 가격 숫자 패턴 제거
  name = name.split(/가격\s*[:：]?|가\s*[:：]?|특가\s*[:：]?/)[0];
  name = name.replace(/[\d,]+원?$/, '').trim();
  
  result.name = name;

  return result;
}

export function calculatePriceMetrics(history) {
  if (!history || history.length < 2) return null;

  // 날짜 기준 내림차순 정렬 (최신 항목이 0번 인덱스)
  const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const current = sorted[0].price;
  const previous = sorted[1].price;
  const diff = current - previous;
  const rate = previous > 0 ? Math.round((diff / previous) * 100) : 0;

  return {
    current,
    previous,
    diff,
    rate,
    diffText: `${diff > 0 ? '+' : ''}${diff.toLocaleString()}원`,
    rateText: `${rate > 0 ? '+' : ''}${rate}%`
  };
}

export function calculateLowestPrice(history, productId) {
  const productHistory = history.filter(h => h.product_id === productId);
  if (productHistory.length === 0) return null;

  // 현재가 (가장 최근 날짜 기준)
  const sortedByDate = [...productHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
  const current = sortedByDate[0].price;

  // 역대 최저가
  const lowest = Math.min(...productHistory.map(h => h.price));
  const diff = current - lowest;

  return {
    current,
    lowest,
    diff,
    diffText: `${diff > 0 ? '+' : ''}${diff.toLocaleString()}원`
  };
}

const adverbs = [
    "행복하고", "귀엽고", "똑똑하고", "빠르고", "용감하고", "수줍고", "활기차고", "조용하고",
    "신나고", "엉뚱하고", "느긋하고", "다정하고", "멋지고", "용감무쌍하고", "신비롭고",
    "자유롭고", "재치있고", "순수하고", "열정적이고", "평화롭고"
];

const adjectives = [
    "파란", "차가운", "따뜻한", "빛나는", "몽글몽글한", "폭신한", "반짝이는",
    "시원한", "노란", "빨간", "투명한", "부드러운", "단단한", "활기찬", "달콤한"
];

const penguinTypes = [
    "펭귄", "황제펭귄", "아델리펭귄", "젠투펭귄", "턱끈펭귄", "마카로니펭귄", "갈라파고스펭귄", "임금펭귄"
];

export const generateNickname = () => {
    const a = adverbs[Math.floor(Math.random() * adverbs.length)];
    const b = adjectives[Math.floor(Math.random() * adjectives.length)];
    const c = penguinTypes[Math.floor(Math.random() * penguinTypes.length)];

    // 00~99 숫자 생성
    const num = Math.floor(Math.random() * 100).toString().padStart(2, '0');

    // [부사] + [형용사] + [펭귄] + [숫자]
    return `${a}${b}${c}${num}`;
};
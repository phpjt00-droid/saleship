const adverbs = ["행복한", "귀여운", "똑똑한", "빠른", "용감한", "수줍은"];
const adjectives = ["파란", "차가운", "따뜻한", "빛나는", "몽글몽글한"];
const penguinTypes = ["펭귄", "황제펭귄", "아델리펭귄", "젠투펭귄"];

export const generateNickname = () => {
    const a = adverbs[Math.floor(Math.random() * adverbs.length)];
    const b = adjectives[Math.floor(Math.random() * adjectives.length)];
    const c = penguinTypes[Math.floor(Math.random() * penguinTypes.length)];
    return `${a}${b}${c}`;
};
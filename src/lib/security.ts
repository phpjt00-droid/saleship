/**
 * 보안 및 유효성 검사 유틸리티
 */

/**
 * 관리자 권한 여부를 확인합니다.
 * @param email 사용자 이메일
 */
export const isAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return email === "phpjt00@gmail.com";
};

/**
 * 게시글/댓글 내용에 금지된 링크가 포함되어 있는지 확인합니다.
 * @param text 검사할 텍스트
 * @throws 링크 포함 시 에러 발생
 */
export const validateContent = (text: string): boolean => {
  const linkRegex = /(http|https|www|\.com|\.co\.kr|\.net)/gi;
  if (linkRegex.test(text)) {
    throw new Error("링크는 게시할 수 없습니다.");
  }
  return true;
};

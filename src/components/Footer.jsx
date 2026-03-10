'use client'
import Link from 'next/link'
import { Zap, ExternalLink, Github, Mail } from 'lucide-react'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand & Intro */}
          <div className="footer__brand">
            <Link href="/" className="footer__logo">
              <Zap className="footer__logo-icon" size={24} />
              <span>SALESHIP</span>
            </Link>
            <p className="footer__desc">
              영업인들을 위한 최고의 커뮤니티.<br />
              지식을 공유하고, 네트워크를 확장하며,<br />
              함께 성장의 한계를 넘어섭니다.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer__links-group">
            <h3 className="footer__title">커뮤니티</h3>
            <ul className="footer__list">
              <li><Link href="/board">전체 게시판</Link></li>
              <li><Link href="/board/trend">최신 트렌드</Link></li>
              <li><Link href="/board/tips">영업 노하우</Link></li>
              <li><Link href="/board/qna">Q&A</Link></li>
            </ul>
          </div>

          <div className="footer__links-group">
            <h3 className="footer__title">지원</h3>
            <ul className="footer__list">
              <li><Link href="/guide">이용 가이드</Link></li>
              <li><Link href="/faq">자주 묻는 질문</Link></li>
              <li><Link href="/terms">이용약관</Link></li>
              <li><Link href="/privacy">개인정보처리방침</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="footer__links-group">
            <h3 className="footer__title">연결하기</h3>
            <ul className="footer__list">
              <li>
                <a href="https://blog.naver.com/saleship" target="_blank" rel="noopener noreferrer" className="footer__social-link">
                  <ExternalLink size={16} />
                  <span>공식 블로그</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@saleship.com" className="footer__social-link">
                  <Mail size={16} />
                  <span>이메일 문의</span>
                </a>
              </li>
              <li>
                <a href="#" className="footer__social-link">
                  <Github size={16} />
                  <span>GitHub 오픈소스</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} SALESHIP. All rights reserved.</p>
          <div className="footer__glow-accent" />
        </div>
      </div>
    </footer>
  )
}

export default Footer

'use client'
import Link from 'next/link'
import { Anchor, ExternalLink, Github, Mail } from 'lucide-react'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand & Intro */}
          <div className="footer__brand">
            <Link href="/" className="footer__logo">
              <Anchor className="footer__logo-icon" size={24} />
              <span>세일쉽</span>
            </Link>
            <p className="footer__desc">
              양질의 핫딜을 큐레이션해서 공유합니다.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer__links-group">
            <h3 className="footer__title">커뮤니티</h3>
            <ul className="footer__list">
              <li><Link href="/board">핫딜 게시판</Link></li>
              <li><Link href="/free">자유 게시판</Link></li>
              <li><Link href="/review">리뷰 게시판</Link></li>
              <li><Link href="/board/trend">최신 트렌드</Link></li>
            </ul>
          </div>

          <div className="footer__links-group">
            <h3 className="footer__title">지원</h3>
            <ul className="footer__list">
              <li><Link href="/about">사이트 소개</Link></li>
              <li><Link href="/guide">이용 가이드</Link></li>
              <li><Link href="/faq">자주 묻는 질문</Link></li>
              <li><Link href="/contact">문의하기</Link></li>
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

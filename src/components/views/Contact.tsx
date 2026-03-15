'use client'
import { useState } from 'react'
import { Send, Mail, User, Tag, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react'
import './Contact.css'

export default function Contact() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setStatus('loading')

        const formData = new FormData(e.currentTarget)

        try {
            const response = await fetch('https://formspree.io/f/xnjgpgwp', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })

            if (response.ok) {
                setStatus('success')
                e.currentTarget.reset()
            } else {
                setStatus('error')
            }
        } catch (error) {
            setStatus('error')
        }
    }

    return (
        <div className="contact-page animate-fadeIn">
            <div className="container contact-container">
                <div className="contact-header">
                    <h1 className="contact-title">문의하기</h1>
                    <p className="contact-subtitle">궁금하신 점이나 제안 사항이 있으시면 언제든지 말씀해 주세요.⚓🚢</p>
                </div>

                <div className="contact-card">
                    {status === 'success' ? (
                        <div className="contact-success animate-bounceIn">
                            <CheckCircle size={64} className="success-icon" />
                            <h2>문의가 성공적으로 전달되었습니다!</h2>
                            <p>기재해주신 이메일로 최대한 빠르게 답변 드리겠습니다.</p>
                            <button onClick={() => setStatus(null)} className="btn-retry">다시 문의하기</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="name"><User size={16} /> 이름</label>
                                    <input type="text" id="name" name="name" placeholder="홍길동" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email"><Mail size={16} /> 이메일</label>
                                    <input type="email" id="email" name="email" placeholder="example@email.com" required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject"><Tag size={16} /> 제목</label>
                                <input type="text" id="subject" name="subject" placeholder="문의 제목을 입력해주세요" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message"><MessageSquare size={16} /> 문의 내용</label>
                                <textarea id="message" name="message" rows={6} placeholder="자세한 문의 내용을 작성해주세요" required></textarea>
                            </div>

                            {status === 'error' && (
                                <div className="form-error">
                                    <AlertCircle size={18} /> 전송에 실패했습니다. 잠시 후 다시 시도해주세요.
                                </div>
                            )}

                            <button type="submit" className={`btn-submit ${status === 'loading' ? 'loading' : ''}`} disabled={status === 'loading'}>
                                {status === 'loading' ? '전송 중...' : (
                                    <>
                                        <Send size={18} /> 문의 보내기
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
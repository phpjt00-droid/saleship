'use client'
import { useEffect } from 'react'
import Script from 'next/script'
import Head from 'next/head'
import './DailyWidgets.css'

declare global {
  interface Window {
    FullCalendar: any;
    myCalendar: any;
    Chart: any;
    myPriceChart: any;
  }
}

export default function DailyWidgets() {
  useEffect(() => {
    // 1. Today Date
    const today = new Date();
    const dateEl = document.getElementById('today-date');
    if (dateEl) dateEl.innerText = today.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    const dayEl = document.getElementById('today-day');
    if (dayEl) dayEl.innerText = today.toLocaleDateString('ko-KR', { weekday: 'long' });

    // 2. Weather (wttr.in - Free)
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://wttr.in/Seoul?format=j1');
        const data = await res.json();
        const temp = data.current_condition[0].temp_C;
        const iconCode = data.current_condition[0].weatherCode;
        
        document.getElementById('temperature').innerText = `${temp}°C`;
        document.getElementById('city').innerText = '서울, 대한민국';
        
        const iconMap = {
          "113": "https://img.icons8.com/fluency/96/sun.png",
          "116": "https://img.icons8.com/fluency/96/partly-cloudy-day.png",
          "119": "https://img.icons8.com/fluency/96/cloud.png",
          "122": "https://img.icons8.com/fluency/96/clouds.png",
          "143": "https://img.icons8.com/fluency/96/fog-day.png",
          "176": "https://img.icons8.com/fluency/96/rainy-weather.png",
          "200": "https://img.icons8.com/fluency/96/storm.png"
        };
        const iconEl = document.getElementById('weather-icon') as HTMLImageElement;
        if (iconEl) iconEl.src = iconMap[iconCode as keyof typeof iconMap] || "https://img.icons8.com/fluency/96/partly-cloudy-day.png";
      } catch (e) { console.error('Weather fetch error'); }
    };
    fetchWeather();
  }, []);

  const initCalendar = () => {
    const calendarEl = document.getElementById('deal-calendar-fc');
    if (!calendarEl || !window.FullCalendar) return;

    if (window.myCalendar) window.myCalendar.destroy();

    window.myCalendar = new window.FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'ko',
      headerToolbar: false,
      height: 'auto',
      events: [
        { title: '🔥 패밀리세일', start: '2026-03-05', color: '#ef4444' },
        { title: '📦 브랜드위크', start: '2026-03-12', color: '#3b82f6' },
        { title: '✨ 뷰티특가', start: '2026-03-18', color: '#ec4899' },
        { title: '🍎 신선핫딜', start: '2026-03-25', color: '#10b981' }
      ],
      dayMaxEvents: true
    });
    window.myCalendar.render();
  }

  const initChart = () => {
    const canvas = document.getElementById('priceChart') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !window.Chart) return;
    
    if (window.myPriceChart) window.myPriceChart.destroy();

    window.myPriceChart = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1일전', '2일전', '3일전', '4일전', '5일전', '6일전', '7일전'].reverse(),
        datasets: [{
          label: '평균 핫딜가',
          data: [12000, 15000, 11000, 13000, 14000, 10500, 11500],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { display: false },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
  }

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet" />
      <Script 
        src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"
        onLoad={initCalendar}
        strategy="lazyOnload"
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/chart.js" 
        onLoad={initChart}
        strategy="lazyOnload"
      />
      
      <section className="container section">
        <div className="widgets-grid">
          {/* Date Widget */}
          <div className="widget-card">
            <div className="widget-title">📅 핫딜 데이</div>
            <div id="today-date">--월 --일</div>
            <div id="today-day">--요일</div>
          </div>

          {/* Weather Widget */}
          <div className="widget-card">
            <div className="widget-title">☀️ 실시간 날씨</div>
            <div id="weather">
              <span id="city">로딩 중...</span>
              <img id="weather-icon" style={{width: '64px', height: '64px'}} alt="날씨 아이콘" />
              <span id="temperature">--°C</span>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="widget-card widget-card--large">
            <div className="widget-title">🗓️ 핫딜 캘린더</div>
            <div id="deal-calendar-fc"></div>
          </div>

          {/* Price Chart Widget */}
          <div className="widget-card">
            <div className="widget-title">📉 가격 변동 그래프</div>
            <div className="chart-container">
              <canvas id="priceChart"></canvas>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

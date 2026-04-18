const apiKey = '69fef9a0b25f080c4532c7fe7fffcf08';
const searchBtn = document.getElementById('search-btn');
const geoBtn = document.getElementById('geo-btn');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const weatherCard = document.getElementById('weather-card'); 

// دالة لجلب الأيقونة الرهيبة (باستخدام FontAwesome)
function getIconClass(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
    if (weatherId >= 300 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow'; 
    if (weatherId >= 700 && weatherId < 800) return 'atmosphere'; 
    if (weatherId === 800) return 'clear'; 
    if (weatherId > 800) return 'clouds'; 
    return 'unknown';
}

// دالة لتحديث خلفية الكارت (عشان يصير فخم)
function updateWeatherCard(weatherMain) {
    weatherCard.className = 'weather-card'; 
    weatherCard.classList.add(weatherMain.toLowerCase()); 
}

// دالة البحث الموحدة
async function fetchWeatherData(url) {
    weatherResult.innerHTML = '<p>جاري جلب البيانات...</p>';
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === 200) {
            displayWeather(data);
        } else {
            weatherResult.innerHTML = `<p>عذراً، لم نجد هذه المنطقة!</p>`;
        }
    } catch (error) {
        weatherResult.innerHTML = `<p>حدث خطأ في الاتصال بالسيرفر!</p>`;
    }
}
function displayWeather(data) {
    const iconCode = data.weather[0].icon; // كود الأيقونة من API
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`; 

    weatherResult.innerHTML = `
        <h2 style="color: #00f2ff; margin-bottom: 5px;">${data.name}</h2>
        <img src="${iconUrl}" alt="weather icon" style="width: 120px; filter: drop-shadow(0 0 10px #fff);">
        <h1 style="font-size: 4rem; margin: 0;">${Math.round(data.main.temp)}°م</h1>
        <p style="font-size: 1.2rem; color: #eee;">${data.weather[0].description}</p>
        
        <div style="display: flex; justify-content: space-around; margin-top: 25px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
            <div>
                <small style="display:block; color: #888;">رطوبة</small>
                <p style="margin: 5px 0;">${data.main.humidity}% 💧</p>
            </div>
            <div>
                <small style="display:block; color: #888;">رياح</small>
                <p style="margin: 5px 0;">${data.wind.speed} كم/س 💨</p>
            </div>
        </div>
    `;
}
// البحث عن طريق كتابة اسم المدينة
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ar`;
        fetchWeatherData(url);
    }
});

// تحديد الموقع تلقائياً عبر الـ GPS
geoBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        geoBtn.innerText = "جاري تحديد موقعك...";
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ar`;
            fetchWeatherData(url);
            geoBtn.innerText = "📍 موقعي الحالي";
        }, () => {
            alert("يرجى تفعيل إذن الموقع في متصفحك!");
            geoBtn.innerText = "📍 موقعي الحالي";
        });
    }
});
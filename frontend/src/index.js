import { dates } from '../utils/dates.js'; // adjust path if needed

const tickersArr = [];
const generateReportBtn = document.querySelector('.generate-report-btn');
const loadingArea = document.querySelector('.loading-panel');
const apiMessage = document.getElementById('api-message');
const outputArea = document.querySelector('.output-panel');

// Handle ticker form submit
document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const tickerInput = document.getElementById('ticker-input');
  if (tickerInput.value.length >= 3 && tickersArr.length < 3) {
    generateReportBtn.disabled = false;
    tickersArr.push(tickerInput.value.toUpperCase());
    tickerInput.value = '';
    renderTickers();
  } else {
    const label = document.querySelector('label[for="ticker-input"]');
    label.style.color = 'red';
    label.textContent = 'Add 3 or more letters and up to 3 tickers only.';
  }
});

// Render ticker tags
function renderTickers() {
  const tickersDiv = document.querySelector('.ticker-choice-display');
  tickersDiv.innerHTML = '';
  tickersArr.forEach(ticker => {
    const span = document.createElement('span');
    span.textContent = ticker;
    span.classList.add('ticker');
    tickersDiv.appendChild(span);
  });
}

// Fetch stock data from backend
async function fetchStockData() {
  if (tickersArr.length === 0) return;

  document.querySelector('.action-panel').style.display = 'none';
  loadingArea.style.display = 'flex';
  apiMessage.textContent = 'Querying Stocks API...';
  outputArea.innerHTML = '';

  try {
    const response = await fetch('http://localhost:3000/api/openai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickers: tickersArr })
    });

    if (!response.ok) {
      throw new Error('Failed to get data from backend');
    }

    const data = await response.json();
    renderReport(data.report);
  } catch (error) {
    apiMessage.textContent = 'Error fetching stock data.';
    console.error(error);
  }
}

// Render AI report to page
function renderReport(report) {
  loadingArea.style.display = 'none';
  outputArea.style.display = 'block';

  const p = document.createElement('p');
  p.textContent = report;
  outputArea.appendChild(p);
}

// Button click triggers fetch
generateReportBtn.addEventListener('click', fetchStockData);

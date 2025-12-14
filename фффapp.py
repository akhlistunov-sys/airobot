from flask import Flask, jsonify
from flask_cors import CORS
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "NeuroTrader AI Backend", "status": "running"})

@app.route('/status')
def get_status():
    return jsonify({
        "status": "ONLINE",
        "uptime_seconds": random.randint(1000, 10000),
        "trading_sessions": random.randint(50, 200),
        "total_trades": random.randint(1000, 5000),
        "virtual_portfolio_value": random.randint(100000, 500000),
        "virtual_return_percentage": random.uniform(-5.0, 15.0),
        "total_profit": random.randint(10000, 100000),
        "last_trading_time": (datetime.now() - timedelta(minutes=random.randint(1, 60))).isoformat(),
        "hybrid_mode": True,
        "tracked_tickers": ["SBER", "GAZP", "LKOH", "YNDX", "VTBR", "ROSN", "MGNT"]
    })

@app.route('/market_context')
def market_context():
    tickers = ["SBER", "GAZP", "LKOH", "YNDX", "VTBR"]
    data = []
    for ticker in tickers:
        data.append({
            "ticker": ticker,
            "price": random.uniform(100, 5000),
            "indicators": {
                "rsi": random.uniform(20, 80),
                "macd": random.uniform(-2, 2),
                "volume_spike": random.choice([True, False]),
                "trend": random.choice(["up", "down", "sideways"])
            }
        })
    return jsonify(data)

@app.route('/execute_trade', methods=['POST'])
def execute_trade():
    # Здесь должна быть логика исполнения трейда
    return jsonify({
        "success": True,
        "message": "Trade executed",
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

# Chiller Knowledge Learning Program

Interactive quiz application for testing knowledge about chiller systems and HVAC cooling equipment.

## Features

✅ **Multiple Knowledge Groups** - 4 categories with 5 questions each  
✅ **10-Second Timed Questions** - Challenge yourself to think fast  
✅ **Smart Scoring** - 10 pts per correct + bonus for speed (< 5s)  
✅ **Randomized Questions** - Order and answers change each play  
✅ **Global Leaderboard** - Compete with other players  
✅ **Progress Tracking** - View detailed results  
✅ **No Backtracking** - Move forward only  

## Categories

1. **Chiller Basics** ❄️ - Fundamentals, types, refrigerants
2. **Maintenance** 🔧 - Operations, diagnostics, care
3. **Energy Efficiency** ⚡ - Optimization, COP, VFD
4. **Troubleshooting** 🔍 - Problem diagnosis

## Quick Start

Simply open `index.html` in a modern web browser.

## How It Works

1. Enter your name
2. Choose a knowledge group
3. Answer 10 randomized questions (10 sec each)
4. See instant feedback
5. View final score and ranking

## File Structure

```
├── index.html          Main UI
├── css/style.css       Styling
├── js/
│   ├── app.js         Main logic
│   ├── quiz.js        Question engine
│   ├── leaderboard.js Scoring system
│   └── utils.js       Helper functions
└── data/questions.json Question bank (editable)
```

## Customization

Edit `data/questions.json` to add/modify questions. Structure:

```json
{
  "categories": [{
    "id": "category-id",
    "name": "Display Name",
    "icon": "emoji",
    "questions": [{
      "id": "q1",
      "question": "Question text?",
      "type": "single|multiple",
      "answers": [
        {"text": "Answer", "correct": true},
        {"text": "Wrong", "correct": false}
      ]
    }]
  }]
}
```

## Scoring

- **Correct Answer**: 10 points
- **Bonus (5-2 sec)**: 5 points
- **Super Bonus (< 2 sec)**: 10 points
- **Wrong/Timeout**: 0 points

## Browser Support

Modern browsers with ES6 and localStorage support (Chrome, Firefox, Safari, Edge)

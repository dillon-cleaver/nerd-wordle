// Simple test to check if daily puzzle is fetching from Firebase
const fetch = require('node-fetch');

async function testDailyPuzzle() {
  console.log('🧪 Testing Daily Puzzle API...');
  
  try {
    const response = await fetch('http://127.0.0.1:5001/nerd-word-cfda3/us-central1/api/daily-puzzle/today');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS: Got daily puzzle from Firebase!');
      console.log('📅 Date:', data.puzzle.date);
      console.log('🎯 Word:', data.puzzle.word.id);
      console.log('📝 Category:', data.puzzle.word.category);
      
      if (data.puzzle.word.hints) {
        console.log('💡 Hints:', data.puzzle.word.hints.slice(0, 2).join(', ') + '...');
      }
    } else {
      console.log('❌ FAILED: API returned', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ ERROR: Could not connect to API');
    console.log('   Make sure the emulator is running on port 5001');
    console.log('   Error:', error.message);
  }
}

testDailyPuzzle();

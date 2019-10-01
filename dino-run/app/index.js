import document from "document";
import * as fs from "fs";
import { listDirSync } from "fs";

const listDir = fs.listDirSync("/private/data");
let foundFile;
let dirIter = listDir.next();
console.log('listing files');
while(dirIter && !dirIter.done) {
  console.log(dirIter.value);
  if (dirIter.value == 'json.txt') {
    foundFile = true;
  }
  dirIter = listDir.next();
}
console.log('done listing files');
if (!foundFile) {
  console.log('writing to file');
  let init_json_data = {
      "highestScore": 0
  };
  fs.writeFileSync("json.txt", init_json_data, "json");  
}

let obstacle1 = document.getElementById('obstacle1');
let obstacle2 = document.getElementById('obstacle2');
let scoreSpan = document.getElementById('score');
let hiSpan = document.getElementById('hi');
let dino = document.getElementById('dino');
let reset = document.getElementById('reset');
let obstacle1Left;
let obstacle2Left;
let obstacle1ScoreIncreased = false;
let obstacle2ScoreIncreased = false;
let obstacle1CrossingStarted = false;
let obstacle2CrossingStarted = false;
let obstacle1Crossed = false;
let obstacle2Crossed = false;
let obstacle1W = obstacle1.width;
let obstacle2W = obstacle2.width;
let dinoL = dino.x;
let dinoW = dino.width;
let dinoTop = dino.y;
let score;
let jumpHeight = 50;
let screenWidth = 300;
let obstacle1LeftInit = 150;
let obstacle2LeftInit = 290;
let margin = 20;
let interval;
let shift = 3; /// 1.5 for simulator, 3 for versa
let jumpTime = 600;
let shiftTime = 10;
let json_object;
let highScore;

dino.onclick = dinoClickHandler;

reset.onclick = () => {
  reset.style.display = "none";
  setTimeout(resetApp, 0);
};

function resetApp() {
  json_object  = fs.readFileSync("json.txt", "json");
  highScore = json_object.highestScore;
  console.log("JSON file time list: " + highScore);
  hiSpan.text = "HIGH: " + highScore;
 obstacle1ScoreIncreased = false;
 obstacle2ScoreIncreased = false;
 obstacle1CrossingStarted = false;
 obstacle2CrossingStarted = false;
 obstacle1Crossed = false;
 obstacle2Crossed = false;
  obstacle1.x = obstacle1LeftInit;
  obstacle2.x = obstacle2LeftInit;
  obstacle1Left = obstacle1LeftInit;
  obstacle2Left = obstacle2LeftInit;
  score = 0;
  scoreSpan.text = score;
  interval = setInterval(tick, shiftTime);
  reset.style.display = "none";
}

function dinoClickHandler(e) {
	dino.y = dinoTop - jumpHeight;
	setTimeout(function () {
		dino.y = dinoTop;
	}, jumpTime);
}

function tick() {
	obstacle1Left = obstacle1Left - shift;
	obstacle1.x = obstacle1Left;
	obstacle2Left = obstacle2Left - shift;
	obstacle2.x = obstacle2Left;

	if (obstacle1Left < 0) {
		obstacle1Left = screenWidth;
		obstacle1ScoreIncreased = false;
		obstacle1CrossingStarted = false;
		obstacle1Crossed = false;
	}
	if (obstacle2Left < 0) {
		obstacle2Left = screenWidth;
		obstacle2ScoreIncreased = false;
		obstacle2CrossingStarted = false;
		obstacle2Crossed = false;
	}
	if (obstacle1Left + obstacle1W < dinoL + margin) {
		obstacle1Crossed = true;
	}
	if (dinoL + dinoW - margin > obstacle1Left) {
		obstacle1CrossingStarted = true;
	}
	if (obstacle2Left + obstacle2W < dinoL + margin) {
		obstacle2Crossed = true;
	}
	if (dinoL + dinoW - margin > obstacle2Left) {
		obstacle2CrossingStarted = true;
	}

	if(obstacle1Crossed && obstacle1ScoreIncreased === false) {
		scoreSpan.text = ++score;
		obstacle1ScoreIncreased = true;
	}
	if(obstacle2Crossed && obstacle2ScoreIncreased === false) {
    scoreSpan.text = ++score;
		obstacle2ScoreIncreased = true;
	}
	if(dino.y === dinoTop &&
		((obstacle1CrossingStarted && !obstacle1Crossed) ||
		(obstacle2CrossingStarted && !obstacle2Crossed)) ) {
		clearInterval(interval);
    reset.style.display = "inline";
    if (score > highScore) {
      let new_json_data = {
          "highestScore": score
      };      
      fs.writeFileSync("json.txt", new_json_data, "json");
    }
	}
}

setTimeout(resetApp, 1000);

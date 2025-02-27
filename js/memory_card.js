// 1. APPLICATION STATE
const state ={
    records:[{username: "", level: 8, time: "00:00"}],
    cards:[{text: "", flipped: false, completed: false }]
}

let newRecords = JSON.parse(localStorage.getItem('records')) || [];
console.log(newRecords);
let tempRecord;

let seconds = 0;

let minutes = 0;
let timerInterval;

let activeArray= [];
let completedPairs = 0;
let lastEmoji = '🍟';


// 2. STATE ACCESSORS/MUTATORS FN'S

function startGame() {
    const userName = usernameInput$.value.trim();
    const numPairs = document.querySelector('input[name="level"]:checked');

    if (userName !== "" && numPairs !== null) {

        startTimer();
        outputCards(createCardsEmoji(numPairs.value));

        if (numPairs.value == 18) {    //if with "===", will never fit the condition
            cardsFormat$.classList.add("grid_36");
        } else {
            cardsFormat$.classList.remove("grid_36");
        }

       tempRecord = {username: userName, level: numPairs.value};

        callCardActive();
        usernameInput$.value = "";

    }else{
        alert("Please enter a username and choose a level.");
    }

}

function createCardsEmoji(pairs){

    const emojiArray=["🍄", "😆", "🔊", "⛔️", "🈯️", "😹", "☔️", "🦷", "😇", "🤶", "🤧", "🤖", "🧊", "🍟",
        "💂", "🐷", "🅿️", "🦄", "🌈", "🍳", "🚂", "🍇", "✈️", "🏖️", "🏜️", "🧯", "🧿", "🗝️", "☂️", "💚", "🚮",
        "❎", "🟢", "🚁", "🤍", "🍍", "🍧", "🎵", "🔺", "🐿️", "🐠", "🤤", "👽", "👻", "🖖🏾", "🐳", "🌸", "🧷", "㊙️"]

    emojiArray.sort(() => Math.random() - 0.5); //The default sort order is ascending

    const newEmojiArray = [];
    for (let i = 0; i < pairs ; i++) {
        newEmojiArray.push(emojiArray[i]);
    }

    //console.log("EmojiArrayInThisGame" + newEmojiArray);
    return newEmojiArray;
}



//Timer
// Function to format time string (two digits)
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}


function updateTimerDisplay() {
    const formattedSeconds = formatTime(seconds);
    const formattedMinutes = formatTime(minutes);
    document.getElementById("count-up").textContent = `${formattedMinutes}:${formattedSeconds}`;
}


function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        updateTimerDisplay();
    }, 1000); // Update every second (1000 milliseconds)
}


function updateLocalStorage() {
    localStorage.setItem('records', JSON.stringify(newRecords));
    renderRecordsTable();

}

function stopTimer() {
    clearInterval(timerInterval); //to cancel the interval
    timerInterval = null;
}

function endGame(){
    stopTimer();
    completedCon();
    let formattedTime = formatTime(minutes) + ":" + formatTime(seconds);

    console.log("Total time taken:", formattedTime);

    tempRecord.time = formattedTime;
    newRecords.push(tempRecord);
    updateLocalStorage();
}

function completedCon(){
    let end = Date.now() + (0.5 * 1000);
    let scalar = 3.5;
    let emoji = confetti.shapeFromText({ text:lastEmoji , scalar });
    confetti();

    (function frame() {
        confetti({
            particleCount: 1,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            gravity:4,
            shapes: [emoji],
            flat:true,
            scalar
        });
        confetti({
            particleCount: 1,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            gravity:4,
            shapes: [emoji],
            flat:true,
            scalar
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());


}

// 3. DOM Node Refs
// - Static references to DOM nodes needed after the start of the application
const usernameInput$ = document.querySelector("#username_input");
const cardsFormat$ = document.querySelector("#cardsFormat");
const startButton$ = document.querySelector("#start");
const cardsContainer$ = document.querySelectorAll(".flip-container");
const recordsList$ = document.querySelector('#recordsList');


// 4. DOM Node Creation Fn's
// - Dynamic creation of DOM nodes needed upon user interaction

function outputCards(array) {
    const newArray = [...array]; // Copy the array
    for(let i = 0; i < array.length; i ++){  //copy the array, get all the pairs in new array
        newArray.push(array[i]);
    }

    while (newArray.length !== 0) {
        let randomIndex = Math.floor(Math.random() * newArray.length);
        //console.log("randomIndex" + randomIndex);

        const flipCon = document.createElement("div");
        flipCon.classList.add("flip-container");

        const flipFront = document.createElement("div");
        flipFront.classList.add("flip-front");

        const card = document.createElement("div");
        card.classList.add("card"); // Add a CSS class for styling
        card.textContent = newArray[randomIndex];

        flipCon.appendChild(card);
        flipCon.appendChild(flipFront);
        cardsFormat$.appendChild(flipCon);

        console.log("output: " + newArray[randomIndex]);

        newArray.splice(randomIndex, 1);
        //console.log("newArray" + newArray);
    }
}


// 5. RENDER FN
// - These functions will render the application state to the DOM
// - Here we will use a very naive but simple approach to re-render the list
// - IMPORTANT TAKEAWAY: The state drives the UI, any state change should trigger a re-render of the UI


function renderRecordsTable(){
    newRecords.forEach(record => {
        let tableRow = document.createElement("tr");
        let tableCell1 = document.createElement("td");
        let tableCell2 = document.createElement("td");
        let tableCell3 = document.createElement("td");
        tableCell1.textContent = record.username;
        tableCell2.textContent = record.level;
        tableCell3.textContent = record.time;

        tableRow.appendChild(tableCell1);
        tableRow.appendChild(tableCell2);
        tableRow.appendChild(tableCell3);

        recordsList$.appendChild(tableRow);
    });

}



// 6. EVENT HANDLERS
// - These functions handle user interaction e.g. button clicks, key presses etc.
// - These functions will call the state mutators and then call the render function
// - The naming convention for the event handlers is `on<Event>`
// - Here we will create a function that will handle the add button click

startButton$.addEventListener('click', startGame);

function callCardActive(){
    const cardsContainer$ = document.querySelectorAll(".flip-container");
    const numPairs = document.querySelector('input[name="level"]:checked').value;

    cardsContainer$.forEach(cardContainer => {
        cardContainer.addEventListener("click", function() {
            if(activeArray.length < 2 && !cardContainer.classList.contains("flip-container-active")) { //only 2 card can be flip at one time //if the cards are not matched yet
                cardContainer.classList.toggle("flip-container-active");
                activeArray.push(cardContainer);
            }

            if(activeArray.length == 2){
                if(activeArray[0].firstChild.firstChild.textContent === activeArray[1].firstChild.firstChild.textContent){
                    console.log("find a match.");
                    completedPairs++;
                    console.log("completedPairs: " + completedPairs);
                    lastEmoji = activeArray[1].firstChild.firstChild.textContent;
                    activeArray = [];
                }else{
                    //flip both cards back
                    setTimeout(function() {
                        //console.log(activeArray);
                        activeArray.forEach(ele => ele.classList.remove("flip-container-active"));
                        activeArray = [];
                    }, 1000);
                }
            }


            if(completedPairs == numPairs){
                console.log("numPairs" + numPairs);
                completedCon();
                endGame();
            }

            console.log(activeArray.length);
            console.log(activeArray);


        })
    });
}



// 7. INIT BINDINGS
// - These are the initial bindings of the event handlers
startButton$.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        startGame();
    }
})


// 8. INITIAL RENDER
// - Here will call the render function to render the initial state of the application

renderRecordsTable();



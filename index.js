let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area"); 
let submitButton = document.querySelector(".submit-button");
let bulletsElement = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
let countDownInterval;
let currentIndex = 0;  
let rightAnswer = 0;
function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function(){
        if(this.status===200&&this.readyState===4){
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;
            addQuestionsData(questionsObject[currentIndex],questionsCount);
            createBullets(questionsCount);
            countDown(5,questionsCount);
            submitButton.onclick = ()=> {
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(theRightAnswer,questionsCount);
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                addQuestionsData(questionsObject[currentIndex],questionsCount);
                handleBullets();
                showResults(questionsCount);
                clearInterval(countDownInterval);
                countDown(5,questionsCount);
            };
        }
    };
    myRequest.open("GET","index.json",true);
    myRequest.send();
}
getQuestions();
function createBullets(num){
    countSpan.innerHTML = num;
    for(var i=0;i<num;i++){
        let theBullet = document.createElement("span");
        if(i===0)
        theBullet.className = 'on';
        bullets.appendChild(theBullet);
    }
}
function addQuestionsData(obj,count){
    if(currentIndex<count){
        let questionTitle =  document.createElement("h2");
    questionTitle.appendChild(document.createTextNode(obj["title"]));
    quizArea.appendChild(questionTitle);
    for(let i=1;i<=4;i++){
        let mainDiv = document.createElement("div");
        mainDiv.className = "answer";
        let radioInput = document.createElement("input");
        if(i===1)
        radioInput.checked = true;
        radioInput.type = "radio";
        radioInput.name = "question";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];
        let theLabel = document.createElement("label");
        theLabel.htmlFor = `answer_${i}`;
        theLabel.appendChild(document.createTextNode(obj[`answer_${i}`]));
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);
        answersArea.appendChild(mainDiv);
    }
    }
}
function checkAnswer(rAnswer,qCount){
    let answers = document.getElementsByName("question");
    let chosenAnswer;
    for(let i=0;i<answers.length;i++){
        if(answers[i].checked===true){
            chosenAnswer = answers[i].dataset.answer;
        }
    }
    if(chosenAnswer === rAnswer){
        rightAnswer++;
    }
    
}
function handleBullets(){
    let bulletsSpan = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpan);
    arrayOfSpans.forEach((span,index)=>{
        if(currentIndex===index){
            span.className = "on";
        }
    });
};
function showResults(count){
    let theResults;
    if(currentIndex===count){
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bulletsElement.remove();
        if(rightAnswer>(count/2)&&rightAnswer<count){
            theResults = `<span class="good">Good</span>, ${rightAnswer} From ${count} .`
        }else if(rightAnswer===count){
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Pass.`
        }else{
            theResults = `<span class="bad">Bad</span>, ${rightAnswer} From ${count} .`
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.marginTop = "10px";
        resultsContainer.style.backgroundColor = "white";
    }
};
function countDown(duration,count){
    if(currentIndex<count){
        let minutes,seconds;
        countDownInterval = setInterval(()=>{
            minutes = Math.floor(duration / 60);
            seconds = Math.floor(duration % 60);
            minutes=minutes<10?`0${minutes}`:minutes;
            seconds=seconds<10?`0${seconds}`:seconds; 
                countDownElement.innerHTML = `${minutes}:${seconds}`;
                if(--duration<0){
                    clearInterval(countDownInterval);
                    submitButton.click();
                }

        },1000);
    }
};
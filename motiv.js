// QUIZ
function quizResult(choice){
    let result = document.getElementBYID("quizOutput");

    if(choice===1){
        result.innerText="You seem to be managing well";
    }elseif (choice ===2){
        result.innerText ="Some stress is normal. Take breaks";
    }else{
        result.innerText ="ou ma be feeling overwhelmed.Consider talking to someone";
    }
}
// MOTIVATION
function showMotivation(){
    const messages = [
        "You are stronger than you think",
        "Every day is a fresh start",
        "It's okay to ask for help",
        "Your feelings are valid"
    ];

    let random = Math.floor(Math.random()*messages.length);
    document.getElementById("motivationText").innerText = messages[random];
};
// CHAT UI
function sendMessage(){
    let
}
function CheckMood(){
    const mood =document.getElementById("mood").ariaValueMax;
    const result = document.getElementById("result");

    if (mood=== "happy"){
        result.textContent="That's great! Keep taking care of yourself.";
    } elseif (mood === "stressed"){
        result.textContent="Try deep breathing and take short breaks.";
    }elseif (mood ==="sad"){
        result.textContent="You are not alone.Reach out to someone you trust.";
    
    }elseif (mood==="anxious"){
        result.textContent="Ground yourself and focus on our breathing.";
    }else {
        result.textContent="Please select a mood.";

    }
}
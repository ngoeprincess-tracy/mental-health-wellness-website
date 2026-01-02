function login() {
    const username =document.getElementById("username").Value;
    const password =document.getElementById("password").Value
    const message= document.getElementById("message").Value;

    if (username&& password){
        message.textContent = "Login successful (demo only).";
    }
}
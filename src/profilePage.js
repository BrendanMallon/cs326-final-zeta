
document.getElementById("confirm-btn-Name").onclick = async ()=>{
    await fetch(`${window.location.origin}/setName/${document.getElementById("nameInput").value}`).catch(error=>(console.log(error)));
    showPopUp("changeSuccessPopUp");
};
document.getElementById("confirm-btn-Email").onclick = ()=>{
     fetch(`${window.location.origin}/setEmail/${document.getElementById("emailAdressInput").value}`);
     showPopUp("changeSuccessPopUp");
};
document.getElementById("confirm-btn-Password").onclick = ()=>{

    if(document.getElementById("newPasswordInput").value === document.getElementById("newPasswordConfirmInput").value){
        fetch(`${window.location.origin}/setPassword/${document.getElementById("newPasswordInput").value}`);
        $('#confirmPasswordChangesPopUp').modal({show: false});
        $('#changeSuccessPopUp').modal({show: true});
    }else{
        $('#confirmPasswordChangesPopUp').modal({show: false});
        $('#changeFailurePasswordPopUp').modal({show: true});
    }

};
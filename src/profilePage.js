/* eslint-disable no-undef */
document.getElementById("confirm-btn-Name").onclick = async () => {
    await fetch(
        `${window.location.origin}/setName/${
            document.getElementById("nameInput").value
        }`
    ).catch((error) => console.log(error));
};
document.getElementById("confirm-btn-Email").onclick = async () => {
    await fetch(
        `${window.location.origin}/setEmail/${
            document.getElementById("emailAdressInput").value
        }`
    );
};
document.getElementById("confirm-btn-Password").onclick = async () => {
    if (
        document.getElementById("newPasswordInput").value ===
        document.getElementById("newPasswordConfirmInput").value
    ) {
        await fetch(
            `${window.location.origin}/setPassword/${
                document.getElementById("newPasswordInput").value
            }`
        );
        $("#confirmPasswordChangesPopUp").modal({ show: false });
        $("#changeSuccessPopUp").modal({ show: true });
    } else {
        $("#confirmPasswordChangesPopUp").modal({ show: false });
        $("#changeFailurePasswordPopUp").modal({ show: true });
    }
};


// LOAD SAVED TRANSACTIONS

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

let qrScanner = null;


// OPEN SEND MONEY SCREEN

function openSendMoney() {

    document.querySelector(".header").style.display = "none";
    document.querySelector(".balance").style.display = "none";
    document.querySelector(".services").style.display = "none";

    document.getElementById("historyScreen").style.display = "none";
    document.getElementById("scannerScreen").style.display = "none";
    document.getElementById("sendScreen").style.display = "block";
}


// GO TO HOME SCREEN

async function goHome() {

    await stopScanner();

    document.querySelector(".header").style.display = "block";
    document.querySelector(".balance").style.display = "block";
    document.querySelector(".services").style.display = "flex";

    document.getElementById("sendScreen").style.display = "none";
    document.getElementById("historyScreen").style.display = "none";
    document.getElementById("scannerScreen").style.display = "none";
}


// DEMO PAYMENT

function makePayment() {

    let upi = document.getElementById("upiId").value.trim();

    let amount = Number(
        document.getElementById("amount").value
    );

    let message = document.getElementById("message");

    if (upi === "" || !upi.includes("@") ||
        !Number.isFinite(amount) || amount <= 0) {

        message.innerText = "Please enter valid details";

        return;
    }

    let transaction = {
        upi: upi,
        amount: amount,
        date: new Date().toLocaleString(),
        status: "Demo Recorded"
    };

    transactions.push(transaction);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    message.innerText = "Demo transaction recorded successfully!";

    document.getElementById("upiId").value = "";
    document.getElementById("amount").value = "";
}


// OPEN TRANSACTION HISTORY

function openHistory() {

    document.querySelector(".header").style.display = "none";
    document.querySelector(".balance").style.display = "none";
    document.querySelector(".services").style.display = "none";

    document.getElementById("sendScreen").style.display = "none";
    document.getElementById("scannerScreen").style.display = "none";
    document.getElementById("historyScreen").style.display = "block";

    let list = document.getElementById("historyList");

    list.innerHTML = "";

    if (transactions.length === 0) {

        list.innerText = "No transactions yet.";

        return;
    }

    transactions.forEach(function(item) {

        let p = document.createElement("p");

        p.textContent =
            "UPI ID: " + item.upi +
            " | Amount: ₹" + item.amount +
            " | Date: " + item.date +
            " | Status: " + item.status;

        list.appendChild(p);

    });
}


// OPEN QR SCANNER

async function openScanner() {

    document.querySelector(".header").style.display = "none";
    document.querySelector(".balance").style.display = "none";
    document.querySelector(".services").style.display = "none";

    document.getElementById("sendScreen").style.display = "none";
    document.getElementById("historyScreen").style.display = "none";
    document.getElementById("scannerScreen").style.display = "block";

    let result = document.getElementById("scanResult");

    result.innerText = "Starting camera...";

    if (typeof Html5Qrcode === "undefined") {

        result.innerText =
            "QR library not loaded. Check your internet connection.";

        return;
    }

    await stopScanner();

    qrScanner = new Html5Qrcode("reader");

    try {

        await qrScanner.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            function(decodedText) {

                result.innerText =
                    "Scanned QR information: " + decodedText;

                stopScanner();

            }
        );

        result.innerText = "Camera started. Scan a sample QR code.";

    } catch (error) {

        result.innerText =
            "Camera could not start. Check permission and HTTPS.";

        console.log(error);

        await stopScanner();

    }
}


// STOP QR SCANNER

async function stopScanner() {

    if (qrScanner !== null) {

        try {

            if (qrScanner.isScanning) {
                await qrScanner.stop();
            }

            qrScanner.clear();

        } catch (error) {

            console.log(error);

        }

        qrScanner = null;

    }
}

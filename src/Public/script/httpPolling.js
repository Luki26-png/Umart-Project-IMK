const orderId = parseInt(document.querySelector('.order-id').id, 10);

function startLongPolling() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `http://${location.host}/api/payment`, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const json = JSON.parse(xhr.responseText);
                    console.log("Server message:", json.message);

                    if (json.message === "yes") {
                        console.log("✅ Payment confirmed. Stopping polling.");
                        // Optionally handle success here
                        window.location.assign("http://" + window.location.host + `/api/payment-success?orderId=${orderId}`);
                        return;
                    } else {
                        // Keep polling if message is not "yes"
                        startLongPolling();
                    }
                } catch (err) {
                    console.error("Failed to parse response:", err);
                    setTimeout(startLongPolling, 3000);
                }
            } else {
                // On error, retry after delay
                console.warn("Polling failed, retrying in 3s...");
                setTimeout(startLongPolling, 3000);
            }
        }
    };

    xhr.onerror = function () {
        console.error("Network error, retrying in 3s...");
        setTimeout(startLongPolling, 3000);
    };

    xhr.send(JSON.stringify({ orderId: orderId }));
}

startLongPolling();

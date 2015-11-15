if (navigator.serviceWorker) {
    console.log("ServiceWorkers are supported");

    navigator.serviceWorker.register('sw.js', {
            scope: './'
        })
        .then(function(reg) {
            console.log("ServiceWorker registered", reg);
        })
        .catch(function(error) {
            console.log("Failed to register ServiceWorker", error);
        });
}

function oneWayCommunication() {
    // ONE WAY COMMUNICATION
    if (navigator.serviceWorker.controller) {
        console.log("Sending message to service worker");
        navigator.serviceWorker.controller.postMessage({
            "command": "oneWayCommunication",
            "message": "Hi, SW"
        });
    } else {
        console.log("No active ServiceWorker");
    }
}

function twoWayCommunication() {
    if (navigator.serviceWorker.controller) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function(event) {
            console.log("Response from the SW : ", event.data.message);
        }

        console.log("Sending message to the service worker");
        navigator.serviceWorker.controller.postMessage({
            "command": "twoWayCommunication",
            "message": "Hi, SW"
        }, [messageChannel.port2]);
    } else {
        console.log("No active ServiceWorker");
    }
}

function registerBroadcastReceiver() {
    navigator.serviceWorker.onmessage = function(event) {
        console.log("Broadcasted from SW : ", event.data);

        var data = event.data;

        if (data.command == "broadcastOnRequest") {
            console.log("Broadcasted message from the ServiceWorker : ", data.message);
        }
    };
}

function requestBroadcast() {
    console.log("Requesting for broadcast");
    registerBroadcastReceiver();
    if (navigator.serviceWorker.controller) {
        console.log("Sending message to service worker");
        navigator.serviceWorker.controller.postMessage({
            "command": "broadcast"
        });
    } else {
        console.log("No active ServiceWorker");
    }
}

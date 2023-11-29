// Function to set minutes to "00" and disable minute selection
function setMinutesToZero(input) {
    if (input.value) {
        const parts = input.value.split(":");
        if (parts.length === 2) {
            input.value = parts[0] + ":00";
        }
    }
}

// Function to format the date as "YYYY-MM-DD"
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to format the time as "HH:00"
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    return `${hours}:00`;
}

// Set the value of the date and time inputs to the current date and time
document.getElementById("date").value = getCurrentDate();
document.getElementById("time").value = getCurrentTime();


let isSimulationRunning = false;

// Function to start or stop the simulation
function toggleSimulation() {
    isSimulationRunning = !isSimulationRunning;
    const simulationButton = document.getElementById("runButton");
    simulationButton.textContent = isSimulationRunning ? "Stop" : "Run";
    console.log("Clicked");


    // Start or stop the simulation
    if (isSimulationRunning) {
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const model = document.getElementById('modelSelect').value;


        startSimulation(date,time,model);
    } else {
        stopSimulation();
    }
}

// Function to update predictions for each hour
function updatePredictionsForHour(date_time, model) {
    fetch("http://localhost:5000/update-predictions?date_time=" + date_time + "&model=" + model)
        .then(response => response.json())
        .then(predictions => {
            // Update the HTML content with the new predictions
            const lane1 = document.getElementById("lane1");
            const lane2 = document.getElementById("lane2");
            const lane3 = document.getElementById("lane3");
            const lane4 = document.getElementById("lane4");

            // Define the thresholds for color coding
            const greenThreshold = 55;
            const yellowThreshold = 110;

            // Update lane 1
            const trafficSize1 = predictions['lane1'];
            lane1.querySelector(".traffic-size").textContent = 'Traffic: ' + trafficSize1;

            if (trafficSize1 < greenThreshold) {
                lane1.querySelector(".road").style.backgroundColor = 'green';
            } else if (trafficSize1 >= greenThreshold && trafficSize1 <= yellowThreshold) {
                lane1.querySelector(".road").style.backgroundColor = 'yellow';
            } else {
                lane1.querySelector(".road").style.backgroundColor = 'red';
            }

            // Update lane 2, lane 3, and lane 4 similarly
            const trafficSize2 = predictions['lane2'];
            lane2.querySelector(".traffic-size").textContent = 'Traffic: ' + trafficSize2;

            if (trafficSize2 < greenThreshold) {
                lane2.querySelector(".road").style.backgroundColor = 'green';
            } else if (trafficSize2 >= greenThreshold && trafficSize2 <= yellowThreshold) {
                lane2.querySelector(".road").style.backgroundColor = 'yellow';
            } else {
                lane2.querySelector(".road").style.backgroundColor = 'red';
            }

            const trafficSize3 = predictions['lane3'];
            lane3.querySelector(".traffic-size").textContent = 'Traffic: ' + trafficSize3;

            if (trafficSize2 < greenThreshold) {
                lane3.querySelector(".road").style.backgroundColor = 'green';
            } else if (trafficSize2 >= greenThreshold && trafficSize3 <= yellowThreshold) {
                lane3.querySelector(".road").style.backgroundColor = 'yellow';
            } else {
                lane3.querySelector(".road").style.backgroundColor = 'red';
            }

            const trafficSize4 = predictions['lane4'];
            lane4.querySelector(".traffic-size").textContent = 'Traffic: ' + trafficSize4;

            if (trafficSize2 < greenThreshold) {
                lane4.querySelector(".road").style.backgroundColor = 'green';
            } else if (trafficSize2 >= greenThreshold && trafficSize4 <= yellowThreshold) {
                lane4.querySelector(".road").style.backgroundColor = 'yellow';
            } else {
                lane4.querySelector(".road").style.backgroundColor = 'red';
            }

            // Repeat the above logic for lane 3 and lane 4

        })
        .catch(error => {
            console.error("Error:", error);
        });
}


let currentHour = 0;
let simulationInterval;

// Function to start the simulation with date and time updates
function startSimulation(date, time, model) {
    currentHour = 0;
    
    // Create a new Date object and set it to the provided date and time
    let simulationDate = new Date(`${date}T${time}`);
    simulationDate.setHours(simulationDate.getHours() + 5);
    simulationDate.setMinutes(simulationDate.getMinutes() + 30);
    // console.log(simulationDate);
    
    simulationInterval = setInterval(() => {
        // Add one hour to the simulation date
        simulationDate.setHours(simulationDate.getHours() + 1);
        console.log(simulationDate);
        
        // Update the date and time values in the frontend
        const updatedDate = simulationDate.toISOString().split("T")[0];
        const updatedTime = simulationDate.toISOString().split("T")[1].substring(0, 5);
        
        console.log(updatedDate);
        console.log(updatedTime);

        document.getElementById("date").value = updatedDate;
        document.getElementById("time").value = updatedTime;
        
        // Update predictions with the updated date and time
        updatePredictionsForHour(updatedDate, updatedTime, model);
    }, 1000);
}
// Function to stop the simulation
function stopSimulation() {
    clearInterval(simulationInterval);
    currentHour = 0;
    // updatePredictionsForHour(date, time, model);
}

// Add a click event handler for the "Run" button
// document.getElementById("runButton").addEventListener("click", toggleSimulation);
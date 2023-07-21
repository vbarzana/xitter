const SECONDS_DIFF_TO_HIGHLIGHT = 15;

function findTimestampColumn(frame) {
    let pos = -1;
    frame.querySelectorAll('.logs-table__header-row .logs-table__header-cell').forEach((cell, idx) => {
        if (cell.innerHTML.indexOf('timestamp') > 0) {
            pos = idx + 1;
            return true;
        }
    });
    return pos;
}

function parseTimestamp(timestamp) {
    // Convert the timestamp string to a Date object
    return new Date(timestamp);
}

function isNSecondsBefore(date1, date2, seconds = SECONDS_DIFF_TO_HIGHLIGHT) {
    // Calculate the time difference in milliseconds between two Date objects
    const timeDifference = Math.abs(date1 - date2);
    const thirtySecondsInMilliseconds = seconds * 1000; // 30 seconds in milliseconds
    return timeDifference >= thirtySecondsInMilliseconds;
}

function formatMilliseconds(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes} min ${formattedSeconds} seconds`;
}

function highlightTimestampsInFrame(frame) {
    const allCells = Array.from(frame.querySelectorAll('.logs-table__body-cell'));
    for(let cell of allCells){
        if(cell.innerHTML.match(/error/ig)){
            cell.style.color = 'red';
        }
        if(cell.innerHTML.indexOf('startPaymentGateway_INITRequest') >= 0){
            cell.style.fontWeight = 'bold';
            cell.style.fontFamily = 'Amazon Ember';
            cell.style.fontSize = '14px';
        }
    }
    if (isQueryRunning(frame)) {
        return;
    }
    const timestampPos = findTimestampColumn(frame);
    const timestampNodes = frame.querySelectorAll(
        `.logs-table__body-cell:nth-child(${timestampPos})`
    );

    const timestamps = Array.from(timestampNodes);

    for (let i = 0; i < timestamps.length - 1; i++) {
        const currentTimestamp = parseTimestamp(timestamps[i].innerHTML);
        const nextTimestamp = parseTimestamp(timestamps[i + 1].innerHTML);

        if (isNSecondsBefore(currentTimestamp, nextTimestamp)) {
            // Apply the yellow background color directly to the DOM node
            timestamps[i].style.color = 'orange';
            const formattedTime = formatMilliseconds(Math.abs(currentTimestamp - nextTimestamp));

            timestamps[i].title = `Operation took ${formattedTime}`
        }
    }
}

function isQueryRunning(frame) {
    const btn = frame.querySelector('[data-testid="scroll-run-query"] button');
    return btn && btn.disabled;
}

function highlightTimestampsOnPage(frame) {
    try {
        highlightTimestampsInFrame(document);
    } catch (err) {
        console.log(err);
    }
    const iframes = window.frames;
    for (let i = 0; i < iframes.length; i++) {
        try {
            highlightTimestampsInFrame(iframes[i].document);
        } catch (err) {
            if (err.message.indexOf('Blocked a frame') < 0) {
                console.warn(err);
            }
        }
    }
}

setInterval(function () {
    highlightTimestampsOnPage();
}, 3000);
let m, s, dimensions, n;
let i = 0, j = 0, length = 2, k = 0;
let processing = false;
let stepDelay = 1000; // Delay between steps in milliseconds

document.getElementById('start-simulation').addEventListener('click', function () {
    const input = document.getElementById('matrix-dimensions').value.trim();
    if (!input) {
        alert('Please enter matrix dimensions.');
        return;
    }

    dimensions = input.split(/\s+/).map(Number);
    if (dimensions.length < 2) {
        alert('Please enter at least two matrix dimensions.');
        return;
    }

    n = dimensions.length - 1;
    m = Array.from({ length: n }, () => Array(n).fill(0));
    s = Array.from({ length: n }, () => Array(n).fill(0));

    // Initialize diagonal elements to 0
    for (let i = 0; i < n; i++) {
        m[i][i] = 0;
    }

    // Initialize other elements to Infinity
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j) m[i][j] = Infinity;
        }
    }

    i = 0;
    length = 2;
    k = 0;
    processing = true;

    document.getElementById('dp-table').innerHTML = renderDPTable(m);
    document.getElementById('result').innerHTML = '';
    document.getElementById('calculation-log').innerHTML = '';
    document.getElementById('next-step').style.display = 'none'; // Hide next step button
    document.getElementById('reset-simulation').style.display = 'inline-block';

    // Start automatic simulation
    automaticSimulation();
});

document.getElementById('reset-simulation').addEventListener('click', function () {
    document.getElementById('matrix-dimensions').value = '';
    document.getElementById('dp-table').innerHTML = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('calculation-log').innerHTML = '';
    document.getElementById('next-step').style.display = 'none';
    document.getElementById('reset-simulation').style.display = 'none';
    processing = false;
});

function automaticSimulation() {
    if (!processing) return;

    if (length > n) {
        processing = false;
        const cost = m[0][n - 1];
        const parenthesization = buildOptimalParenthesization(s, 0, n - 1);
        document.getElementById('result').innerHTML =
            `Optimal cost: ${cost}<br>Optimal Parenthesization: ${parenthesization}`;
        return;
    }

    if (i > n - length) {
        length++;
        i = 0;
        k = i;
        document.getElementById('dp-table').innerHTML = renderDPTable(m);
        setTimeout(automaticSimulation, stepDelay);
        return;
    }

    j = i + length - 1;

    if (k < j) {
        const cost = m[i][k] + m[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
        const logMessage = `Calculating m[${i}][${j}] with k=${k}: ${m[i][k]} + ${m[k + 1][j]} + ${dimensions[i]}*${dimensions[k + 1]}*${dimensions[j + 1]} = ${cost}`;
        document.getElementById('calculation-log').innerHTML = logMessage; // Update the log
        console.log(logMessage); // Optional: log to console

        if (cost < m[i][j]) {
            m[i][j] = cost;
            s[i][j] = k;
        }

        k++;
        document.getElementById('dp-table').innerHTML = renderDPTable(m, i, j);
        setTimeout(automaticSimulation, stepDelay);
    } else {
        i++;
        k = i;
        setTimeout(automaticSimulation, stepDelay);
    }
}

function renderDPTable(dp, highlightI = -1, highlightJ = -1) {
    let html = '<table border="1"><tr><th></th>';
    for (let c = 0; c < n; c++) {
        html += `<th>${String.fromCharCode(65 + c)}</th>`;
    }
    html += '</tr>';

    for (let r = 0; r < n; r++) {
        html += `<tr><th>${String.fromCharCode(65 + r)}</th>`;
        for (let c = 0; c < n; c++) {
            let val = dp[r][c] === Infinity ? '' : dp[r][c];
            const className = (r === highlightI && c === highlightJ) ? 'highlight' : '';
            html += `<td class="${className}">${val}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

function buildOptimalParenthesization(s, i, j) {
    if (i === j) return String.fromCharCode(65 + i); // A, B, C...
    return `(${buildOptimalParenthesization(s, i, s[i][j])} × ${buildOptimalParenthesization(s, s[i][j] + 1, j)})`;
}
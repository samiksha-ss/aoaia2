document.getElementById('run-simulation').addEventListener('click', function () {
    // Get the input matrix dimensions
    const input = document.getElementById('matrix-dimensions').value;
    const dimensions = input.split(' ').map(Number);
    
    if (dimensions.length < 2) {
        alert('Please enter at least two matrix dimensions.');
        return;
    }

    const n = dimensions.length - 1;
    const m = Array(n).fill().map(() => Array(n).fill(0)); // DP table
    const s = Array(n).fill().map(() => Array(n).fill(0)); // Table for splits

    // Fill the DP table using the Matrix Chain Multiplication formula
    for (let length = 2; length <= n; length++) {
        for (let i = 0; i < n - length + 1; i++) {
            let j = i + length - 1;
            m[i][j] = Infinity;
            for (let k = i; k < j; k++) {
                let q = m[i][k] + m[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
                if (q < m[i][j]) {
                    m[i][j] = q;
                    s[i][j] = k;
                }
            }
        }
    }

    // Display results
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `Optimal cost: ${m[0][n-1]}`;

    // Show DP table (for debug/insight)
    const dpTableDiv = document.getElementById('dp-table');
    let tableHTML = '<table border="1">';
    for (let i = 0; i < n; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < n; j++) {
            tableHTML += `<td>${m[i][j]}</td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    dpTableDiv.innerHTML = tableHTML;
});
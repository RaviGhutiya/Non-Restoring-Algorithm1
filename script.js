// Function to reveal the divisor input section after the dividend is entered
function enterDivisor() {
  // Display the divisor input section
  document.getElementById('divisor-section').style.display = 'block';
}

// Main function to execute the Non-Restoring Division Algorithm
async function runNonRestoringDivision() {
  // Get the values entered for dividend and divisor in binary format
  const dividendInput = document.getElementById('dividend').value;
  const divisorInput = document.getElementById('divisor').value;

  // Validate if both dividend and divisor are valid binary numbers
  if (!isValidBinary(dividendInput) || !isValidBinary(divisorInput)) {
    alert('Please enter valid binary numbers.');
    return;
  }

  // Parse binary input to decimal integers
  let dividend = parseInt(dividendInput, 2);
  let divisor = parseInt(divisorInput, 2);
  
  // Get the selected bit size (4-bit or 8-bit)
  let n = document.getElementById('bit-select').value; // Use the selected bit size (4 or 8)

  // Initialize variables for Accumulator (A) and Quotient (Q)
  let A = 0;  // Accumulator
  let Q = dividend & ((1 << n) - 1);  // Set Q to the lower n bits of the dividend
  let M = divisor & ((1 << n) - 1);  // Set M to the lower n bits of the divisor

  // Get the output table element and clear previous results
  let output = document.getElementById('output');
  output.innerHTML = '';

  // Loop for n steps, where n is the number of bits
  for (let i = 0; i < n; i++) {
    // Step 2 & 3: Check the most significant bit of the accumulator (A) and perform operations
    const carryBit = (Q & (1 << (n - 1))) >> (n - 1);  // Get the carry bit (MSB of Q)
    A = ((A << 1) & ((1 << n) - 1)) | carryBit;  // Shift A left and add the carry bit from Q
    Q = ((Q << 1) & ((1 << n) - 1));  // Shift Q left
    
    // Default operation is shift left, but we will modify if we need to add or subtract M
    let operation = 'Shift Left';
    let rowClass = 'shift-highlight'; // Row style class for shift operation

    // Determine whether to add or subtract the divisor (M) based on the MSB of A
    if ((A & (1 << (n - 1))) === (1 << (n - 1))) {
      A = (A + M) & ((1 << n) - 1);  // Add M to A if MSB is 1
      operation += ' & Add M';
      rowClass = 'add-highlight'; // Row style class for add operation
    } else {
      A = (A - M) & ((1 << n) - 1);  // Subtract M from A if MSB is 0
      operation += ' & Subtract M';
      rowClass = 'subtract-highlight'; // Row style class for subtract operation
    }

    // Step 5: Set Q[0] (Least Significant bit of Q)
    if ((A & (1 << (n - 1))) === (1 << (n - 1))) {
      Q &= ~1;  // If A's MSB is 1, set Q[0] to 0
    } else {
      Q |= 1;  // If A's MSB is 0, set Q[0] to 1
    }

    // Step 6 & 7: Log results in the table with animation
    output.innerHTML += `<tr class="${rowClass}">
      <td>${i + 1}</td>
      <td class="animate-bit">${formatBinary(A, n)} (${A})</td>
      <td class="animate-bit">${formatBinary(Q, n)} (${Q})</td>
      <td class="animate-op">${operation} (Carry Bit: ${carryBit})</td>
    </tr>`;

    // Wait for 1.5 seconds before the next step to simulate the algorithm's progress
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Step 8: Final correction if the accumulator A is negative
  if ((A & (1 << (n - 1))) === (1 << (n - 1))) {
    A = (A + M) & ((1 << n) - 1);  // Final correction: Add M if A is negative
  }

  // Display the final result (quotient and remainder)
  document.getElementById('final-result').innerHTML = `Final Quotient: ${formatBinary(Q, n)} (${Q}), Remainder: ${formatBinary(A, n)} (${A})`;
}

// Helper function to validate if a number is a valid binary string
function isValidBinary(num) {
  return /^[01]+$/.test(num);  // Check if the string contains only 0s and 1s
}

// Helper function to format a number as a binary string, padding with leading zeros
function formatBinary(num, bits) {
  return (num >>> 0).toString(2).padStart(bits, '0').slice(-bits);  // Convert to binary and pad to the required bit size
}

// Add CSS styles for animation
const style = document.createElement('style');
style.innerHTML = `
  .animate-bit {
    animation: bitMove 1s ease-in-out, fadeIn 0.5s;
  }

  @keyframes bitMove {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-op {
    animation: highlight 1s ease-in-out, pulse 1.5s infinite;
  }

  @keyframes highlight {
    from { background-color: yellow; }
    to { background-color: transparent; }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .shift-highlight {
    animation: shiftGlow 1s ease-in-out;
  }

  .add-highlight {
    animation: addGlow 1s ease-in-out;
  }

  .subtract-highlight {
    animation: subtractGlow 1s ease-in-out;
  }

  @keyframes shiftGlow {
    from { box-shadow: 0 0 15px rgba(0, 255, 0, 0.8); }
    to { box-shadow: none; }
  }

  @keyframes addGlow {
    from { box-shadow: 0 0 15px rgba(0, 0, 255, 0.8); }
    to { box-shadow: none; }
  }

  @keyframes subtractGlow {
    from { box-shadow: 0 0 15px rgba(255, 0, 0, 0.8); }
    to { box-shadow: none; }
  }
`;
document.head.appendChild(style);

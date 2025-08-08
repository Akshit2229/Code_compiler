const compileBtn = document.getElementById('compileBtn');
const outputConsole = document.getElementById('output-console');

compileBtn.addEventListener('click', function () {
  const code = document.getElementById('code').value.trim();
  const langId = document.getElementById('language').value;

  if (!code) {
    outputConsole.textContent = "Error: Code is empty!";
    return;
  }

  outputConsole.textContent = "Compiling your code...";

  // User Story 2 - Send POST request
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://codequotient.com/api/executeCode", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);

      if (response.error) {
        outputConsole.textContent = "Error: " + response.error;
      } else if (response.codeId) {
        // User Story 4 - Poll for result
        let intervalId = setInterval(() => {
          fetchResult(response.codeId, intervalId);
        }, 2000);
      }
    }
  };

  xhr.send(JSON.stringify({ code: code, langId: langId }));
});

// Function to fetch result
function fetchResult(codeId, intervalId) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `https://codequotient.com/api/codeResult/${codeId}`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);

      if (response.data && Object.keys(response.data).length > 0) {
        clearInterval(intervalId); // Stop polling when result is ready
        if (response.data.errors) {
          outputConsole.textContent = response.data.errors;
        } else {
          outputConsole.textContent = response.data.output;
        }
      }
    }
  };

  xhr.send();
}

let uploadedImageBase64 = "";

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      uploadedImageBase64 = reader.result;
      const output = document.getElementById('preview');
      output.src = uploadedImageBase64;
      output.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function getdata() {
  var onstreet = document.getElementById("onstreet").value.trim();
  var fromstreet = document.getElementById("fstreet").value.trim();
  var tostreet = document.getElementById("tstreet").value.trim();
  var size = document.getElementById("size").value.trim();
  var addcom = document.getElementById("comments").value.trim();

  if (!onstreet || !fromstreet || !tostreet || !size) {
    alert("Please fill in all required fields.");
    return false;
  }

  var currentdate = new Date();
  var datetime = (currentdate.getMonth() + 1) + "/"
    + currentdate.getDate() + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours().toString().padStart(2, '0') + ":"
    + currentdate.getMinutes().toString().padStart(2, '0') + ":"
    + currentdate.getSeconds().toString().padStart(2, '0');

  let counter = parseInt(localStorage.getItem("counter")) || 0;

  localStorage.setItem("location" + counter, `${onstreet}, ${fromstreet}, ${tostreet}`);
  localStorage.setItem("sizeest" + counter, size);
  localStorage.setItem("comments" + counter, addcom);
  localStorage.setItem("date" + counter, datetime);

  if (uploadedImageBase64) {
    localStorage.setItem("image" + counter, uploadedImageBase64);
  }

  localStorage.setItem("counter", counter + 1);

  alert("✅ Complaint submitted successfully!");
  window.location.href = "activedatabase.html";
  return false;
}

function putintodatabase() {
  var table = document.getElementById("myTable");
  if (!table) {
    console.error("Table with ID 'myTable' not found.");
    return;
  }

  let counter = parseInt(localStorage.getItem("counter")) || 0;
  for (let i = 0; i < counter; i++) {
    var location = localStorage.getItem("location" + i);
    var size = localStorage.getItem("sizeest" + i);
    var comment = localStorage.getItem("comments" + i);
    var date = localStorage.getItem("date" + i);

    if (location && size && comment && date) {
      var row = table.insertRow(1);
      row.insertCell(0).innerText = location;
      row.insertCell(1).innerText = size;
      row.insertCell(2).innerText = comment;
      row.insertCell(3).innerText = date;
    }
  }
}

function downloadCSV() {
  let csv = "Location,Size Estimate,Comments,Date Posted\n";
  const counter = parseInt(localStorage.getItem("counter")) || 0;

  for (let i = 0; i < counter; i++) {
    const location = localStorage.getItem("location" + i) || "";
    const size = localStorage.getItem("sizeest" + i) || "";
    const comments = localStorage.getItem("comments" + i) || "";
    const date = localStorage.getItem("date" + i) || "";

    const row = [
      `"${location}"`,
      `"${size}"`,
      `"${comments.replace(/"/g, '""')}"`,
      `"${date}"`
    ].join(",");
    csv += row + "\n";
  }

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "pothole_reports.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

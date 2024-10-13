function showTab(evt, tabName) {
    // Hide all tab contents
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the active class from all tabs
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab and add the active class to the clicked tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function showTab(evt, tabName) {
    // ซ่อนแท็บทั้งหมด
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // รีเซ็ตแท็บทั้งหมดให้เป็น inactive
    var tablinks = document.getElementsByClassName("tablink");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
        tablinks[i].className = tablinks[i].className.replace(" inactive", "inactive");
    }

    // แสดงแท็บที่เลือกและทำให้แท็บนั้น active
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className = evt.currentTarget.className.replace("inactive", "");
    evt.currentTarget.className += " active";
}

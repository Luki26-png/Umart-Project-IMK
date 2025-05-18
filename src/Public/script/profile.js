document.getElementById('uploaded-profile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const previewImage = document.getElementById('profile-picture');
        previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file); // Reads file as base64 URL
});

document.getElementById('simpan-profile-button').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData();

    // Grab values and trim
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('no-hp').value.trim();
    const address = document.getElementById('alamat').value.trim();
    const fileInput = document.getElementById('uploaded-profile');

    // Track how many fields actually have values
    let hasData = false;

    if (username) {
        formData.append('name', username);
        hasData = true;
    }

    if (phone) {
        formData.append('phone_number', phone);
        hasData = true;
    }

    if (address) {
        formData.append('address', address);
        hasData = true;
    }

    if (fileInput.files.length > 0) {
        formData.append('profile_picture', fileInput.files[0]);
        hasData = true;
    }

            // Don't send if no data at all
    if (!hasData) {
        alert('Tidak ada data yang diisi. Form tidak dikirim.');
        return;
    }

    // Send to server
    fetch('/user/profile', {
        method: 'PUT',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error('Terjadi kesalahan pada server');
        return response.json(); // Or .text() if your server doesn't return JSON
    })
    .then(data => {
        // Show the success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
        console.log(data);
    })
    .catch(error => {
        alert('Gagal mengirim data: ' + error.message);
    });
});
    
document.getElementById('riset-profile-button').addEventListener('click', function (event) {
    event.preventDefault();
    const username = document.getElementById('username');
    const phone = document.getElementById('no-hp');
    const address = document.getElementById('alamat');
    username.value = username.placeholder === "Masukkan Nama Lengkap Anda" ? "" : username.placeholder;
    phone.value = phone.placeholder === "Masukkan Nomor Telepon Anda" ? "" : phone.placeholder;
    address.value = address.placeholder === "Masukkan Alamat Anda" ? "" : address.placeholder;
});

// Add event listener for when the modal is hidden
const successModalElement = document.getElementById('successModal');
successModalElement.addEventListener('hidden.bs.modal', function () {
    window.location.reload();
});

    // Skema baku (default)
    const DEFAULT_ITEM = {
      jenis_surat: '{{ $json.data[0].jenis_surat }}',
      nomor_surat: '{{ $json.data[0].nomor_surat }}',
      tanggal_surat: '{{ $json.data[0].tanggal_surat }}',
      pemohon: {
        nama: '{{ $json.data[0].pemohon.nama }}',
        nik: '{{ $json.data[0].pemohon.nik }}',
        ttl: '{{ $json.data[0].pemohon.ttl }}',
        agama: '{{ $json.data[0].pemohon.agama }}',
        jenis_kelamin: '{{ $json.data[0].pemohon.jenis_kelamin }}',
        status_perkawinan: '{{ $json.data[0].pemohon.status_perkawinan }}',
        pekerjaan: '{{ $json.data[0].pemohon.pekerjaan }}',
        alamat: '{{ $json.data[0].pemohon.alamat }}',
        kelurahan: '{{ $json.data[0].pemohon.kelurahan }}',
        kecamatan: '{{ $json.data[0].pemohon.kecamatan }}',
        kota_kab: '{{ $json.data[0].pemohon.kota_kab }}',
        provinsi: '{{ $json.data[0].pemohon.provinsi }}',
        domisili: '{{ $json.data[0].pemohon.domisili }}'
      },
      dokumen: {{ JSON.stringify($json.data[0].dokumen) }},
      penandatangan: {
        nama: '{{ $json.data[0].penandatangan.nama }}',
        nip: '{{ $json.data[0].penandatangan.nip }}',
        jabatan: '{{ $json.data[0].penandatangan.jabatan }}'
      },
      operator: '{{ $json.data[0].operator }}',
      ref: '{{ $json.data[0].ref }}',
      WAHA_Trigger_session: '{{ $json.data[0].WAHA_Trigger_session }}',
      WAHA_Trigger_payload_from: '{{ $json.data[0].WAHA_Trigger_payload_from }}',
      LogoURL: '{{ $json.data[0].LogoURL }}',
      URL_CREATE: '{{ $json.data[0].URL_CREATE }}',
      URL_UPDATE: '{{ $json.data[0].URL_UPDATE }}',
      URL_DELETE: '{{ $json.data[0].URL_DELETE }}',
      URL_UPLOAD: '{{ $json.data[0].URL_UPLOAD }}',
      URL_DELETE_FILE: '{{ $json.data[0].URL_DELETE_FILE }}',
      id_user: '{{ $json.id }}',
      url_web_link: window.location.href,
      files_info: {{ JSON.stringify($json.data[0].files_info) }}
    };

    // Controller untuk data
    function createDataController() {
      // Data utama, bisa diisi dari JSON
      let data = [JSON.parse(JSON.stringify(DEFAULT_ITEM))];

      // Fungsi untuk menambah dokumen baru
      function addDokumen(itemIndex, dokumenBaru) {
        data[itemIndex].dokumen.push(dokumenBaru);
      }

      // Fungsi untuk mengirim data saat tombol diklik
      function sendAllData() {
        // Contoh: kirim ke server, atau tampilkan di console
        console.log('Data dikirim:', data);
        // Tampilkan popup sukses
        document.getElementById('popupOverlay').style.display = 'flex';
      }

      // Fungsi untuk menambah file_info
      function addFileInfo(itemIndex, fileInfo) {
        data[itemIndex].files_info.push(fileInfo);
      }

      return { addDokumen, sendAllData, addFileInfo, data };
    }

    // Inisialisasi controller
    const dataController = createDataController();

    // Contoh integrasi dengan tombol
    function generateAndSendLetter() {
      // Kirim semua data
      dataController.sendAllData();
    }

    function deleteLetterAndData() {
      // Reset data
      dataController.data = [JSON.parse(JSON.stringify(DEFAULT_ITEM))];
      alert('Surat dan data berhasil dihapus!');
      // Sembunyikan popup jika ada
      document.getElementById('popupOverlay').style.display = 'none';
    }

    function closePopup() {
      document.getElementById('popupOverlay').style.display = 'none';
    }

    let selectedFiles = [];
let uploadedFiles = [];


    function updateUploadedFilesDisplay() {
      const container = document.getElementById('uploadedFilesList');
      const dokumenArray = dataController.data[0].dokumen || [];
      if (!dokumenArray.length) {
        container.innerHTML = '<div class="no-files-message">Belum ada file yang diupload</div>';
        return;
      }
      const totalSize = dokumenArray.reduce((sum, file) => sum + (file.size || 0), 0);
      let html = `
        <div style="margin-bottom: 12px; padding: 8px 12px; background: rgba(56,189,248,.1); border: 1px solid rgba(56,189,248,.3); border-radius: 8px; font-size: 12px; color: #e0f2fe;">
          📁 Total: <strong>${dokumenArray.length}</strong> file • 📏 Total ukuran: <strong>${formatFileSize(totalSize)}</strong>
        </div>
      `;
      html += dokumenArray.map(doc => `
        <div class="uploaded-file-item">
          <div class="file-icon">${getFileIcon(doc.mimeType || 'unknown')}</div>
          <div class="file-details">
            <div class="file-name">
              ${doc.view_url && doc.view_url !== '#' ? `<a href="${doc.view_url}" target="_blank" style="color: #22c55e; text-decoration: none;">${doc.name}</a>` : doc.name}
            </div>
            <div class="file-meta">
              ${formatFileSize(doc.size || 0)}${doc.createdTime ? ' • ' + new Date(doc.createdTime).toLocaleString('id-ID') : ''}
            </div>
            ${doc.label ? `<div style="font-size: 10px; color: #22c55e; margin-top: 2px;">${doc.label}</div>` : ''}
          </div>
          <button class="file-remove" onclick="deleteFile('${doc.id || ''}')" title="Hapus file">
            🗑️
          </button>
        </div>
      `).join('');
      container.innerHTML = html;
    }

    function getFileIcon(fileType) {
      if (fileType.includes('pdf')) return '📄';
      if (fileType.includes('image')) return '🖼️';
      if (fileType.includes('word') || fileType.includes('document')) return '📝';
      if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
      if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📽️';
      if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('archive')) return '🗜️';
      return '📎';
    }

    function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    document.addEventListener('DOMContentLoaded', updateUploadedFilesDisplay);

    // Fungsi untuk menghapus file
    function deleteFile(fileId) {
      if (!fileId) return;
      
      if (confirm('Apakah Anda yakin ingin menghapus file ini?')) {
        // Hapus dari data controller
        const dokumenArray = dataController.data[0].dokumen || [];
        const index = dokumenArray.findIndex(doc => doc.id === fileId);
        if (index !== -1) {
          dokumenArray.splice(index, 1);
          // Update tampilan
          updateUploadedFilesDisplay();
          
          // Kirim ke server untuk menghapus file
          fetch(dataController.data[0].URL_DELETE_FILE, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              file_id: fileId,
              action: 'delete_file',
              id_user: dataController.data[0].id_user
            })
          })
          .then(response => response.json())
          .then(data => {
            if (data.success || data.status === 'success' || data.message === 'Workflow was started') {
              console.log('File berhasil dihapus');
            } else {
              console.error('Gagal menghapus file:', data.message);
            }
          })
          .catch(error => {
            console.error('Error saat menghapus file:', error);
          });
        }
      }
    }

function handleFileSelect(event) {
  const files = Array.from(event.target.files);
  const fileInfo = document.getElementById('fileInfo');
  const uploadBtn = document.getElementById('uploadBtn');
  if (files.length === 0) {
    fileInfo.style.display = 'none';
    uploadBtn.style.display = 'none';
    selectedFiles = [];
    return;
  }
  selectedFiles = [];
  let validFiles = [];
  let errorMessages = [];
  files.forEach(file => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errorMessages.push(`❌ ${file.name} terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal 10MB.`);
      return;
    }
    validFiles.push(file);
    selectedFiles.push(file);
  });
  let infoHTML = '';
  if (errorMessages.length > 0) infoHTML += errorMessages.join('<br>') + '<br>';
  if (validFiles.length > 0) {
    const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0);
    const fileList = validFiles.map(file => `• ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`).join('<br>');
    infoHTML += `✅ ${validFiles.length} file dipilih:<br>${fileList}<br>📏 Total: ${(totalSize / 1024 / 1024).toFixed(2)}MB`;
    uploadBtn.style.display = 'block';
  } else {
    uploadBtn.style.display = 'none';
  }
  if (infoHTML) {
    fileInfo.innerHTML = infoHTML;
    fileInfo.className = errorMessages.length > 0 ? 'file-info error' : 'file-info';
    fileInfo.style.display = 'block';
  } else {
    fileInfo.style.display = 'none';
  }
}

function uploadFiles() {
  if (selectedFiles.length === 0) return;
  const uploadBtn = document.getElementById('uploadBtn');
  const fileInfo = document.getElementById('fileInfo');
  const progressContainer = document.getElementById('uploadProgress');
  const progressBar = document.getElementById('uploadProgressBar');
  uploadBtn.disabled = true;
  uploadBtn.textContent = '📤 Mengirim...';
  progressContainer.style.display = 'block';
  progressBar.style.width = '0%';

  // Kirim data tetap + file
  const payload = {
    ...dataController.data[0], // Data tetap
    action: 'upload_multiple',
    timestamp: new Date().toISOString(),
    files_count: selectedFiles.length,
    files_info: selectedFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }))
  };

  const formData = new FormData();
  selectedFiles.forEach(file => {
    formData.append('files', file);
  });
  formData.append('data', JSON.stringify(payload));

  // Simulasi progress
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress > 90) progress = 90;
    progressBar.style.width = progress + '%';
  }, 200);

  fetch(dataController.data[0].URL_UPLOAD, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    clearInterval(progressInterval);
    progressBar.style.width = '100%';
    setTimeout(() => {
      if (data.success || data.status === 'success') {
        selectedFiles.forEach(file => {
          uploadedFiles.push({
            id: Date.now().toString() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString(),
            status: 'Berhasil diupload'
          });
        });
        fileInfo.innerHTML = `✅ ${selectedFiles.length} file berhasil diunggah`;
        fileInfo.className = 'file-info';
        document.getElementById('fileInput').value = '';
        selectedFiles = [];
      } else {
        // Jika pesan error adalah 'Workflow was started', tampilkan pesan sukses
        if (data.message && data.message === 'Workflow was started') {
          fileInfo.innerHTML = `✅ File berhasil dikirim, workflow sudah dimulai.`;
          fileInfo.className = 'file-info';
        } else {
          fileInfo.innerHTML = `❌ Gagal mengunggah file: ${data.message || 'Unknown error'}`;
          fileInfo.className = 'file-info error';
        }
      }
      uploadBtn.disabled = false;
      uploadBtn.textContent = '📤 Kirim File';
      uploadBtn.style.display = 'none';
      progressContainer.style.display = 'none';
    }, 500);
  })
  .catch(error => {
    clearInterval(progressInterval);
    fileInfo.innerHTML = `❌ Gagal mengunggah ${selectedFiles.length} file`;
    fileInfo.className = 'file-info error';
    uploadBtn.disabled = false;
    uploadBtn.textContent = '📤 Kirim File';
    progressContainer.style.display = 'none';
  });
}

let isEditMode = false;
let originalData = {};

function toggleEditMode() {
  const card = document.querySelector('.card');
  const editBtn = document.getElementById('editBtn');
  if (!isEditMode) {
    // Masuk mode edit
    card.classList.add('edit-mode');
    editBtn.textContent = '👁️ Lihat Data';
    editBtn.classList.remove('ghost');
    editBtn.classList.add('info');
    // Simpan data asli
    originalData = {
      nama: document.querySelector('#editNama').value,
      nik: document.querySelector('#editNIK').value,
      ttl: document.querySelector('#editTTL').value,
      agama: document.querySelector('#editAgama').value,
      jenisKelamin: document.querySelector('#editJenisKelamin').value,
      statusPerkawinan: document.querySelector('#editStatusPerkawinan').value,
      pekerjaan: document.querySelector('#editPekerjaan').value,
      alamat: document.querySelector('#editAlamat').value,
      kelurahan: document.querySelector('#editKelurahan').value,
      kecamatan: document.querySelector('#editKecamatan').value,
      kota_kab: document.querySelector('#editKotaKab').value,
      provinsi: document.querySelector('#editProvinsi').value
    };
    isEditMode = true;
  } else {
    // Keluar mode edit
    card.classList.remove('edit-mode');
    editBtn.textContent = '✏️ Edit Data';
    editBtn.classList.remove('info');
    editBtn.classList.add('ghost');
    isEditMode = false;
    // Segera tampilkan perubahan di UI tanpa menunggu respon server
    updatePemohonUI();
  }
}

function cancelEdit() {
  // Pulihkan data asli
  document.querySelector('#editNama').value = originalData.nama || '-';
  document.querySelector('#editNIK').value = originalData.nik || '-';
  document.querySelector('#editTTL').value = originalData.ttl || '-';
  document.querySelector('#editAgama').value = originalData.agama || '-';
  document.querySelector('#editJenisKelamin').value = originalData.jenisKelamin || '-';
  document.querySelector('#editStatusPerkawinan').value = originalData.statusPerkawinan || '-';
  document.querySelector('#editPekerjaan').value = originalData.pekerjaan || '-';
  document.querySelector('#editAlamat').value = originalData.alamat || '-';
  document.querySelector('#editKelurahan').value = originalData.kelurahan || '-';
  document.querySelector('#editKecamatan').value = originalData.kecamatan || '-';
  document.querySelector('#editKotaKab').value = originalData.kota_kab || '-';
  document.querySelector('#editProvinsi').value = originalData.provinsi || '-';
  // Keluar mode edit
  toggleEditMode();
  // Segera tampilkan perubahan di UI tanpa menunggu respon server
  updatePemohonUI();
}

// Fungsi Simpan Perubahan agar tombol berfungsi seperti di template 2
function saveChanges() {
  const updatedData = {
    nama: document.querySelector('#editNama').value,
    nik: document.querySelector('#editNIK').value,
    ttl: document.querySelector('#editTTL').value,
    agama: document.querySelector('#editAgama').value,
    jenis_kelamin: document.querySelector('#editJenisKelamin').value,
    status_perkawinan: document.querySelector('#editStatusPerkawinan').value,
    pekerjaan: document.querySelector('#editPekerjaan').value,
    alamat: document.querySelector('#editAlamat').value,
    kelurahan: document.querySelector('#editKelurahan').value,
    kecamatan: document.querySelector('#editKecamatan').value,
    kota_kab: document.querySelector('#editKotaKab').value,
    provinsi: document.querySelector('#editProvinsi').value
  };

  // Update dataController agar data tetap sinkron
  dataController.data[0].pemohon = { ...updatedData };
  updatePemohonUI();
  // Langsung keluar mode edit
  toggleEditMode();
  // Kirim data ke server (aktif)
  fetch(dataController.data[0].URL_UPDATE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'update',
      id_user: dataController.data[0].id_user,
      data_sebelum: originalData,
      data_sesudah: updatedData
    })
  })
  .then(response => response.json())
  .then(data => {
    // Tampilkan popup atau notifikasi jika perlu
    alert('Perubahan berhasil disimpan!');
  })
  .catch(error => {
    alert('Gagal menyimpan perubahan!');
    console.error(error);
  });
// Fungsi untuk update UI pemohon setelah edit
function updatePemohonUI() {
  // Ambil data dari input edit
  const nama = document.querySelector('#editNama').value;
  const nik = document.querySelector('#editNIK').value;
  const ttl = document.querySelector('#editTTL').value;
  const agama = document.querySelector('#editAgama').value;
  const jenisKelamin = document.querySelector('#editJenisKelamin').value;
  const statusPerkawinan = document.querySelector('#editStatusPerkawinan').value;
  const pekerjaan = document.querySelector('#editPekerjaan').value;
  const alamat = document.querySelector('#editAlamat').value;
  const kelurahan = document.querySelector('#editKelurahan').value;
  const kecamatan = document.querySelector('#editKecamatan').value;
  const kota_kab = document.querySelector('#editKotaKab').value;
  const provinsi = document.querySelector('#editProvinsi').value;

  // Update tampilan
  document.querySelector('#nama').textContent = nama;
  document.querySelector('#nik').textContent = nik;
  document.querySelector('#ttl').textContent = ttl;
  document.querySelector('#agama').textContent = agama;
  document.querySelector('#jenis_kelamin').textContent = jenisKelamin;
  document.querySelector('#status_perkawinan').textContent = statusPerkawinan;
  document.querySelector('#pekerjaan').textContent = pekerjaan;
  document.querySelector('#alamat').textContent = alamat;
  document.querySelector('#kelurahan').textContent = kelurahan;
  document.querySelector('#kecamatan').textContent = kecamatan;
  document.querySelector('#kota_kab').textContent = kota_kab;
  document.querySelector('#provinsi').textContent = provinsi;

  // Update dataController juga agar data tetap sinkron
  dataController.data[0].pemohon = {
    nama, nik, ttl, agama, jenis_kelamin: jenisKelamin, status_perkawinan: statusPerkawinan,
    pekerjaan, alamat, kelurahan, kecamatan, kota_kab, provinsi
  };
}
}

const API_BASE_URL = 'http://localhost:3000/api/biodata';

const biodataGrid = document.getElementById('biodataGrid');
const successAlert = document.getElementById('successAlert');
const alertMessage = document.getElementById('alertMessage');
const closeAlertBtn = document.getElementById('closeAlertBtn');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');
const closeErrorBtn = document.getElementById('closeErrorBtn');

const biodataModalEl = document.getElementById('biodataModal');
const biodataModal = new bootstrap.Modal(biodataModalEl);
const biodataModalLabel = document.getElementById('biodataModalLabel');
const biodataForm = document.getElementById('biodataForm');

const biodataIdInput = document.getElementById('biodataId');
const inputNama = document.getElementById('inputNama');
const inputNim = document.getElementById('inputNim');
const inputDeskripsi = document.getElementById('inputDeskripsi');
const inputFoto = document.getElementById('inputFoto');
const inputFotoFile = document.getElementById('inputFotoFile');
const fotoPreviewWrapper = document.getElementById('fotoPreviewWrapper');
const fotoPreview = document.getElementById('fotoPreview');
const btnOpenTambah = document.getElementById('btnOpenTambah');

let biodataList = [];

function resolveFotoPath(foto) {
  if (!foto) return '';
  const trimmed = String(foto).trim();
  if (trimmed.startsWith('frontend/')) {
    return trimmed.slice('frontend/'.length);
  }
  if (trimmed.startsWith('./frontend/')) {
    return trimmed.slice('./frontend/'.length);
  }
  return trimmed;
}

function getInitials(nama, avatar) {
  if (avatar && String(avatar).trim()) {
    return String(avatar).trim().toUpperCase();
  }
  const parts = String(nama || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function showSuccessAlert(message = 'Biodata berhasil diperbarui.') {
  alertMessage.textContent = message;
  successAlert.classList.remove('d-none');
  successAlert.classList.add('show');
}

function hideSuccessAlert() {
  successAlert.classList.remove('show');
  successAlert.classList.add('d-none');
}

function showErrorAlert(message) {
  errorMessage.textContent = message;
  errorAlert.classList.remove('d-none');
  errorAlert.classList.add('show');
}

function hideErrorAlert() {
  errorAlert.classList.remove('show');
  errorAlert.classList.add('d-none');
}

closeAlertBtn.addEventListener('click', hideSuccessAlert);
closeErrorBtn.addEventListener('click', hideErrorAlert);

function updatePreview(src) {
  const resolved = resolveFotoPath(src);
  if (resolved !== '') {
    fotoPreview.src = resolved;
    fotoPreviewWrapper.classList.remove('d-none');
  } else {
    fotoPreview.src = '';
    fotoPreviewWrapper.classList.add('d-none');
  }
}

inputFoto.addEventListener('input', () => {
  updatePreview(inputFoto.value);
});

inputFotoFile.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    inputFoto.value = dataUrl;
    updatePreview(dataUrl);
  };
  reader.readAsDataURL(file);
});

function openTambahModal() {
  biodataModalLabel.textContent = 'Tambah Biodata';
  biodataIdInput.value = '';
  biodataForm.reset();
  updatePreview('');
  biodataModal.show();
}

function openEditModal(item) {
  biodataModalLabel.textContent = 'Edit Biodata';
  biodataIdInput.value = item.id;
  inputNama.value = item.nama;
  inputNim.value = item.nim;
  inputDeskripsi.value = item.deskripsi;
  inputFoto.value = item.foto || '';
  inputFotoFile.value = '';
  updatePreview(item.foto || '');
  biodataModal.show();
}

btnOpenTambah.addEventListener('click', openTambahModal);

function createPhotoFallback(initials, isGreen) {
  const fallback = document.createElement('div');
  fallback.className = `biodata-photo-fallback ${isGreen ? 'bg-success' : 'bg-primary'}`;
  fallback.textContent = initials;
  return fallback;
}

function createBiodataCard(item) {
  const isGreen = item.warna === 'hijau';
  const initials = getInitials(item.nama, item.avatar);

  const col = document.createElement('div');
  col.className = 'col dynamic-biodata-card';

  const card = document.createElement('div');
  card.className = `card h-100 shadow-sm biodata-card ${isGreen ? 'card-theme-hijau' : 'card-theme-biru'}`;

  const resolvedFoto = resolveFotoPath(item.foto);
  if (resolvedFoto) {
    const img = document.createElement('img');
    img.className = 'card-img-top biodata-photo';
    img.src = resolvedFoto;
    img.alt = `Foto ${item.nama}`;
    img.onerror = () => {
      img.replaceWith(createPhotoFallback(initials, isGreen));
    };
    card.appendChild(img);
  } else {
    card.appendChild(createPhotoFallback(initials, isGreen));
  }

  const body = document.createElement('div');
  body.className = 'card-body d-flex flex-column';

  const headerRow = document.createElement('div');
  headerRow.className = 'd-flex align-items-center gap-2 mb-2';

  const avatarBadge = document.createElement('span');
  avatarBadge.className = `biodata-avatar-badge ${isGreen ? 'bg-success' : 'bg-primary'}`;
  avatarBadge.textContent = initials;

  const titleWrap = document.createElement('div');

  const title = document.createElement('h5');
  title.className = 'card-title fw-bold mb-0';
  title.textContent = item.nama;

  const nim = document.createElement('p');
  nim.className = 'card-subtitle text-muted mb-0 small fw-medium';
  nim.textContent = `NIM: ${item.nim}`;

  titleWrap.append(title, nim);
  headerRow.append(avatarBadge, titleWrap);

  const desc = document.createElement('p');
  desc.className = 'card-text flex-grow-1 mt-1';
  desc.textContent = item.deskripsi;

  const actions = document.createElement('div');
  actions.className = 'd-flex gap-2 mt-3';

  const btnEdit = document.createElement('button');
  btnEdit.type = 'button';
  btnEdit.className = 'btn btn-outline-primary btn-sm flex-fill';
  btnEdit.textContent = 'Edit';
  btnEdit.addEventListener('click', () => openEditModal(item));

  const btnHapus = document.createElement('button');
  btnHapus.type = 'button';
  btnHapus.className = 'btn btn-outline-danger btn-sm flex-fill';
  btnHapus.textContent = 'Hapus';
  btnHapus.addEventListener('click', () => handleDelete(item));

  actions.append(btnEdit, btnHapus);
  body.append(headerRow, desc, actions);
  card.appendChild(body);
  col.appendChild(card);

  return col;
}

function renderBiodata(list) {
  const existingDynamic = biodataGrid.querySelectorAll('.dynamic-biodata-card');
  existingDynamic.forEach((node) => node.remove());

  list.forEach((item) => {
    biodataGrid.appendChild(createBiodataCard(item));
  });
}

async function fetchBiodata() {
  try {
    hideErrorAlert();
    const res = await fetch(API_BASE_URL);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    biodataList = await res.json();
    renderBiodata(biodataList);
  } catch (err) {
    showErrorAlert(`Gagal memuat data dari backend (${err.message}). Pastikan server backend berjalan di http://localhost:3000.`);
  }
}

biodataForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  hideErrorAlert();

  const id = biodataIdInput.value.trim();
  const payload = {
    nama: inputNama.value.trim(),
    nim: inputNim.value.trim(),
    deskripsi: inputDeskripsi.value.trim(),
    foto: inputFoto.value.trim()
  };

  const isEdit = id !== '';
  const url = isEdit ? `${API_BASE_URL}/${id}` : API_BASE_URL;
  const method = isEdit ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}`);
    }

    biodataModal.hide();
    await fetchBiodata();
    showSuccessAlert('Biodata berhasil diperbarui.');
  } catch (err) {
    showErrorAlert(`Gagal menyimpan biodata: ${err.message}`);
  }
});

async function handleDelete(item) {
  const confirmed = window.confirm(`Hapus biodata "${item.nama}" (${item.nim})?`);
  if (!confirmed) return;

  try {
    hideErrorAlert();
    const res = await fetch(`${API_BASE_URL}/${item.id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}`);
    }

    await fetchBiodata();
    showSuccessAlert('Biodata berhasil dihapus.');
  } catch (err) {
    showErrorAlert(`Gagal menghapus biodata: ${err.message}`);
  }
}

document.addEventListener('DOMContentLoaded', fetchBiodata);

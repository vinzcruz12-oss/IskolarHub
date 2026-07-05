const API_BASE = '../api';
let currentStudentId = null;
let currentStudentName = null;
let currentAdminId = null;

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  const page = document.getElementById(pageId + '-page');
  if (page) page.style.display = 'block';

  if (pageId === 'dashboard') {
    document.getElementById('dashboard-welcome').textContent = 'Welcome, ' + (currentStudentName || 'Student');
  }
  if (pageId === 'eligibility' && currentStudentId) {
    loadStudentProfile();
  }
  if (pageId === 'recommendations' && currentStudentId) {
    loadRecommendations();
  }
  if (pageId === 'browse') {
    performSearch();
  }
}

function debug(data) {
  const el = document.getElementById('debug-output');
  console.log('API Response:', data);
  el.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

async function apiFetch(path, options = {}) {
  const url = API_BASE + path;
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }
    debug({ status: res.status, data });
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    debug({ error: err.message });
    return { ok: false, error: err.message };
  }
}

function logout() {
  currentStudentId = null;
  currentStudentName = null;
  currentAdminId = null;
  showPage('landing');
}

// Registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fullname = document.getElementById('reg-fullname').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;

  if (password !== confirm) {
    debug({ error: 'Passwords do not match' });
    document.getElementById('register-result').innerHTML = '<p style="color:red;">Error: Passwords do not match</p>';
    return;
  }

  const result = await apiFetch('/students/register.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullname, email, password })
  });

  const out = document.getElementById('register-result');
  if (result.ok && result.data && result.data.success) {
    out.innerHTML = '<p style="color:green;">Registration successful. Please login.</p>';
    document.getElementById('register-form').reset();
    setTimeout(() => showPage('login'), 1000);
  } else {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
  }
});

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  const result = await apiFetch('/students/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const out = document.getElementById('login-result');
  if (result.ok && result.data && result.data.success) {
    currentStudentId = result.data.student_id;
    currentStudentName = result.data.fullname;
    out.innerHTML = '<p style="color:green;">Login successful. ' + currentStudentName + '</p>';
    document.getElementById('login-form').reset();
    setTimeout(() => showPage('dashboard'), 500);
  } else {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
  }
});

// Load student profile into eligibility form
async function loadStudentProfile() {
  if (!currentStudentId) return;
  const result = await apiFetch('/students/show.php?id=' + currentStudentId);
  if (result.ok && result.data && result.data.success) {
    const s = result.data.data;
    document.getElementById('elig-fullname').value = s.fullname || '';
    document.getElementById('elig-age').value = s.age || '';
    document.getElementById('elig-school').value = s.current_school || '';
    document.getElementById('elig-education').value = s.education_level || '';
    document.getElementById('elig-strand').value = s.strand || '';
    document.getElementById('elig-course').value = s.course || '';
    document.getElementById('elig-gwa').value = s.gwa || '';
  }
}

// Eligibility Form
document.getElementById('eligibility-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentStudentId) {
    document.getElementById('eligibility-result').innerHTML = '<p style="color:red;">Error: No student logged in</p>';
    return;
  }

  const payload = {
    id: currentStudentId,
    fullname: document.getElementById('elig-fullname').value.trim() || undefined,
    age: document.getElementById('elig-age').value ? parseInt(document.getElementById('elig-age').value) : undefined,
    current_school: document.getElementById('elig-school').value.trim() || undefined,
    education_level: document.getElementById('elig-education').value || undefined,
    strand: document.getElementById('elig-strand').value.trim() || undefined,
    course: document.getElementById('elig-course').value.trim() || undefined,
    gwa: document.getElementById('elig-gwa').value ? parseFloat(document.getElementById('elig-gwa').value) : undefined
  };

  Object.keys(payload).forEach(key => {
    if (payload[key] === undefined) delete payload[key];
  });

  const result = await apiFetch('/students/update.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const out = document.getElementById('eligibility-result');
  if (result.ok && result.data && result.data.success) {
    out.innerHTML = '<p style="color:green;">Profile updated successfully.</p>';
    setTimeout(() => showPage('recommendations'), 1000);
  } else {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
  }
});

// Recommendations
async function loadRecommendations() {
  if (!currentStudentId) {
    document.getElementById('rec-result').innerHTML = '<p style="color:red;">Please login first.</p>';
    return;
  }

  const result = await apiFetch('/recommendations/index.php?student_id=' + encodeURIComponent(currentStudentId));
  const out = document.getElementById('rec-result');

  if (!result.ok || !result.data || !result.data.success) {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
    return;
  }

  const scholarships = result.data.scholarships || [];
  if (scholarships.length === 0) {
    out.innerHTML = '<p>' + (result.data.message || 'No eligible scholarships found.') + '</p>';
    return;
  }

  let html = '';
  scholarships.forEach(s => {
    const reasons = (s.reason || []).map(r => '<li>' + r + '</li>').join('');
    html += `
      <div class="card">
        <h4>${s.title}</h4>
        <p><strong>University:</strong> ${s.university}</p>
        <p><strong>Type:</strong> ${s.scholarship_type}</p>
        <p><strong>Required GWA:</strong> ${s.minimum_gwa}</p>
        <p><strong>Student GWA:</strong> ${result.data.student.gwa}</p>
        <p><strong>Course:</strong> ${s.course || 'Any'}</p>
        <p><strong>Description:</strong> ${s.description}</p>
        <p><strong>Reason:</strong></p>
        <ul>${reasons}</ul>
        ${s.website_url ? '<a href="' + s.website_url + '" target="_blank">Apply Now</a>' : 'No link'}
      </div>
    `;
  });
  out.innerHTML = html;
}

// Search / Browse
let searchTimeout = null;
function performSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => doSearch(), 300);
}

async function doSearch() {
  const params = new URLSearchParams();
  const query = document.getElementById('search-query').value.trim();
  if (query) params.set('search', query);
  const edu = document.getElementById('filter-education').value;
  if (edu) params.set('education_level', edu);
  const type = document.getElementById('filter-type').value;
  if (type) params.set('scholarship_type', type);
  const course = document.getElementById('filter-course').value.trim();
  if (course) params.set('course', course);
  const gwa = document.getElementById('filter-gwa').value;
  if (gwa !== '') params.set('minimum_gwa', gwa);

  const result = await apiFetch('/scholarships/list.php?' + params.toString());
  const out = document.getElementById('browse-result');

  if (!result.ok || !result.data || !result.data.success) {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
    return;
  }

  const list = result.data.data || [];
  if (list.length === 0) {
    out.innerHTML = '<p>No scholarships found.</p>';
    return;
  }

  let html = '<table><tr><th>Title</th><th>University</th><th>Type</th><th>Min GWA</th><th>Course</th><th>Action</th></tr>';
  list.forEach(s => {
    html += `<tr>
      <td>${s.title}</td>
      <td>${s.university}</td>
      <td>${s.scholarship_type}</td>
      <td>${s.minimum_gwa}</td>
      <td>${s.course || 'Any'}</td>
      <td>${s.website_url ? '<a href="' + s.website_url + '" target="_blank">Apply</a>' : 'No link'}</td>
    </tr>`;
  });
  html += '</table>';
  out.innerHTML = html;
}

// Admin Login
document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value;

  const result = await apiFetch('/admin/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const out = document.getElementById('admin-login-result');
  if (result.ok && result.data && result.data.success) {
    currentAdminId = result.data.admin_id;
    out.innerHTML = '<p style="color:green;">Admin login successful. ' + result.data.username + '</p>';
    document.getElementById('admin-login-form').reset();
    setTimeout(() => showPage('admin-dashboard'), 500);
  } else {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
  }
});

// Admin Dashboard
async function loadScholarships() {
  const result = await apiFetch('/scholarships/index.php');
  const out = document.getElementById('admin-table');
  if (!result.ok || !result.data || !result.data.success) {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
    return;
  }

  const list = result.data.data || [];
  if (list.length === 0) {
    out.innerHTML = '<p>No scholarships found.</p>';
    return;
  }

  let html = '<table><tr><th>ID</th><th>Title</th><th>University</th><th>Min GWA</th><th>Actions</th></tr>';
  list.forEach(s => {
    html += `<tr>
      <td>${s.id}</td>
      <td>${s.title}</td>
      <td>${s.university}</td>
      <td>${s.minimum_gwa}</td>
      <td>
        <button onclick="editScholarship(${s.id})">Edit</button>
        <button onclick="deleteScholarship(${s.id})">Delete</button>
      </td>
    </tr>`;
  });
  html += '</table>';
  out.innerHTML = html;
}

function openAddModal() {
  document.getElementById('modal-title').textContent = 'Add Scholarship';
  document.getElementById('scholarship-form').reset();
  document.getElementById('scholarship-id').value = '';
  document.getElementById('modal-result').innerHTML = '';
  document.getElementById('scholarship-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('scholarship-modal').style.display = 'none';
}

async function editScholarship(id) {
  const result = await apiFetch('/scholarships/show.php?id=' + id);
  if (!result.ok || !result.data || !result.data.success) {
    alert('Error fetching scholarship');
    return;
  }
  const s = result.data.data;
  document.getElementById('modal-title').textContent = 'Edit Scholarship';
  document.getElementById('scholarship-id').value = s.id;
  document.getElementById('sch-title').value = s.title;
  document.getElementById('sch-description').value = s.description;
  document.getElementById('sch-university').value = s.university;
  document.getElementById('sch-education').value = s.education_level;
  document.getElementById('sch-course').value = s.course || '';
  document.getElementById('sch-type').value = s.scholarship_type;
  document.getElementById('sch-gwa').value = s.minimum_gwa;
  document.getElementById('sch-requirements').value = s.requirements;
  document.getElementById('sch-deadline').value = s.deadline;
  document.getElementById('sch-url').value = s.website_url || '';
  document.getElementById('modal-result').innerHTML = '';
  document.getElementById('scholarship-modal').style.display = 'flex';
}

async function deleteScholarship(id) {
  if (!confirm('Delete scholarship ID ' + id + '?')) return;
  const result = await apiFetch('/scholarships/delete.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  const out = document.getElementById('modal-result');
  if (result.ok && result.data && result.data.success) {
    out.innerHTML = '<p style="color:green;">Deleted successfully.</p>';
    loadScholarships();
  } else {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
  }
}

document.getElementById('scholarship-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('scholarship-id').value;
  const payload = {
    title: document.getElementById('sch-title').value,
    description: document.getElementById('sch-description').value,
    university: document.getElementById('sch-university').value,
    education_level: document.getElementById('sch-education').value,
    course: document.getElementById('sch-course').value,
    scholarship_type: document.getElementById('sch-type').value,
    minimum_gwa: parseFloat(document.getElementById('sch-gwa').value),
    requirements: document.getElementById('sch-requirements').value,
    deadline: document.getElementById('sch-deadline').value,
    website_url: document.getElementById('sch-url').value
  };

  const out = document.getElementById('modal-result');
  if (id) {
    payload.id = parseInt(id);
    const result = await apiFetch('/scholarships/update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (result.ok && result.data && result.data.success) {
      out.innerHTML = '<p style="color:green;">Updated successfully.</p>';
      loadScholarships();
      closeModal();
    } else {
      out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
    }
  } else {
    const result = await apiFetch('/scholarships/create.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (result.ok && result.data && result.data.success) {
      out.innerHTML = '<p style="color:green;">Created successfully. ID: ' + result.data.id + '</p>';
      loadScholarships();
      closeModal();
    } else {
      out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
    }
  }
});

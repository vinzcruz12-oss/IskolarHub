const API_BASE = '../api';
let currentStudentId = sessionStorage.getItem('currentStudentId') || null;
let currentStudentName = sessionStorage.getItem('currentStudentName') || null;
let currentAdminId = sessionStorage.getItem('currentAdminId') || null;
let isViewingAsStudent = sessionStorage.getItem('isViewingAsStudent') === 'true';

function showPage(pageId, updateHash = true) {
  if (updateHash) {
    window.location.hash = pageId;
    return;
  }

  if (isViewingAsStudent && pageId !== 'admin-student-view' && pageId !== 'landing' && pageId !== 'login' && pageId !== 'register') {
    const page = document.getElementById('admin-student-view-page');
    if (page && page.style.display !== 'block') {
      document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
      page.style.display = 'block';
    }
    return;
  }

  const page = document.getElementById(pageId + '-page');
  if (page && page.style.display !== 'block') {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    page.style.display = 'block';
  }

  // Toggle global-test-nav visibility
  const testNav = document.getElementById('global-test-nav');
  if (testNav) {
    if (pageId === 'landing') {
      testNav.style.display = 'none';
    } else {
      testNav.style.display = 'flex';
    }
  }

  if (pageId === 'dashboard' || pageId === 'profile') {
    if (pageId === 'dashboard') {
      document.getElementById('dashboard-welcome').textContent = 'Welcome, ' + (currentStudentName || 'Student');
    }
    if (currentStudentId) {
      loadStudentProfile();
      if (pageId === 'dashboard') {
        loadRecommendations();
      }
    }
  }
  if (pageId === 'admin-dashboard' && currentAdminId) {
    loadAdminStats();
    loadScholarships();
    loadStudents();
  }
}

function debug(data) {
  const el = document.getElementById('debug-output');
  console.log('API Response:', data);
  if (el) {
    el.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  }
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
  isViewingAsStudent = false;
  sessionStorage.removeItem('currentStudentId');
  sessionStorage.removeItem('currentStudentName');
  sessionStorage.removeItem('currentAdminId');
  sessionStorage.removeItem('isViewingAsStudent');
  showPage('landing');
}

function adminLogout() {
  currentAdminId = null;
  isViewingAsStudent = false;
  sessionStorage.removeItem('currentAdminId');
  sessionStorage.removeItem('isViewingAsStudent');
  showPage('landing');
}

function viewAsStudent() {
  if (!currentAdminId) return;
  isViewingAsStudent = true;
  sessionStorage.setItem('isViewingAsStudent', 'true');
  showPage('admin-student-view');
}

function returnToAdminDashboard() {
  isViewingAsStudent = false;
  sessionStorage.setItem('isViewingAsStudent', 'false');
  showPage('admin-dashboard');
}

// Registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const first_name = document.getElementById('reg-firstname').value.trim();
  const middle_name = document.getElementById('reg-middlename').value.trim();
  const last_name = document.getElementById('reg-lastname').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;
  const privacy = document.getElementById('reg-privacy').checked;

  if (!first_name || !last_name) {
    debug({ error: 'First name and last name are required' });
    document.getElementById('register-result').innerHTML = '<p style="color:red;">Error: First name and last name are required</p>';
    return;
  }

  if (password !== confirm) {
    debug({ error: 'Passwords do not match' });
    document.getElementById('register-result').innerHTML = '<p style="color:red;">Error: Passwords do not match</p>';
    return;
  }

  if (!privacy) {
    debug({ error: 'Privacy notice not agreed' });
    document.getElementById('register-result').innerHTML = '<p style="color:red;">Error: You must agree to the Privacy Notice and Terms of Use</p>';
    return;
  }

  const result = await apiFetch('/students/register.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ first_name, middle_name, last_name, email, password, confirm_password: confirm, privacy_accepted: privacy })
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
    sessionStorage.setItem('currentStudentId', currentStudentId);
    sessionStorage.setItem('currentStudentName', currentStudentName);
    out.innerHTML = '';
    document.getElementById('login-form').reset();
    setTimeout(() => showPage('dashboard'), 500);
  } else {
    out.innerHTML = '<p style="color:red;">Invalid Email or Password.</p>';
  }
});

// Load student profile into eligibility form
async function loadStudentProfile() {
  if (!currentStudentId) return;
  const result = await apiFetch('/students/show.php?id=' + currentStudentId);
  if (result.ok && result.data && result.data.success) {
    const s = result.data.data;
    
    // Dashboard matching criteria
    const eligCourse = document.getElementById('elig-course');
    if (eligCourse) eligCourse.value = s.course || '';
    const eligGwa = document.getElementById('elig-gwa');
    if (eligGwa) eligGwa.value = s.gwa || '';
    
    // Profile page fields
    const profFirst = document.getElementById('prof-firstname');
    if (profFirst) profFirst.value = s.first_name || '';
    const profMiddle = document.getElementById('prof-middlename');
    if (profMiddle) profMiddle.value = s.middle_name || '';
    const profLast = document.getElementById('prof-lastname');
    if (profLast) profLast.value = s.last_name || '';
    const profAge = document.getElementById('prof-age');
    if (profAge) profAge.value = s.age || '';
    const profSchool = document.getElementById('prof-school');
    if (profSchool) profSchool.value = s.current_school || '';
    const profStrand = document.getElementById('prof-strand');
    if (profStrand) profStrand.value = s.strand || '';
    
    // Profile picture loading
    const profPicDisplay = document.getElementById('profile-pic-display');
    if (profPicDisplay) {
      const savedPic = localStorage.getItem('profile_pic_student_' + currentStudentId);
      profPicDisplay.src = savedPic || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a0aec0"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
    }
  }
}

// Eligibility Form (Dashboard Criteria)
document.getElementById('eligibility-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentStudentId) {
    document.getElementById('eligibility-result').innerHTML = '<p style="color:red;">Error: No student logged in</p>';
    return;
  }

  const payload = {
    id: currentStudentId,
    course: document.getElementById('elig-course').value || undefined,
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
    out.innerHTML = '<p style="color:green;">Criteria updated successfully.</p>';
    loadRecommendations();
    setTimeout(() => {
      out.innerHTML = '';
    }, 3000);
  } else {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
  }
});

// Profile Form (Static Details)
document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentStudentId) {
    document.getElementById('profile-result').innerHTML = '<p style="color:red;">Error: No student logged in</p>';
    return;
  }

  const payload = {
    id: currentStudentId,
    first_name: document.getElementById('prof-firstname').value.trim(),
    middle_name: document.getElementById('prof-middlename').value.trim() || null,
    last_name: document.getElementById('prof-lastname').value.trim(),
    age: document.getElementById('prof-age').value ? parseInt(document.getElementById('prof-age').value) : null,
    current_school: document.getElementById('prof-school').value.trim() || null,
    strand: document.getElementById('prof-strand').value || null
  };

  const result = await apiFetch('/students/update.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const out = document.getElementById('profile-result');
  if (result.ok && result.data && result.data.success) {
    out.innerHTML = '<p style="color:green;">Profile updated successfully.</p>';
    currentStudentName = [payload.first_name, payload.middle_name, payload.last_name].filter(Boolean).join(' ');
    setTimeout(() => {
      out.innerHTML = '';
    }, 3000);
  } else {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
  }
});

// Profile Picture Input Change
document.getElementById('profile-pic-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && currentStudentId) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target.result;
      const display = document.getElementById('profile-pic-display');
      if (display) display.src = base64;
      localStorage.setItem('profile_pic_student_' + currentStudentId, base64);
    };
    reader.readAsDataURL(file);
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
    const errorMsg = (result.data && result.data.message) || (result.data && result.data.error) || result.error || 'Error fetching recommendations';
    const color = (result.data && result.data.message) ? '#718096' : 'red';
    out.innerHTML = '<p style="color:' + color + ';">' + errorMsg + '</p>';
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
        ${s.official_scholarship_url ? '<a href="' + s.official_scholarship_url + '" target="_blank">Apply Now</a>' : 'No link'}
      </div>
    `;
  });
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
    sessionStorage.setItem('currentAdminId', currentAdminId);
    out.innerHTML = '<p style="color:green;">Admin login successful. ' + result.data.username + '</p>';
    document.getElementById('admin-login-form').reset();
    setTimeout(() => showPage('admin-dashboard'), 500);
  } else {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
  }
});

// Admin Dashboard Functions
async function loadAdminStats() {
  const out = document.getElementById('admin-stats');
  try {
    const scholarshipsResult = await apiFetch('/scholarships/index.php');
    const studentsResult = await apiFetch('/students/index.php');

    const scholarships = (scholarshipsResult.data && scholarshipsResult.data.data) ? scholarshipsResult.data.data : [];
    const students = (studentsResult.data && studentsResult.data.data) ? studentsResult.data.data : [];

    const totalScholarships = scholarships.length;
    const totalStudents = students.length;
    const totalUniversities = [...new Set(scholarships.map(s => s.university))].length;

    out.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <h4>Total Scholarships</h4>
          <p>${totalScholarships}</p>
        </div>
        <div class="stat-card">
          <h4>Total Students</h4>
          <p>${totalStudents}</p>
        </div>
        <div class="stat-card">
          <h4>Universities</h4>
          <p>${totalUniversities}</p>
        </div>
      </div>
    `;
  } catch (err) {
    out.innerHTML = '<p style="color:red;">Error loading statistics</p>';
  }
}

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

async function loadStudents() {
  const result = await apiFetch('/students/index.php');
  const out = document.getElementById('admin-students-table');
  if (!result.ok || !result.data || !result.data.success) {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
    return;
  }

  const list = result.data.data || [];
  if (list.length === 0) {
    out.innerHTML = '<p>No students found.</p>';
    return;
  }

  let html = '<table><tr><th>ID</th><th>Name</th><th>Email</th><th>Course</th><th>GWA</th><th>Registered</th></tr>';
  list.forEach(s => {
    const fullName = [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(' ');
    html += `<tr>
      <td>${s.id}</td>
      <td>${fullName}</td>
      <td>${s.email}</td>
      <td>${s.course || 'N/A'}</td>
      <td>${s.gwa || 'N/A'}</td>
      <td>${s.created_at || 'N/A'}</td>
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

function openPrivacyModal() {
  document.getElementById('privacy-modal').style.display = 'flex';
}

function closePrivacyModal() {
  document.getElementById('privacy-modal').style.display = 'none';
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
  document.getElementById('sch-course').value = s.course || '';
  document.getElementById('sch-type').value = s.scholarship_type;
  document.getElementById('sch-gwa').value = s.minimum_gwa;
  document.getElementById('sch-requirements').value = s.requirements;
  document.getElementById('sch-deadline').value = s.deadline;
  document.getElementById('sch-url').value = s.official_scholarship_url || '';
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
    course: document.getElementById('sch-course').value,
    scholarship_type: document.getElementById('sch-type').value,
    minimum_gwa: parseFloat(document.getElementById('sch-gwa').value),
    requirements: document.getElementById('sch-requirements').value,
    deadline: document.getElementById('sch-deadline').value,
    official_scholarship_url: document.getElementById('sch-url').value
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

// FAQ Accordion Toggle
function toggleFaq(rowElement) {
  const item = rowElement.closest('.faq-accordion-item');
  const isActive = item.classList.contains('active');
  
  // Close all other FAQ items
  document.querySelectorAll('.faq-accordion-item').forEach(el => {
    el.classList.remove('active');
  });
  
  // If it was not active, toggle it open
  if (!isActive) {
    item.classList.add('active');
  }
}

// Carousel Scroll Logic
function scrollCarousel(direction) {
  const container = document.querySelector('.uni-carousel-container');
  if (container) {
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
}

// Handle apply clicks for guest users
function handleApplyClick(e, url) {
  e.preventDefault();
  if (!currentStudentId) {
    alert('Please login or register first to apply for scholarships.');
    showPage('login');
  } else if (url) {
    window.open(url, '_blank');
  }
}

// Handle find scholarship click for landing page
function handleFindScholarshipClick() {
  if (!currentStudentId) {
    showPage('login');
  } else {
    showPage('dashboard');
  }
}


let useSmoothScroll = false;
function enableSmoothScroll() {
  document.documentElement.style.scrollBehavior = 'smooth';
  useSmoothScroll = true;
}

// SPA Hash-Based Routing
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const VALID_PAGES = [
  'landing', 'privacy', 'register', 'login', 'dashboard', 'profile',
  'admin-login', 'admin-dashboard', 'admin-student-view',
  'up-scholarships', 'ateneo-scholarships', 'dlsu-scholarships',
  'ust-scholarships', 'feu-scholarships', 'nu-scholarships',
  'adamson-scholarships', 'ue-scholarships'
];

const LANDING_ANCHORS = [
  'about', 'how-it-works', 'universities', 'testimonials', 'faqs', 'contact'
];

let isInitialLoad = true;

function handleRouting() {
  let hash = window.location.hash.substring(1) || 'landing';
  
  if (isInitialLoad) {
    isInitialLoad = false;
    // Force landing anchors/landing hashes back to top on first load/reload
    if (hash === 'landing' || LANDING_ANCHORS.includes(hash)) {
      hash = 'landing';
      window.location.hash = 'landing';
      window.scrollTo(0, 0);
    }
  }
  
  if (VALID_PAGES.includes(hash)) {
    if ((hash === 'dashboard' || hash === 'profile') && !currentStudentId && !isViewingAsStudent) {
      hash = 'login';
      window.location.hash = 'login';
      return;
    }
    showPage(hash, false);
    if (useSmoothScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'auto';
      }, 1000);
      useSmoothScroll = false;
    } else {
      window.scrollTo(0, 0);
    }
  } else if (LANDING_ANCHORS.includes(hash)) {
    showPage('landing', false);
    const el = document.getElementById(hash);
    if (el) {
      // Force layout calculation and get absolute vertical position
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop;
      
      // Perform immediate synchronous scroll
      if (useSmoothScroll) {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = 'auto';
        }, 1000);
      } else {
        window.scrollTo({ top: targetY, behavior: 'auto' });
      }
      useSmoothScroll = false;
    }
  } else {
    showPage('landing', false);
  }
}

// Register routing listeners
window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', handleRouting);

// Intercept all landing anchor links to scroll smoothly
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    const targetId = link.getAttribute('href').substring(1);
    if (LANDING_ANCHORS.includes(targetId) || targetId === 'landing') {
      e.preventDefault();
      enableSmoothScroll();
      window.location.hash = targetId;
    }
  }
});

// Initialize routing immediately on script execution
handleRouting();

// Toggle University Scholarships Page Accordion
function toggleUniAccordion(header) {
  const item = header.closest('.uni-accordion-item');
  item.classList.toggle('active');
}



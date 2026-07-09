const API_BASE = '../api';
let currentStudentId = sessionStorage.getItem('currentStudentId') || null;
let currentStudentName = sessionStorage.getItem('currentStudentName') || null;
let currentAdminId = sessionStorage.getItem('currentAdminId') || null;
let isViewingAsStudent = sessionStorage.getItem('isViewingAsStudent') === 'true';
let lastUniversitySource = 'landing';

// Administrative security logs simulation
let securityLogs = [
  { time: '2026-07-09 14:10:23', action: 'Admin login success', details: 'test@admin.com from unified form' },
  { time: '2026-07-09 14:02:45', action: 'Failed login attempt', details: 'unknown@user.com' },
  { time: '2026-07-09 12:45:12', action: 'Database backup automatic', details: 'Backup verified' },
  { time: '2026-07-09 11:30:00', action: 'Security policy change', details: 'Password complexity rules set' }
];

function logSecurityEvent(action, details) {
  const now = new Date();
  const timeStr = now.getFullYear() + '-' + 
    String(now.getMonth()+1).padStart(2, '0') + '-' + 
    String(now.getDate()).padStart(2, '0') + ' ' + 
    String(now.getHours()).padStart(2, '0') + ':' + 
    String(now.getMinutes()).padStart(2, '0') + ':' + 
    String(now.getSeconds()).padStart(2, '0');
  securityLogs.unshift({ time: timeStr, action, details });
  const el = document.getElementById('admin-access-logs');
  if (el) {
    // If the security tab is active, refresh visual log list instantly
    loadSecurityLogs();
  }
}

function showPage(pageId, updateHash = true) {
  if (updateHash) {
    window.location.hash = pageId;
    return;
  }

  // Close mobile sidebar on navigation
  const appLayout = document.querySelector('.app-layout');
  if (appLayout) {
    appLayout.classList.remove('sidebar-open');
  }

  // Pre-load dynamic university details if navigating there
  if (pageId === 'student-uni-detail') {
    const uniKey = sessionStorage.getItem('selectedStudentUniKey') || 'up';
    renderStudentUniDetail(uniKey);
  }

  // Manage Dark Mode on Landing & University Pages vs Student App Pages
  const isUniversityPage = pageId.endsWith('-scholarships');
  if (pageId === 'landing' || isUniversityPage) {
    document.body.classList.remove('dark-mode');
  } else if (currentStudentId) {
    const savedSettings = JSON.parse(localStorage.getItem('student_settings_' + currentStudentId)) || {};
    if (savedSettings.theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else if (savedSettings.theme === 'light') {
      document.body.classList.remove('dark-mode');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('dark-mode', prefersDark);
    }
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Update landing page header dynamically if user is logged in
  if (pageId === 'landing') {
    const authBtns = document.getElementById('landing-auth-buttons');
    const userMenu = document.getElementById('landing-user-menu');
    
    if (authBtns && userMenu) {
      if (currentStudentId !== null) {
        authBtns.style.display = 'none';
        userMenu.style.display = 'inline-block';
        
        const userNameEl = document.getElementById('landing-user-name');
        if (userNameEl) userNameEl.textContent = currentStudentName || 'Student';
        
        const userPicEl = document.getElementById('landing-user-pic');
        if (userPicEl) {
          const savedPic = localStorage.getItem('profile_pic_student_' + currentStudentId);
          const defaultPic = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2EwYWVjMCI+PHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPjwvc3ZnPg==';
          userPicEl.src = savedPic || defaultPic;
        }
      } else {
        authBtns.style.display = 'flex';
        userMenu.style.display = 'none';
      }
    }
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

  // Update navigation source tracking
  if (pageId === 'student-universities') {
    lastUniversitySource = 'student-universities';
  } else if (pageId === 'landing') {
    lastUniversitySource = 'landing';
  }

  // Toggle student-sidebar visibility
  const sidebar = document.getElementById('student-sidebar');
  const showSidebar = currentStudentId !== null && 
                      pageId !== 'landing' && 
                      pageId !== 'login' && 
                      pageId !== 'register' && 
                      !pageId.includes('admin') && 
                      (!isUniversityPage || lastUniversitySource === 'student-universities');
  
  if (sidebar) {
    if (showSidebar) {
      sidebar.style.display = 'flex';
      if (appLayout) appLayout.classList.add('has-sidebar');
      
      // Update sidebar profile fields
      const sidebarName = document.getElementById('sidebar-name-display');
      if (sidebarName) sidebarName.textContent = currentStudentName || 'Student';
      
      const sidebarPic = document.getElementById('sidebar-pic-display');
      const savedPic = localStorage.getItem('profile_pic_student_' + currentStudentId);
      const defaultPic = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2EwYWVjMCI+PHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPjwvc3ZnPg==';
      if (sidebarPic) {
        sidebarPic.src = savedPic || defaultPic;
      }
      const dashPic = document.getElementById('dashboard-pic-display');
      if (dashPic) {
        dashPic.src = savedPic || defaultPic;
      }
      const editPic = document.getElementById('profile-pic-display');
      if (editPic) {
        editPic.src = savedPic || defaultPic;
      }
      
      // Highlight active link in sidebar
      document.querySelectorAll('.student-sidebar .sidebar-link, .student-sidebar .sidebar-link-bottom').forEach(link => {
        link.classList.remove('active');
      });
      
      if (pageId === 'dashboard') {
        const activeLink = document.getElementById('nav-find-scholarships');
        if (activeLink) activeLink.classList.add('active');
      } else if (pageId === 'settings') {
        const activeLink = document.getElementById('nav-settings-bottom');
        if (activeLink) activeLink.classList.add('active');
      } else if (pageId === 'student-universities' || pageId === 'student-uni-detail') {
        const activeLink = document.getElementById('nav-student-universities');
        if (activeLink) activeLink.classList.add('active');
      }
    } else {
      sidebar.style.display = 'none';
      if (appLayout) appLayout.classList.remove('has-sidebar');
    }
  }

  // Handle university back button target based on source
  if (isUniversityPage) {
    const backBtn = document.querySelector(`#${pageId}-page .btn-back-link`);
    if (backBtn) {
      if (lastUniversitySource === 'student-universities') {
        backBtn.setAttribute('onclick', "showPage('student-universities')");
      } else {
        backBtn.setAttribute('onclick', "showPage('universities')");
      }
    }
  }

  // Toggle mobile toggle button visibility
  const toggleBtn = document.getElementById('sidebar-toggle');
  if (toggleBtn) {
    toggleBtn.style.display = showSidebar ? 'block' : 'none';
  }

  if (pageId === 'dashboard' || pageId === 'profile' || pageId === 'settings' || pageId === 'student-universities') {
    if (pageId === 'dashboard') {
      const welcomeEl = document.getElementById('dashboard-welcome');
      if (welcomeEl) welcomeEl.textContent = 'Welcome, ' + (currentStudentName || 'Student');
    }
    if (currentStudentId) {
      loadStudentProfile();
      if (pageId === 'dashboard') {
        loadRecommendations();
      }
      if (pageId === 'settings') {
        loadSettingsPreferences();
      }
    }
  }
  if (pageId === 'admin-dashboard' && currentAdminId) {
    switchAdminTab('overview');
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
    if (result.data.role === 'admin') {
      currentAdminId = result.data.admin_id;
      sessionStorage.setItem('currentAdminId', currentAdminId);
      out.innerHTML = '';
      document.getElementById('login-form').reset();
      logSecurityEvent('Admin login success', 'test@admin.com authenticated from unified portal');
      setTimeout(() => showPage('admin-dashboard'), 500);
    } else {
      currentStudentId = result.data.student_id;
      currentStudentName = result.data.fullname;
      sessionStorage.setItem('currentStudentId', currentStudentId);
      sessionStorage.setItem('currentStudentName', currentStudentName);
      out.innerHTML = '';
      document.getElementById('login-form').reset();
      logSecurityEvent('Student login success', 'Email: ' + email);
      setTimeout(() => showPage('dashboard'), 500);
    }
  } else {
    const errMsg = (result.data && result.data.error) || 'Invalid Email or Password.';
    out.innerHTML = '<p style="color:red;">' + errMsg + '</p>';
    logSecurityEvent('Failed login attempt', 'Tried email: ' + email);
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
    const profEmail = document.getElementById('prof-email');
    if (profEmail) profEmail.value = s.email || '';
    const profPhone = document.getElementById('prof-phone');
    if (profPhone) profPhone.value = s.phone_number || '';
    const profGender = document.getElementById('prof-gender');
    if (profGender) profGender.value = s.gender || '';
    const profCountry = document.getElementById('prof-country');
    if (profCountry) profCountry.value = s.country || '';
    const profAddress = document.getElementById('prof-address');
    if (profAddress) profAddress.value = s.address || '';

    // Format name with period for single-letter middle initials
    let cleanMiddle = (s.middle_name || '').trim();
    if (cleanMiddle && cleanMiddle.length === 1 && !cleanMiddle.endsWith('.')) {
      cleanMiddle += '.';
    }
    currentStudentName = [s.first_name, cleanMiddle, s.last_name].filter(Boolean).join(' ');
    sessionStorage.setItem('currentStudentName', currentStudentName);
    const welcomeEl = document.getElementById('dashboard-welcome');
    if (welcomeEl) {
      welcomeEl.textContent = 'Welcome, ' + currentStudentName;
    }

    // Profile picture loading
    const profPicDisplay = document.getElementById('profile-pic-display');
    const dashPicDisplay = document.getElementById('dashboard-pic-display');
    if (profPicDisplay || dashPicDisplay) {
      const savedPic = localStorage.getItem('profile_pic_student_' + currentStudentId);
      const defaultPic = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2EwYWVjMCI+PHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPjwvc3ZnPg==';
      const activePic = savedPic || defaultPic;
      if (profPicDisplay) profPicDisplay.src = activePic;
      if (dashPicDisplay) dashPicDisplay.src = activePic;
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
    gwa: document.getElementById('elig-gwa').value ? parseFloat(document.getElementById('elig-gwa').value) : undefined,
    confirm_password: document.getElementById('elig-password').value || undefined
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
    document.getElementById('elig-password').value = '';
    loadRecommendations();
    setTimeout(() => {
      out.innerHTML = '';
    }, 3000);
  } else {
    out.innerHTML = '<p style="color:red;">Error: ' + ((result.data && result.data.error) || result.error || JSON.stringify(result.data)) + '</p>';
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
    strand: document.getElementById('prof-strand').value || null,
    phone_number: document.getElementById('prof-phone').value.trim() || null,
    gender: document.getElementById('prof-gender').value || null,
    country: document.getElementById('prof-country').value.trim() || null,
    address: document.getElementById('prof-address').value.trim() || null,
    confirm_password: document.getElementById('prof-password').value || undefined
  };

  const result = await apiFetch('/students/update.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const out = document.getElementById('profile-result');
  if (result.ok && result.data && result.data.success) {
    out.innerHTML = '<p style="color:green;">Profile updated successfully.</p>';
    document.getElementById('prof-password').value = '';
    let cleanMiddle = (payload.middle_name || '').trim();
    if (cleanMiddle && cleanMiddle.length === 1 && !cleanMiddle.endsWith('.')) {
      cleanMiddle += '.';
    }
    currentStudentName = [payload.first_name, cleanMiddle, payload.last_name].filter(Boolean).join(' ');
    sessionStorage.setItem('currentStudentName', currentStudentName);
    const welcomeEl = document.getElementById('dashboard-welcome');
    if (welcomeEl) {
      welcomeEl.textContent = 'Welcome, ' + currentStudentName;
    }
    const sidebarName = document.getElementById('sidebar-name-display');
    if (sidebarName) {
      sidebarName.textContent = currentStudentName;
    }
    setTimeout(() => {
      out.innerHTML = '';
    }, 3000);
  } else {
    out.innerHTML = '<p style="color:red;">Error: ' + ((result.data && result.data.error) || result.error || JSON.stringify(result.data)) + '</p>';
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
      const dashDisplay = document.getElementById('dashboard-pic-display');
      if (dashDisplay) dashDisplay.src = base64;
      const sidebarDisplay = document.getElementById('sidebar-pic-display');
      if (sidebarDisplay) sidebarDisplay.src = base64;
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



// Tab Switching for Admin Portal
function switchAdminTab(tabId) {
  // Hide all tab contents
  document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
  // Remove active styling from nav buttons
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.background = 'transparent';
    btn.style.color = '#a0aec0';
  });

  // Show active tab
  const activeTab = document.getElementById('admin-tab-' + tabId);
  if (activeTab) activeTab.style.display = 'block';

  // Highlight active button
  const activeBtn = document.getElementById('btn-admin-tab-' + tabId);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.style.background = '#7a151a';
    activeBtn.style.color = '#fff';
  }

  // Load appropriate data
  if (tabId === 'overview') {
    loadAdminStats();
  } else if (tabId === 'scholarships') {
    loadScholarships();
  } else if (tabId === 'students') {
    loadStudents();
  } else if (tabId === 'content') {
    loadContentStructure();
  } else if (tabId === 'security') {
    loadSecurityLogs();
  } else if (tabId === 'admins') {
    loadAdminsList();
  }
}

// Admin Dashboard Functions
async function loadAdminStats() {
  const out = document.getElementById('admin-stats-cards');
  if (!out) return;
  try {
    const scholarshipsResult = await apiFetch('/scholarships/index.php');
    const studentsResult = await apiFetch('/students/index.php');
    const adminsResult = await apiFetch('/admin/index.php');

    const scholarshipsCount = (scholarshipsResult.data && scholarshipsResult.data.data) ? scholarshipsResult.data.data.length : 0;
    const studentsCount = (studentsResult.data && studentsResult.data.data) ? studentsResult.data.data.length : 0;
    const adminsCount = (adminsResult.data && adminsResult.data.data) ? adminsResult.data.data.length : 0;

    out.innerHTML = `
      <div style="background: #f7fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 24px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.01);">
        <h4 style="margin: 0 0 8px 0; color: #718096; font-size: 14px; text-transform: uppercase; font-family: 'Montserrat', sans-serif;">Total Scholarships</h4>
        <span style="font-size: 36px; font-weight: 700; color: #7a151a;">${scholarshipsCount}</span>
      </div>
      <div style="background: #f7fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 24px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.01);">
        <h4 style="margin: 0 0 8px 0; color: #718096; font-size: 14px; text-transform: uppercase; font-family: 'Montserrat', sans-serif;">Registered Students</h4>
        <span style="font-size: 36px; font-weight: 700; color: #7a151a;">${studentsCount}</span>
      </div>
      <div style="background: #f7fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 24px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.01);">
        <h4 style="margin: 0 0 8px 0; color: #718096; font-size: 14px; text-transform: uppercase; font-family: 'Montserrat', sans-serif;">Administrators</h4>
        <span style="font-size: 36px; font-weight: 700; color: #7a151a;">${adminsCount}</span>
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
        <button onclick="editScholarship(${s.id})" style="background:#4a5568; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; margin-right:4px;">Edit</button>
        <button onclick="deleteScholarship(${s.id})" style="background:#e53e3e; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Delete</button>
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

  let html = '<table><tr><th>ID</th><th>Name</th><th>Email</th><th>Course</th><th>GWA</th><th>Status</th><th>Actions</th></tr>';
  list.forEach(s => {
    let cleanMiddle = (s.middle_name || '').trim();
    if (cleanMiddle && cleanMiddle.length === 1 && !cleanMiddle.endsWith('.')) {
      cleanMiddle += '.';
    }
    const fullName = [s.first_name, cleanMiddle, s.last_name].filter(Boolean).join(' ');
    
    // Status Badge
    const statusVal = s.status || 'active';
    const isBanned = statusVal === 'banned';
    const badgeColor = isBanned ? '#fed7d7' : '#c6f6d5';
    const textColor = isBanned ? '#9b2c2c' : '#22543d';
    const statusBadge = `<span style="background:${badgeColor}; color:${textColor}; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight:700; text-transform:uppercase;">${statusVal}</span>`;

    html += `<tr>
      <td>${s.id}</td>
      <td>${fullName}</td>
      <td>${s.email}</td>
      <td>${s.course || 'N/A'}</td>
      <td>${s.gwa || 'N/A'}</td>
      <td>${statusBadge}</td>
      <td>
        <button onclick="openAdminStudentModal(${s.id})" style="background:#4a5568; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; margin-right:4px;">Edit</button>
        <button onclick="toggleBanStudent(${s.id}, '${statusVal}')" style="background:${isBanned ? '#48bb78' : '#e53e3e'}; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">${isBanned ? 'Unban' : 'Ban'}</button>
      </td>
    </tr>`;
  });
  html += '</table>';
  out.innerHTML = html;
}

// Student Edit Modal actions (Admin Only)
async function openAdminStudentModal(studentId) {
  const result = await apiFetch('/students/show.php?id=' + studentId);
  if (!result.ok || !result.data || !result.data.success) {
    alert('Failed to fetch student details.');
    return;
  }
  const s = result.data.data;
  document.getElementById('admin-student-id').value = s.id;
  document.getElementById('admin-student-firstname').value = s.first_name || '';
  document.getElementById('admin-student-lastname').value = s.last_name || '';
  document.getElementById('admin-student-email').value = s.email || '';
  document.getElementById('admin-student-age').value = s.age || '';
  document.getElementById('admin-student-phone').value = s.phone_number || '';
  document.getElementById('admin-student-course').value = s.course || '';
  document.getElementById('admin-student-gwa').value = s.gwa || '';
  document.getElementById('admin-student-gender').value = s.gender || 'Male';
  document.getElementById('admin-student-country').value = s.country || '';
  document.getElementById('admin-student-status').value = s.status || 'active';
  document.getElementById('admin-student-address').value = s.address || '';
  document.getElementById('admin-student-password').value = '';
  document.getElementById('admin-student-modal-result').innerHTML = '';

  document.getElementById('admin-student-modal').style.display = 'flex';
}

function closeAdminStudentModal() {
  document.getElementById('admin-student-modal').style.display = 'none';
}

// Submit Admin Student Edits
document.getElementById('admin-student-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('admin-student-id').value;
  const first_name = document.getElementById('admin-student-firstname').value.trim();
  const last_name = document.getElementById('admin-student-lastname').value.trim();
  const email = document.getElementById('admin-student-email').value.trim();
  const age = document.getElementById('admin-student-age').value;
  const phone_number = document.getElementById('admin-student-phone').value.trim();
  const course = document.getElementById('admin-student-course').value.trim();
  const gwa = document.getElementById('admin-student-gwa').value;
  const gender = document.getElementById('admin-student-gender').value;
  const country = document.getElementById('admin-student-country').value.trim();
  const status = document.getElementById('admin-student-status').value;
  const address = document.getElementById('admin-student-address').value.trim();
  const new_password = document.getElementById('admin-student-password').value;

  const payload = { id, first_name, last_name, email, age, phone_number, course, gwa, gender, country, status, address };
  if (new_password) {
    payload.new_password = new_password;
  }

  const result = await apiFetch('/students/admin_update.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const out = document.getElementById('admin-student-modal-result');
  if (result.ok && result.data && result.data.success) {
    out.innerHTML = '<p style="color:green;">Profile updated successfully.</p>';
    logSecurityEvent('Student profile updated', `Admin edited ID: ${id} (${email})`);
    setTimeout(() => {
      closeAdminStudentModal();
      loadStudents();
    }, 1000);
  } else {
    const errMsg = (result.data && result.data.error) || 'Failed to update profile.';
    out.innerHTML = '<p style="color:red;">Error: ' + errMsg + '</p>';
  }
});

// Admin toggle ban status directly
async function toggleBanStudent(studentId, currentStatus) {
  const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
  const confirmation = confirm(`Are you sure you want to change this student's status to ${newStatus}?`);
  if (!confirmation) return;

  const result = await apiFetch('/students/admin_update.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: studentId, status: newStatus })
  });

  if (result.ok && result.data && result.data.success) {
    logSecurityEvent(newStatus === 'banned' ? 'Student account banned' : 'Student account unbanned', `Admin changed ID: ${studentId}`);
    loadStudents();
  } else {
    alert('Failed to update student status.');
  }
}

// Manage Content loading
async function loadContentStructure() {
  const result = await apiFetch('/content/index.php');
  if (!result.ok || !result.data || !result.data.success) {
    document.getElementById('admin-universities-list').innerHTML = '<p style="color:red;">Failed to load content mapping.</p>';
    return;
  }

  // Populate Universities
  const uniList = document.getElementById('admin-universities-list');
  if (uniList) {
    uniList.innerHTML = result.data.universities.map(u => `
      <div style="padding: 10px; border-bottom: 1px solid #edf2f7; font-size:13.5px; color:#2d3748;">
        <strong>${u.name}</strong><br>
        <span style="color:#718096; font-size:11.5px;">${u.location || 'No location'} | ${u.website || 'No website'}</span>
      </div>
    `).join('') || '<p style="padding:10px; color:#a0aec0;">No universities found.</p>';
  }

  // Populate Colleges
  const colList = document.getElementById('admin-colleges-list');
  if (colList) {
    colList.innerHTML = result.data.colleges.map(c => `
      <div style="padding: 10px; border-bottom: 1px solid #edf2f7; font-size:13.5px; color:#2d3748;">
        <strong>${c.name}</strong><br>
        <span style="color:#718096; font-size:11.5px;">Uni: ${c.university_name}</span>
      </div>
    `).join('') || '<p style="padding:10px; color:#a0aec0;">No colleges found.</p>';
  }

  // Populate Courses
  const courseList = document.getElementById('admin-courses-list');
  if (courseList) {
    courseList.innerHTML = result.data.courses.map(co => `
      <div style="padding: 10px; border-bottom: 1px solid #edf2f7; font-size:13.5px; color:#2d3748;">
        <strong>${co.name}</strong><br>
        <span style="color:#718096; font-size:11.5px;">Col: ${co.college_name}</span>
      </div>
    `).join('') || '<p style="padding:10px; color:#a0aec0;">No courses found.</p>';
  }
}

// Security tab management
function loadSecurityLogs() {
  const el = document.getElementById('admin-access-logs');
  if (!el) return;

  el.innerHTML = securityLogs.map(l => {
    let icon = '🔒';
    let color = '#2d3748';
    if (l.action.includes('success')) {
      icon = '✅';
      color = '#2f855a';
    } else if (l.action.includes('Failed') || l.action.includes('banned')) {
      icon = '🚨';
      color = '#c53030';
    }

    return `
      <div style="background:#f7fafc; border-left:4px solid ${color === '#2d3748' ? '#4a5568' : color}; padding: 12px 16px; border-radius: 4px; font-size: 13px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="font-weight:700; color:${color};">${icon} ${l.action}</span>
          <span style="color:#a0aec0; font-size:11px;">${l.time}</span>
        </div>
        <div style="color:#4a5568;">${l.details}</div>
      </div>
    `;
  }).join('');
}

function toggleSecurityLockout() {
  const checkbox = document.getElementById('admin-security-lockout');
  const enabled = checkbox ? checkbox.checked : false;
  logSecurityEvent('Security policy toggled', `Failed attempts lockout set to: ${enabled ? 'Enabled' : 'Disabled'}`);
}

// Load Admins list
async function loadAdminsList() {
  const out = document.getElementById('admin-accounts-list');
  if (!out) return;

  const result = await apiFetch('/admin/index.php');
  if (!result.ok || !result.data || !result.data.success) {
    out.innerHTML = '<p style="color:red;">Failed to retrieve admin accounts.</p>';
    return;
  }

  const list = result.data.data || [];
  let html = '<table style="width:100%; border-collapse:collapse; text-align:left;">';
  html += '<tr style="border-bottom:2px solid #edf2f7; color:#4a5568; font-size:13px;"><th style="padding:10px;">Admin ID</th><th style="padding:10px;">Username/Email</th><th style="padding:10px;">Created Date</th></tr>';
  list.forEach(a => {
    html += `
      <tr style="border-bottom:1px solid #edf2f7; font-size:13.5px; color:#2d3748;">
        <td style="padding:10px;">${a.id}</td>
        <td style="padding:10px;"><strong>${a.username}</strong></td>
        <td style="padding:10px;">${a.created_at || 'N/A'}</td>
      </tr>
    `;
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
  'landing', 'privacy', 'register', 'login', 'dashboard', 'profile', 'settings',
  'student-universities', 'student-uni-detail',
  'admin-dashboard', 'admin-student-view',
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
    if ((hash === 'dashboard' || hash === 'profile' || hash === 'settings' || hash === 'student-universities' || hash === 'student-uni-detail') && !currentStudentId && !isViewingAsStudent) {
      hash = 'login';
      window.location.hash = 'login';
      return;
    }
    if ((hash === 'admin-dashboard' || hash === 'admin-student-view') && !currentAdminId) {
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

// Student Settings & Sidebar Toggle Functions
function toggleSidebarMenu() {
  const appLayout = document.querySelector('.app-layout');
  if (appLayout) {
    appLayout.classList.toggle('sidebar-open');
  }
}

function loadSettingsPreferences() {
  if (!currentStudentId) return;
  const savedSettings = JSON.parse(localStorage.getItem('student_settings_' + currentStudentId)) || {};
  
  const notifyMatch = document.getElementById('settings-notify-match');
  if (notifyMatch) notifyMatch.checked = savedSettings.notifyMatch === true;
  
  const notifyDeadline = document.getElementById('settings-notify-deadline');
  if (notifyDeadline) notifyDeadline.checked = savedSettings.notifyDeadline === true;
  
  const visibility = document.getElementById('settings-visibility');
  if (visibility) visibility.value = savedSettings.visibility || 'public';
  
  const lang = document.getElementById('settings-lang');
  if (lang) lang.value = savedSettings.lang || 'en';
  
  const theme = document.getElementById('settings-theme');
  if (theme) theme.value = savedSettings.theme || 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else if (theme === 'light') {
    document.body.classList.remove('dark-mode');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}

// Save preferences submit handler
document.getElementById('settings-preferences-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!currentStudentId) return;
  
  const settings = {
    notifyMatch: document.getElementById('settings-notify-match').checked,
    notifyDeadline: document.getElementById('settings-notify-deadline').checked,
    visibility: document.getElementById('settings-visibility').value,
    lang: document.getElementById('settings-lang').value,
    theme: document.getElementById('settings-theme').value
  };
  
  localStorage.setItem('student_settings_' + currentStudentId, JSON.stringify(settings));
  applyTheme(settings.theme);
  
  const out = document.getElementById('preferences-result');
  if (out) {
    out.innerHTML = '<p style="color:green;">Preferences saved successfully.</p>';
    setTimeout(() => out.innerHTML = '', 3000);
  }
});

// Update security/password submit handler
document.getElementById('settings-password-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentStudentId) {
    document.getElementById('password-settings-result').innerHTML = '<p style="color:red;">Error: No student logged in</p>';
    return;
  }
  
  const currPass = document.getElementById('settings-curr-pass').value;
  const newPass = document.getElementById('settings-new-pass').value;
  const confirmPass = document.getElementById('settings-confirm-pass').value;
  const out = document.getElementById('password-settings-result');
  
  if (newPass !== confirmPass) {
    out.innerHTML = '<p style="color:red;">Error: New passwords do not match.</p>';
    return;
  }
  
  const payload = {
    id: currentStudentId,
    confirm_password: currPass,
    new_password: newPass
  };
  
  const result = await apiFetch('/students/update.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (result.ok && result.data && result.data.success) {
    out.innerHTML = '<p style="color:green;">Password updated successfully.</p>';
    document.getElementById('settings-password-form').reset();
    setTimeout(() => out.innerHTML = '', 3000);
  } else {
    out.innerHTML = '<p style="color:red;">Error: ' + ((result.data && result.data.error) || result.error || JSON.stringify(result.data)) + '</p>';
  }
});

// Apply current student theme on startup
(function initTheme() {
  const activeStudentId = sessionStorage.getItem('currentStudentId');
  if (activeStudentId) {
    const savedSettings = JSON.parse(localStorage.getItem('student_settings_' + activeStudentId)) || {};
    if (savedSettings.theme) {
      applyTheme(savedSettings.theme);
    }
  }
})();

// Landing Page Header Dropdown Event Handlers
function toggleLandingDropdown(event) {
  event.stopPropagation();
  const menu = document.getElementById('landing-user-menu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

function closeLandingDropdown() {
  const menu = document.getElementById('landing-user-menu');
  if (menu) {
    menu.classList.remove('open');
  }
}

window.addEventListener('click', () => {
  closeLandingDropdown();
});

// Student University Detail Rendering Functions
function showStudentUniDetail(uniKey) {
  sessionStorage.setItem('selectedStudentUniKey', uniKey);
  renderStudentUniDetail(uniKey);
  showPage('student-uni-detail');
}

function renderStudentUniDetail(uniKey) {
  const uniNames = {
    up: 'University of the Philippines Diliman',
    ateneo: 'Ateneo de Manila University',
    dlsu: 'De La Salle University',
    ust: 'University of Santo Tomas',
    feu: 'Far Eastern University',
    nu: 'National University',
    adamson: 'Adamson University',
    ue: 'University of the East'
  };

  const titleEl = document.getElementById('student-uni-detail-title');
  const descEl = document.getElementById('student-uni-detail-desc');
  const accordionEl = document.getElementById('student-uni-detail-accordion');

  if (titleEl) {
    titleEl.textContent = (uniNames[uniKey] || 'University') + ' Scholarships';
  }

  const publicPageId = uniKey + '-scholarships-page';
  const publicPage = document.getElementById(publicPageId);
  if (publicPage) {
    const publicDesc = publicPage.querySelector('.poster-bottom-desc');
    if (descEl && publicDesc) {
      descEl.textContent = publicDesc.textContent.trim();
    }

    const publicAccordion = publicPage.querySelector('.uni-right-accordion');
    if (accordionEl && publicAccordion) {
      accordionEl.innerHTML = publicAccordion.innerHTML;
    }
  }
}





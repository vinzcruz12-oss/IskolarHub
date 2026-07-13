const API_BASE = '../api';
let isViewingAsStudent = sessionStorage.getItem('isViewingAsStudent') === 'true';
let currentStudentId = sessionStorage.getItem('currentStudentId') || null;
let currentStudentName = sessionStorage.getItem('currentStudentName') || null;

if (isViewingAsStudent) {
  currentStudentId = -1;
  currentStudentName = 'Juan Dela Cruz';
}

let currentAdminId = sessionStorage.getItem('currentAdminId') || null;
let lastUniversitySource = 'landing';

// Administrative security logs simulation
const defaultSecurityLogs = [
  { time: '2026-07-09 14:10:23', action: 'Admin login success', details: 'test@admin.com from unified form' },
  { time: '2026-07-09 14:02:45', action: 'Failed login attempt', details: 'unknown@user.com' },
  { time: '2026-07-09 12:45:12', action: 'Database backup automatic', details: 'Backup verified' },
  { time: '2026-07-09 11:30:00', action: 'Security policy change', details: 'Password complexity rules set' }
];

let securityLogs = JSON.parse(localStorage.getItem('admin_security_logs')) || defaultSecurityLogs;

function logSecurityEvent(action, details) {
  const now = new Date();
  const timeStr = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0');
  securityLogs.unshift({ time: timeStr, action, details });
  
  if (securityLogs.length > 100) {
    securityLogs = securityLogs.slice(0, 100);
  }
  
  localStorage.setItem('admin_security_logs', JSON.stringify(securityLogs));

  const el = document.getElementById('admin-access-logs');
  if (el) {
    // If the security tab is active, refresh visual log list instantly
    loadSecurityLogs();
  }
}

function showPage(pageId, updateHash = true) {
  if (updateHash) {
    const currentHash = window.location.hash.substring(1) || 'landing';
    if (currentHash === pageId) {
      showPage(pageId, false);
    } else {
      window.location.hash = pageId;
    }
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

  const isUniversityPage = pageId.endsWith('-scholarships') && pageId !== 'saved-scholarships';
  if (isUniversityPage) {
    const uniKey = pageId.replace('-scholarships', '');
    renderPublicUniDetail(uniKey);
  }

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
  } else if (currentAdminId && pageId.includes('admin')) {
    const adminTheme = localStorage.getItem('admin_theme') || 'light';
    applyAdminTheme(adminTheme);
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

        const landingLogoutDivider = document.getElementById('landing-logout-divider');
        const landingLogoutBtn = document.getElementById('landing-logout-btn');
        if (landingLogoutDivider && landingLogoutBtn) {
          if (isViewingAsStudent) {
            landingLogoutDivider.style.display = 'none';
            landingLogoutBtn.style.display = 'none';
          } else {
            landingLogoutDivider.style.display = '';
            landingLogoutBtn.style.display = '';
          }
        }
      } else {
        authBtns.style.display = 'flex';
        userMenu.style.display = 'none';
      }
    }
  }



  const page = document.getElementById(pageId + '-page');
  if (page && page.style.display !== 'block') {
    window.scrollTo(0, 0);
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    page.style.display = 'block';

    if (pageId === 'landing') {
      const video = page.querySelector('.hero-video');
      if (video) {
        video.play().catch(err => console.log("Video play failed or interrupted:", err));
      }
      // Reset landing header scrolled state when entering the landing page
      handleLandingScroll();
    }
  }

  // Update navigation source tracking
  if (pageId === 'student-universities') {
    lastUniversitySource = 'student-universities';
  } else if (pageId === 'landing') {
    lastUniversitySource = 'landing';
  }

  // Toggle student and admin sidebars visibility
  const studentSidebar = document.getElementById('student-sidebar');
  const adminSidebar = document.getElementById('admin-sidebar');

  const showStudentSidebar = (currentStudentId !== null &&
    pageId !== 'landing' &&
    pageId !== 'login' &&
    pageId !== 'register' &&
    !pageId.includes('admin') &&
    (!isUniversityPage || lastUniversitySource === 'student-universities'))
    || isViewingAsStudent; // show student sidebar during admin preview

  const showAdminSidebar = currentAdminId !== null &&
    pageId.includes('admin') &&
    !isViewingAsStudent; // hide admin sidebar during preview

  if (studentSidebar) {
    studentSidebar.style.display = showStudentSidebar ? 'flex' : 'none';
  }
  if (adminSidebar) {
    adminSidebar.style.display = showAdminSidebar ? 'flex' : 'none';
  }

  if (appLayout) {
    if (showStudentSidebar || showAdminSidebar) {
      appLayout.classList.add('has-sidebar');
    } else {
      appLayout.classList.remove('has-sidebar');
    }
  }

  const banner = document.getElementById('admin-preview-banner');
  if (banner) {
    if (isViewingAsStudent) {
      banner.style.display = 'flex';
      document.body.style.paddingTop = '50px';
      document.body.classList.add('has-preview-banner');
    } else {
      banner.style.display = 'none';
      document.body.style.paddingTop = '0';
      document.body.classList.remove('has-preview-banner');
    }
  }

  if (showStudentSidebar && studentSidebar) {
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

    if (pageId === 'landing') {
      const activeLink = document.getElementById('nav-home');
      if (activeLink) activeLink.classList.add('active');
    } else if (pageId === 'dashboard') {
      const activeLink = document.getElementById('nav-find-scholarships');
      if (activeLink) activeLink.classList.add('active');
    } else if (pageId === 'settings') {
      const activeLink = document.getElementById('nav-settings-bottom');
      if (activeLink) activeLink.classList.add('active');
    } else if (pageId === 'student-universities' || pageId === 'student-uni-detail') {
      const activeLink = document.getElementById('nav-student-universities');
      if (activeLink) activeLink.classList.add('active');
    } else if (pageId === 'saved-scholarships') {
      const activeLink = document.getElementById('nav-saved-scholarships');
      if (activeLink) activeLink.classList.add('active');
    } else if (pageId === 'application-tracker') {
      const activeLink = document.getElementById('nav-application-tracker');
      if (activeLink) activeLink.classList.add('active');
    } else if (pageId === 'faqs-help') {
      const activeLink = document.getElementById('nav-faqs-help');
      if (activeLink) activeLink.classList.add('active');
    }

    // In preview mode: hide Edit Profile and Settings, swap Logout with Exit Preview
    const editProfileLink = studentSidebar.querySelector('.sidebar-edit-text');
    const settingsLink = document.getElementById('nav-settings-bottom');
    const logoutBtn = studentSidebar.querySelector('.student-logout-btn');
    if (isViewingAsStudent) {
      if (editProfileLink) editProfileLink.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'none';
    } else {
      if (editProfileLink) editProfileLink.style.display = '';
      if (settingsLink) settingsLink.style.display = '';
      if (logoutBtn) {
        logoutBtn.style.display = '';
        logoutBtn.textContent = 'Logout';
        logoutBtn.setAttribute('onclick', 'logout()');
      }
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
    toggleBtn.style.display = (showStudentSidebar || showAdminSidebar) ? 'block' : 'none';
  }

  if (pageId === 'dashboard' || pageId === 'profile' || pageId === 'settings' || pageId === 'student-universities' || pageId === 'saved-scholarships' || pageId === 'application-tracker' || pageId === 'faqs-help') {
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
      if (pageId === 'saved-scholarships') {
        loadSavedScholarships();
      }
      if (pageId === 'application-tracker') {
        renderKanbanBoard();
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

// ─── View as Student (Fake Persona Preview) ───
// Saves/restores the real student session so the admin can
// browse the actual student dashboard with a fake identity.

let savedStudentId = null;
let savedStudentName = null;

function viewAsStudent() {
  if (!currentAdminId) return;
  isViewingAsStudent = true;
  sessionStorage.setItem('isViewingAsStudent', 'true');

  // Save any real student session (unlikely but defensive)
  savedStudentId = currentStudentId;
  savedStudentName = currentStudentName;

  // Inject a fake persona — no real student record is used
  currentStudentId = -1;          // sentinel; never hits the DB
  currentStudentName = 'Juan Dela Cruz';

  // Populate the student sidebar with the fake persona
  const sidebarName = document.getElementById('sidebar-name-display');
  if (sidebarName) sidebarName.textContent = 'Juan Dela Cruz';

  const defaultPic = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2EwYWVjMCI+PHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPjwvc3ZnPg==';
  const sidebarPic = document.getElementById('sidebar-pic-display');
  if (sidebarPic) sidebarPic.src = defaultPic;

  // Clear the eligibility inputs so they start empty
  const eligCourse = document.getElementById('elig-course');
  if (eligCourse) eligCourse.value = '';

  const courseLabel = document.getElementById('course-select-label');
  if (courseLabel) courseLabel.textContent = 'Select Course';

  const eligGwa = document.getElementById('elig-gwa');
  if (eligGwa) eligGwa.value = '';

  const eligSchool = document.getElementById('elig-school');
  if (eligSchool) eligSchool.value = 'all';

  // Clear recommendation results
  const recResult = document.getElementById('rec-result');
  if (recResult) recResult.innerHTML = '<p style="color:#718096; font-size: 14.5px;">Select a course and enter a GWA above, then click "Update GWA & Course" to see matching scholarships for this persona.</p>';

  // Navigate to the student dashboard
  showPage('dashboard');
}

function returnToAdminDashboard() {
  isViewingAsStudent = false;
  sessionStorage.setItem('isViewingAsStudent', 'false');

  // Restore real session
  currentStudentId = savedStudentId;
  currentStudentName = savedStudentName;
  savedStudentId = null;
  savedStudentName = null;

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
    setTimeout(() => showPage('login'), 1500);
  } else if (result.data && result.data.already_exists) {
    out.innerHTML = '<p style="color:#718096;">Account already exists.</p>';
  } else {
    out.innerHTML = '<p style="color:red;">Error: ' + ((result.data && result.data.error) || JSON.stringify(result.data || result.error)) + '</p>';
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
  // In fake persona mode, skip DB fetch — persona fields are already set
  if (isViewingAsStudent) {
    const welcomeEl = document.getElementById('dashboard-welcome');
    if (welcomeEl) welcomeEl.textContent = 'Welcome, ' + (currentStudentName || 'Juan Dela Cruz');
    return;
  }
  const result = await apiFetch('/students/show.php?id=' + currentStudentId);
  if (result.ok && result.data && result.data.success) {
    const s = result.data.data;

    // Dashboard matching criteria - start blank on login
    if (typeof updateCustomCourseSelectValue === 'function') {
      updateCustomCourseSelectValue('');
    } else {
      const eligCourse = document.getElementById('elig-course');
      if (eligCourse) eligCourse.value = '';
    }
    const eligGwa = document.getElementById('elig-gwa');
    if (eligGwa) eligGwa.value = '';
    const eligSchool = document.getElementById('elig-school');
    if (eligSchool) eligSchool.value = 'all';

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

  // In fake persona mode, skip DB update and just recalculate recommendations
  if (isViewingAsStudent) {
    const out = document.getElementById('eligibility-result');
    out.innerHTML = '<p style="color:green;">Recalculating recommendations for persona...</p>';
    await loadRecommendations();
    setTimeout(() => { out.innerHTML = ''; }, 2000);
    return;
  }

  const eligSchoolVal = document.getElementById('elig-school')?.value;
  const payload = {
    id: currentStudentId,
    course: document.getElementById('elig-course').value || undefined,
    gwa: document.getElementById('elig-gwa').value ? parseFloat(document.getElementById('elig-gwa').value) : undefined
  };
  if (eligSchoolVal && eligSchoolVal !== 'all') {
    payload.current_school = eligSchoolVal;
  }

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

async function loadRecommendations() {
  if (!currentStudentId) {
    document.getElementById('rec-result').innerHTML = '<p style="color:red;">Please login first.</p>';
    return;
  }

  const eligCourse = document.getElementById('elig-course');
  const eligGwa = document.getElementById('elig-gwa');
  const eligSchool = document.getElementById('elig-school');
  const out = document.getElementById('rec-result');

  if (!eligCourse || !eligCourse.value || !eligGwa || !eligGwa.value) {
    out.innerHTML = '<p style="color:#718096; font-size: 14.5px;">Please select your course and enter your GWA above to view matching recommendations.</p>';
    return;
  }

  // Always pass the current form values to the recommendations API
  // so results reflect what the user just entered, not stale DB data
  let apiUrl;
  const course = encodeURIComponent(eligCourse.value || '');
  const gwa = encodeURIComponent(eligGwa.value || '0');
  const schoolVal = eligSchool && eligSchool.value !== 'all' ? eligSchool.value : '';
  const school = encodeURIComponent(schoolVal);
  if (isViewingAsStudent) {
    apiUrl = '/recommendations/index.php?course=' + course + '&gwa=' + gwa + '&school=' + school;
  } else {
    apiUrl = '/recommendations/index.php?student_id=' + encodeURIComponent(currentStudentId) + '&course=' + course + '&gwa=' + gwa + '&school=' + school;
  }

  const result = await apiFetch(apiUrl);

  if (!result.ok || !result.data || !result.data.success) {
    const errorMsg = (result.data && result.data.message) || (result.data && result.data.error) || result.error || 'Error fetching recommendations';
    const color = (result.data && result.data.message) ? '#718096' : 'red';
    out.innerHTML = '<p style="color:' + color + ';">' + errorMsg + '</p>';
    return;
  }

  let scholarships = result.data.scholarships || [];

  const typeFilter = document.getElementById('elig-type') ? document.getElementById('elig-type').value : 'all';
  if (typeFilter !== 'all') {
    scholarships = scholarships.filter(s => s.scholarship_type === typeFilter);
  }

  if (scholarships.length === 0) {
    out.innerHTML = '<p>No eligible scholarships match the selected type.</p>';
    return;
  }

  const studentGwaDisplay = (result.data.student && result.data.student.gwa) || (eligGwa ? eligGwa.value : 'N/A');

  const savedKey = 'saved_scholarships_student_' + currentStudentId;
  const savedList = JSON.parse(localStorage.getItem(savedKey)) || [];

  let html = '';
  scholarships.forEach(s => {
    const isSaved = savedList.includes(parseInt(s.id));
    const reasons = (s.reason || []).map(r => '<li>' + r + '</li>').join('');
    
    const bookmarkBtn = `
      <button onclick="toggleBookmark(${s.id})" class="btn-bookmark" style="background: none; border: none; cursor: pointer; color: ${isSaved ? '#7a151a' : '#cbd5e0'}; padding: 6px; display: inline-flex; align-items: center; justify-content: center; transition: color 0.2s;" title="${isSaved ? 'Remove from Saved' : 'Save Scholarship'}">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    `;

    const cleanTitle = s.title.replace(/'/g, "\\'");
    const cleanUni = s.university.replace(/'/g, "\\'");

    html += `
      <div class="card" style="position: relative;">
        <div style="position: absolute; top: 16px; right: 16px; display: flex; gap: 8px; align-items: center;">
          ${bookmarkBtn}
        </div>
        <h4>${s.title}</h4>
        <p><strong>University:</strong> ${s.university}</p>
        <p><strong>Type:</strong> ${s.scholarship_type}</p>
        <p><strong>Required GWA:</strong> ${s.minimum_gwa}</p>
        <p><strong>Student GWA:</strong> ${studentGwaDisplay}</p>
        <p><strong>Course:</strong> ${s.course || 'Any'}</p>
        <p><strong>Description:</strong> ${s.description}</p>
        <p><strong>Reason:</strong></p>
        <ul>${reasons}</ul>
        <div style="display: flex; gap: 12px; align-items: center; margin-top: 16px; flex-wrap: wrap;">
          ${s.official_scholarship_url ? '<a href="' + s.official_scholarship_url + '" target="_blank" style="margin-top:0;">Apply Now</a>' : '<span style="font-size: 13.5px; color: #718096;">No official link</span>'}
          <button onclick="openTrackerModal(${s.id}, '${cleanTitle}', '${cleanUni}')" class="auth-btn" style="padding: 10px 16px; margin: 0; font-size: 13.5px; background-color: #26374b; box-shadow: 0 4px 6px rgba(38, 55, 75, 0.15); display: inline-flex; align-items: center; gap: 6px; border: none; color: white;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <rect x="7" y="7" width="3" height="9"></rect>
              <rect x="14" y="7" width="3" height="5"></rect>
            </svg> Track Status
          </button>
        </div>
      </div>
    `;
  });
  out.innerHTML = html;
}



// Tab Switching for Admin Portal
function switchAdminTab(tabId) {
  // If we are currently viewing as student, return to admin dashboard first
  if (isViewingAsStudent) {
    returnToAdminDashboard();
    return;
  }

  // Hide all tab contents
  document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
  // Remove active styling from nav buttons
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show active tab
  const activeTab = document.getElementById('admin-tab-' + tabId);
  if (activeTab) activeTab.style.display = 'block';

  // Highlight active button
  const activeBtn = document.getElementById('btn-admin-tab-' + tabId);
  if (activeBtn) {
    activeBtn.classList.add('active');
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
      <div class="admin-stats-card">
        <h4>Total Scholarships</h4>
        <span>${scholarshipsCount}</span>
      </div>
      <div class="admin-stats-card">
        <h4>Registered Students</h4>
        <span>${studentsCount}</span>
      </div>
      <div class="admin-stats-card">
        <h4>Administrators</h4>
        <span>${adminsCount}</span>
      </div>
    `;
  } catch (err) {
    out.innerHTML = '<p style="color:red;">Error loading statistics</p>';
  }
}

let cachedScholarships = [];
let cachedStudents = [];

async function loadScholarships() {
  const result = await apiFetch('/scholarships/index.php');
  const out = document.getElementById('admin-table');
  if (!result.ok || !result.data || !result.data.success) {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
    return;
  }

  cachedScholarships = result.data.data || [];

  // Clear search and filter controls upon refresh/load
  const searchInput = document.getElementById('scholarship-search');
  if (searchInput) searchInput.value = '';
  const typeFilter = document.getElementById('scholarship-type-filter');
  if (typeFilter) typeFilter.value = 'all';

  renderScholarshipsTable(cachedScholarships);
}

function renderScholarshipsTable(list) {
  const out = document.getElementById('admin-table');
  if (!out) return;

  if (list.length === 0) {
    out.innerHTML = '<p style="padding: 10px; color: #a0aec0;">No matching scholarships found.</p>';
    return;
  }

  let html = '<table><tr><th>ID</th><th>Title</th><th>University</th><th>Type</th><th>Min GWA</th><th>Actions</th></tr>';
  list.forEach(s => {
    html += `<tr>
      <td>${s.id}</td>
      <td>${s.title}</td>
      <td>${s.university}</td>
      <td>${s.scholarship_type}</td>
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

function filterScholarships() {
  const query = (document.getElementById('scholarship-search')?.value || '').toLowerCase().trim();
  const typeFilter = document.getElementById('scholarship-type-filter')?.value || 'all';

  const filtered = cachedScholarships.filter(s => {
    const matchesSearch = (s.title || '').toLowerCase().includes(query) ||
      (s.university || '').toLowerCase().includes(query);
    const matchesType = typeFilter === 'all' || s.scholarship_type === typeFilter;
    return matchesSearch && matchesType;
  });

  renderScholarshipsTable(filtered);
}

async function loadStudents() {
  const result = await apiFetch('/students/index.php');
  const out = document.getElementById('admin-students-table');
  if (!result.ok || !result.data || !result.data.success) {
    out.innerHTML = '<p style="color:red;">Error: ' + JSON.stringify(result.data || result.error) + '</p>';
    return;
  }

  cachedStudents = result.data.data || [];

  // Reset inputs
  const searchInput = document.getElementById('student-search');
  if (searchInput) searchInput.value = '';
  const statusFilter = document.getElementById('student-status-filter');
  if (statusFilter) statusFilter.value = 'all';

  // Populate dynamic course filter options
  populateStudentCourseFilter(cachedStudents);

  renderStudentsTable(cachedStudents);
}

function populateStudentCourseFilter(students) {
  const select = document.getElementById('student-course-filter');
  if (!select) return;

  // Keep the "All Courses" option
  select.innerHTML = '<option value="all">All Courses</option>';

  // Collect unique courses
  const courses = [...new Set(students.map(s => s.course).filter(Boolean))].sort();
  courses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

function renderStudentsTable(list) {
  const out = document.getElementById('admin-students-table');
  if (!out) return;

  if (list.length === 0) {
    out.innerHTML = '<p style="padding: 10px; color: #a0aec0;">No matching students found.</p>';
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
        <button onclick="toggleBanStudent(${s.id}, '${statusVal}')" style="background:${isBanned ? '#48bb78' : '#e53e3e'}; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; margin-right:4px;">${isBanned ? 'Unban' : 'Ban'}</button>
        <button onclick="deleteStudentDirect(${s.id}, '${s.email}')" style="background:#e53e3e; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Remove</button>
      </td>
    </tr>`;
  });
  html += '</table>';
  out.innerHTML = html;
}

function filterStudents() {
  const query = (document.getElementById('student-search')?.value || '').toLowerCase().trim();
  const courseFilter = document.getElementById('student-course-filter')?.value || 'all';
  const statusFilter = document.getElementById('student-status-filter')?.value || 'all';

  const filtered = cachedStudents.filter(s => {
    let cleanMiddle = (s.middle_name || '').trim();
    const fullName = [s.first_name, cleanMiddle, s.last_name].filter(Boolean).join(' ').toLowerCase();

    const matchesSearch = fullName.includes(query) ||
      (s.email || '').toLowerCase().includes(query);
    const matchesCourse = courseFilter === 'all' || s.course === courseFilter;
    const matchesStatus = statusFilter === 'all' || (s.status || 'active') === statusFilter;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  renderStudentsTable(filtered);
}

async function deleteStudentDirect(id, email) {
  const confirmation = confirm(`Are you sure you want to permanently delete the account of ${email}? This action CANNOT be undone.`);
  if (!confirmation) return;

  const result = await apiFetch('/students/delete.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  if (result.ok && result.data && result.data.success) {
    logSecurityEvent('Student account deleted', `Admin deleted ID: ${id} (${email})`);
    loadStudents();
  } else {
    const errMsg = (result.data && result.data.error) || 'Failed to remove account.';
    alert('Error: ' + errMsg);
  }
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
  document.getElementById('admin-student-middlename').value = s.middle_name || '';
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

async function deleteAdminStudent() {
  const id = document.getElementById('admin-student-id').value;
  const email = document.getElementById('admin-student-email').value;
  if (!id) return;

  const confirmation = confirm(`Are you sure you want to permanently delete the account of ${email}? This action CANNOT be undone.`);
  if (!confirmation) return;

  const result = await apiFetch('/students/delete.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  const out = document.getElementById('admin-student-modal-result');
  if (result.ok && result.data && result.data.success) {
    out.innerHTML = '<p style="color:green;">Account removed successfully.</p>';
    logSecurityEvent('Student account deleted', `Admin deleted ID: ${id} (${email})`);
    setTimeout(() => {
      closeAdminStudentModal();
      loadStudents();
    }, 1000);
  } else {
    const errMsg = (result.data && result.data.error) || 'Failed to remove account.';
    out.innerHTML = '<p style="color:red;">Error: ' + errMsg + '</p>';
  }
}

// Submit Admin Student Edits
document.getElementById('admin-student-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('admin-student-id').value;
  const first_name = document.getElementById('admin-student-firstname').value.trim();
  const middle_name = document.getElementById('admin-student-middlename').value.trim();
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

  const payload = { id, first_name, middle_name, last_name, email, age, phone_number, course, gwa, gender, country, status, address };
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

  // Clear search field on load
  const searchInput = document.getElementById('content-search');
  if (searchInput) searchInput.value = '';

  // Populate Universities
  const uniList = document.getElementById('admin-universities-list');
  if (uniList) {
    uniList.innerHTML = result.data.universities.map(u => `
      <div class="admin-list-item">
        <strong>${u.university_name}</strong>
      </div>
    `).join('') || '<p style="padding:10px; color:#a0aec0;">No universities found.</p>';
  }

  // Populate Colleges
  const colList = document.getElementById('admin-colleges-list');
  if (colList) {
    colList.innerHTML = result.data.colleges.map(c => `
      <div class="admin-list-item">
        <strong>${c.college_name}</strong><br>
        <span>Uni: ${c.university_name}</span>
      </div>
    `).join('') || '<p style="padding:10px; color:#a0aec0;">No colleges found.</p>';
  }

  // Populate Courses
  const courseList = document.getElementById('admin-courses-list');
  if (courseList) {
    courseList.innerHTML = result.data.courses.map(co => `
      <div class="admin-list-item">
        <strong>${co.course_name}</strong><br>
        <span>Col: ${co.college_name}</span>
      </div>
    `).join('') || '<p style="padding:10px; color:#a0aec0;">No courses found.</p>';
  }
}

// Security tab management
function loadSecurityLogs() {
  const el = document.getElementById('admin-access-logs');
  if (!el) return;

  el.innerHTML = securityLogs.map(l => {
    let icon = '[SECURE]';
    let statusClass = 'log-status-default';
    let borderClass = 'log-border-default';

    if (l.action.includes('success')) {
      icon = '[SUCCESS]';
      statusClass = 'log-status-success';
      borderClass = 'log-border-success';
    } else if (l.action.includes('Failed') || l.action.includes('banned')) {
      icon = '[ALERT]';
      statusClass = 'log-status-danger';
      borderClass = 'log-border-danger';
    }

    return `
      <div class="security-log-card ${borderClass}">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span class="${statusClass}" style="font-weight:700;">${icon} ${l.action}</span>
          <span style="color:#a0aec0; font-size:11px;">${l.time}</span>
        </div>
        <div class="log-details">${l.details}</div>
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
  let html = '<table>';
  html += '<tr><th>Admin ID</th><th>Username/Email</th><th>Created Date</th><th>Actions</th></tr>';
  list.forEach(a => {
    const isCurrentAdmin = (currentAdminId !== null && parseInt(a.id) === parseInt(currentAdminId));
    const curBadge = isCurrentAdmin ? ' <span style="background:#e2e8f0; color:#4a5568; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:bold; margin-left:4px;">You</span>' : '';
    
    html += `
      <tr>
        <td>${a.id}</td>
        <td><strong>${a.username}</strong>${curBadge}</td>
        <td>${a.created_at || 'N/A'}</td>
        <td>
          <button onclick="openAdminAccountModal(${a.id}, '${a.username}')" style="background:#4a5568; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; margin-right:4px;">Edit Password</button>
          <button onclick="deleteAdminDirect(${a.id}, '${a.username}')" style="background:#e53e3e; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" ${isCurrentAdmin ? 'disabled title="Cannot delete yourself"' : ''}>Remove</button>
        </td>
      </tr>
    `;
  });
  html += '</table>';
  out.innerHTML = html;
}

// Open Admin Account Modal (Add or Edit)
function openAdminAccountModal(id = null, username = '') {
  document.getElementById('admin-account-form').reset();
  document.getElementById('admin-account-modal-result').innerHTML = '';
  
  const titleEl = document.getElementById('admin-account-modal-title');
  const userContainerEl = document.getElementById('admin-account-username-container');
  const userEl = document.getElementById('admin-account-username');
  const passLabelEl = document.getElementById('admin-account-pass-label');
  const passEl = document.getElementById('admin-account-password');
  const confirmPassEl = document.getElementById('admin-account-confirm-password');
  
  if (id) {
    // Edit password mode
    titleEl.textContent = 'Change Admin Password';
    userContainerEl.style.display = 'none';
    userEl.removeAttribute('required');
    userEl.value = username;
    passLabelEl.textContent = 'New Password';
    document.getElementById('admin-account-id').value = id;
  } else {
    // Add mode
    titleEl.textContent = 'Add Administrator';
    userContainerEl.style.display = 'block';
    userEl.setAttribute('required', 'true');
    userEl.value = '';
    passLabelEl.textContent = 'Password';
    document.getElementById('admin-account-id').value = '';
  }
  
  document.getElementById('admin-account-modal').style.display = 'flex';
}

function closeAdminAccountModal() {
  document.getElementById('admin-account-modal').style.display = 'none';
}

// Delete Admin
async function deleteAdminDirect(id, username) {
  const confirmation = confirm(`Are you sure you want to permanently delete the administrator account of ${username}? This action CANNOT be undone.`);
  if (!confirmation) return;

  const result = await apiFetch('/admin/delete.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  if (result.ok && result.data && result.data.success) {
    logSecurityEvent('Admin account deleted', `Admin deleted account: ${username} (ID: ${id})`);
    loadAdminsList();
  } else {
    const errMsg = (result.data && result.data.error) || 'Failed to remove admin account.';
    alert('Error: ' + errMsg);
  }
}

// Submit Add/Edit Admin Form
document.getElementById('admin-account-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('admin-account-id').value;
  const username = document.getElementById('admin-account-username').value.trim();
  const password = document.getElementById('admin-account-password').value;
  const confirmPassword = document.getElementById('admin-account-confirm-password').value;
  
  const resultDiv = document.getElementById('admin-account-modal-result');
  resultDiv.innerHTML = '';
  
  if (password.length < 6) {
    resultDiv.innerHTML = '<p style="color:red;">Password must be at least 6 characters.</p>';
    return;
  }
  
  if (password !== confirmPassword) {
    resultDiv.innerHTML = '<p style="color:red;">Passwords do not match.</p>';
    return;
  }
  
  let endpoint = '/admin/create.php';
  let payload = { username, password, confirm_password: confirmPassword };
  
  if (id) {
    endpoint = '/admin/update.php';
    payload = { id, password, confirm_password: confirmPassword };
  }
  
  const result = await apiFetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (result.ok && result.data && result.data.success) {
    const successMsg = id ? 'Admin password updated successfully.' : 'Admin account created successfully.';
    resultDiv.innerHTML = `<p style="color:green;">${successMsg}</p>`;
    
    const eventName = id ? 'Admin password changed' : 'Admin account added';
    const details = id ? `Admin changed password for ID: ${id} (${username})` : `Admin added new account: ${username}`;
    logSecurityEvent(eventName, details);
    
    setTimeout(() => {
      closeAdminAccountModal();
      loadAdminsList();
    }, 1000);
  } else {
    const errMsg = (result.data && result.data.error) || 'An error occurred. Please try again.';
    resultDiv.innerHTML = `<p style="color:red;">Error: ${errMsg}</p>`;
  }
});

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

// Unified FAQ Accordion Toggle (Handles both Landing & Dashboard FAQS)
function toggleFaq(element) {
  const accordionItem = element.closest('.faq-accordion-item');
  if (accordionItem) {
    const isActive = accordionItem.classList.contains('active');
    document.querySelectorAll('.faq-accordion-item').forEach(el => el.classList.remove('active'));
    if (!isActive) {
      accordionItem.classList.add('active');
    }
    return;
  }

  const content = element.nextElementSibling;
  if (content) {
    const arrow = element.querySelector('.faq-arrow');
    const isOpen = content.style.display === 'block';
    content.style.display = isOpen ? 'none' : 'block';
    if (arrow) {
      arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
    }
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
  'adamson-scholarships', 'ue-scholarships',
  'saved-scholarships', 'application-tracker', 'faqs-help'
];

const LANDING_ANCHORS = [
  'about', 'how-it-works', 'universities', 'faqs', 'contact'
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
    if ((hash === 'dashboard' || hash === 'profile' || hash === 'settings' || hash === 'student-universities' || hash === 'student-uni-detail' || hash === 'saved-scholarships' || hash === 'application-tracker' || hash === 'faqs-help') && !currentStudentId && !isViewingAsStudent) {
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
      
      // Offset by the height of the fixed navigation bar
      const header = document.querySelector('.hero-header');
      const headerHeight = header ? header.offsetHeight : 0;
      const targetY = rect.top + scrollTop - headerHeight;

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

// Landing page sticky header scroll listener
function handleLandingScroll() {
  const header = document.querySelector('.hero-header');
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
}
window.addEventListener('scroll', handleLandingScroll);
window.addEventListener('DOMContentLoaded', handleLandingScroll);

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

function applyAdminTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  const btn = document.getElementById('btn-admin-dark-mode');
  if (btn) {
    if (theme === 'dark') {
      btn.innerHTML = '<span class="sidebar-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></span> Dark Mode: On';
    } else {
      btn.innerHTML = '<span class="sidebar-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></span> Dark Mode: Off';
    }
  }
}

function toggleAdminDarkMode() {
  const currentTheme = localStorage.getItem('admin_theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('admin_theme', newTheme);
  applyAdminTheme(newTheme);
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

// Apply current student or admin theme on startup
(function initTheme() {
  const activeStudentId = sessionStorage.getItem('currentStudentId');
  const activeAdminId = sessionStorage.getItem('currentAdminId');

  if (activeStudentId) {
    const savedSettings = JSON.parse(localStorage.getItem('student_settings_' + activeStudentId)) || {};
    if (savedSettings.theme) {
      applyTheme(savedSettings.theme);
    }
  } else if (activeAdminId) {
    const adminTheme = localStorage.getItem('admin_theme') || 'light';
    applyAdminTheme(adminTheme);
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

async function showStudentUniDetail(uniKey) {
  sessionStorage.setItem('selectedStudentUniKey', uniKey);
  await renderStudentUniDetail(uniKey);
  showPage('student-uni-detail');
}

async function renderStudentUniDetail(uniKey) {
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

  const dbUniNames = {
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
  }

  if (accordionEl) {
    accordionEl.innerHTML = '<p style="color:#718096; text-align:center; padding: 20px;">Loading scholarships...</p>';
    
    const result = await apiFetch('/scholarships/index.php');
    if (result.ok && result.data && result.data.success) {
      const allScholarships = result.data.data || [];
      const targetUni = dbUniNames[uniKey];
      const uniScholarships = allScholarships.filter(s => s.university === targetUni);
      
      if (uniScholarships.length === 0) {
        accordionEl.innerHTML = '<p style="color:#718096; text-align:center; padding: 20px;">No scholarships found for this university.</p>';
        return;
      }
      
      let html = '';
      uniScholarships.forEach(s => {
        html += `
          <div class="uni-accordion-item">
            <div class="uni-accordion-header" onclick="toggleUniAccordion(this)">
              <span class="uni-accordion-title">${s.title}</span>
              <svg viewBox="0 0 24 24" class="uni-accordion-arrow">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>
            <div class="uni-accordion-content">
              <div class="uni-accordion-columns">
                <div class="uni-content-col">
                  <ul>
                    <li><strong>Type:</strong> ${s.scholarship_type}</li>
                    <li><strong>Coverage:</strong> Full Tuition & Fees (Refer to official requirements)</li>
                    <li><strong>Minimum GWA:</strong> ${s.minimum_gwa || 'None'}</li>
                  </ul>
                </div>
                <div class="uni-content-col">
                  <ul>
                    <li><strong>Courses:</strong> ${s.course}</li>
                    <li><strong>Requirements:</strong> ${s.requirements || 'N/A'}</li>
                    <li><strong>Deadline:</strong> ${s.deadline || 'N/A'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      accordionEl.innerHTML = html;
    } else {
      accordionEl.innerHTML = '<p style="color:red; text-align:center; padding: 20px;">Failed to load scholarships.</p>';
    }
  }
}

async function renderPublicUniDetail(uniKey) {
  const dbUniNames = {
    up: 'University of the Philippines Diliman',
    ateneo: 'Ateneo de Manila University',
    dlsu: 'De La Salle University',
    ust: 'University of Santo Tomas',
    feu: 'Far Eastern University',
    nu: 'National University',
    adamson: 'Adamson University',
    ue: 'University of the East'
  };

  const pageId = uniKey + '-scholarships-page';
  const pageEl = document.getElementById(pageId);
  if (!pageEl) return;

  const accordionEl = pageEl.querySelector('.uni-right-accordion');
  if (accordionEl) {
    accordionEl.innerHTML = '<p style="color:#718096; text-align:center; padding: 20px;">Loading scholarships...</p>';
    
    const result = await apiFetch('/scholarships/index.php');
    if (result.ok && result.data && result.data.success) {
      const allScholarships = result.data.data || [];
      const targetUni = dbUniNames[uniKey];
      const uniScholarships = allScholarships.filter(s => s.university === targetUni);
      
      if (uniScholarships.length === 0) {
        accordionEl.innerHTML = '<p style="color:#718096; text-align:center; padding: 20px;">No scholarships found for this university.</p>';
        return;
      }
      
      let html = '';
      uniScholarships.forEach(s => {
        html += `
          <div class="uni-accordion-item">
            <div class="uni-accordion-header" onclick="toggleUniAccordion(this)">
              <span class="uni-accordion-title">${s.title}</span>
              <svg viewBox="0 0 24 24" class="uni-accordion-arrow">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>
            <div class="uni-accordion-content">
              <div class="uni-accordion-columns">
                <div class="uni-content-col">
                  <ul>
                    <li><strong>Type:</strong> ${s.scholarship_type}</li>
                    <li><strong>Coverage:</strong> Full Tuition & Fees (Refer to official requirements)</li>
                    <li><strong>Minimum GWA:</strong> ${s.minimum_gwa || 'None'}</li>
                  </ul>
                </div>
                <div class="uni-content-col">
                  <ul>
                    <li><strong>Courses:</strong> ${s.course}</li>
                    <li><strong>Requirements:</strong> ${s.requirements || 'N/A'}</li>
                    <li><strong>Deadline:</strong> ${s.deadline || 'N/A'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      accordionEl.innerHTML = html;
    } else {
      accordionEl.innerHTML = '<p style="color:red; text-align:center; padding: 20px;">Failed to load scholarships.</p>';
    }
  }
}

// Admin Portal Search & Filter Helper Functions
function filterContentDOM() {
  const query = (document.getElementById('content-search')?.value || '').toLowerCase().trim();

  // Filter Universities
  document.querySelectorAll('#admin-universities-list .admin-list-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(query) ? 'block' : 'none';
  });

  // Filter Colleges
  document.querySelectorAll('#admin-colleges-list .admin-list-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(query) ? 'block' : 'none';
  });

  // Filter Courses
  document.querySelectorAll('#admin-courses-list .admin-list-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(query) ? 'block' : 'none';
  });
}

// Register Global Event Listeners for Filters using Event Delegation
document.addEventListener('input', (e) => {
  if (e.target) {
    if (e.target.id === 'scholarship-search') {
      filterScholarships();
    } else if (e.target.id === 'student-search') {
      filterStudents();
    } else if (e.target.id === 'content-search') {
      filterContentDOM();
    }
  }
});

document.addEventListener('change', (e) => {
  if (e.target) {
    if (e.target.id === 'scholarship-type-filter') {
      filterScholarships();
    } else if (e.target.id === 'student-course-filter') {
      filterStudents();
    } else if (e.target.id === 'student-status-filter') {
      filterStudents();
    }
  }
});

// Custom Searchable Dropdown Javascript Logic
const customCourseOptions = [
  "BS Computer Science",
  "BS Information Technology",
  "BS Civil Engineering",
  "BS Nursing",
  "BS Accountancy",
  "BS Psychology",
  "BS Education",
  "BS Business Administration",
  "BS Mechanical Engineering",
  "BS Electrical Engineering",
  "BS Chemical Engineering",
  "BS Architecture",
  "BS Biology",
  "BS Chemistry",
  "BS Mathematics",
  "BA Communication",
  "BA Sociology",
  "BA Fine Arts"
];

function updateCustomCourseSelectValue(val) {
  const input = document.getElementById('elig-course');
  if (input) input.value = val || '';
  const label = document.getElementById('course-select-label');
  if (label) label.textContent = val || 'Select Course';

  document.querySelectorAll('#course-select-options .custom-select-option').forEach(opt => {
    if (val && opt.getAttribute('data-value') === val) {
      opt.classList.add('selected');
    } else {
      opt.classList.remove('selected');
    }
  });
}

function initCustomCourseSelect() {
  const optionsContainer = document.getElementById('course-select-options');
  if (!optionsContainer) return;

  // Populate options list
  optionsContainer.innerHTML = customCourseOptions.map(c =>
    `<li class="custom-select-option" data-value="${c}">${c}</li>`
  ).join('');

  const wrapper = document.getElementById('course-select-wrapper');
  const trigger = document.getElementById('course-select-trigger');
  const dropdown = document.getElementById('course-select-dropdown');
  const searchInput = document.getElementById('course-select-search');

  if (!trigger || !dropdown || !searchInput) return;

  // Toggle Dropdown Display
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = wrapper.classList.contains('open');
    if (isOpen) {
      wrapper.classList.remove('open');
      dropdown.style.display = 'none';
    } else {
      wrapper.classList.add('open');
      dropdown.style.display = 'flex';
      searchInput.value = '';
      // Reset filter on open
      document.querySelectorAll('#course-select-options .custom-select-option').forEach(opt => {
        opt.style.display = 'block';
      });
      searchInput.focus();
    }
  });

  // Filter List via Search Input
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    document.querySelectorAll('#course-select-options .custom-select-option').forEach(opt => {
      const text = opt.textContent.toLowerCase();
      opt.style.display = text.includes(query) ? 'block' : 'none';
    });
  });

  // Stop event bubbling inside dropdown
  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close dropdown on clicking outside
  document.addEventListener('click', () => {
    wrapper.classList.remove('open');
    dropdown.style.display = 'none';
  });

  // Select Option Handler
  optionsContainer.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('custom-select-option')) {
      const selectedValue = e.target.getAttribute('data-value');
      updateCustomCourseSelectValue(selectedValue);
      wrapper.classList.remove('open');
      dropdown.style.display = 'none';
    }
  });
}

// Automatically Initialize custom select component
initCustomCourseSelect();

// Initialize Password Visibility Toggles
function initPasswordToggles() {
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  passwordInputs.forEach(input => {
    // Avoid double wrapping if called multiple times
    if (input.parentElement.classList.contains('password-input-wrapper')) return;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'password-input-wrapper';

    // Copy some layout styling from input if present to wrapper to maintain inline/grid positioning
    if (input.style.display) {
      wrapper.style.display = input.style.display;
    }

    // Insert wrapper in DOM before input
    input.parentNode.insertBefore(wrapper, input);

    // Move input into wrapper
    wrapper.appendChild(input);

    // Create button
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'password-toggle-btn';
    toggleBtn.innerHTML = `
      <svg class="eye-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;

    // Append button to wrapper
    wrapper.appendChild(toggleBtn);

    // Event listener
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      if (isPassword) {
        // Change to Eye Off
        toggleBtn.innerHTML = `
          <svg class="eye-icon-off" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        `;
      } else {
        // Change to Eye
        toggleBtn.innerHTML = `
          <svg class="eye-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
      }

      // Maintain focus on the input field
      input.focus();
    });
  });
}

// Call on load
initPasswordToggles();

// ─── Saved & Bookmarked Scholarships ───
function toggleBookmark(scholarshipId) {
  if (!currentStudentId) return;
  const key = 'saved_scholarships_student_' + currentStudentId;
  let saved = JSON.parse(localStorage.getItem(key)) || [];
  const index = saved.indexOf(parseInt(scholarshipId));
  if (index > -1) {
    saved.splice(index, 1);
  } else {
    saved.push(parseInt(scholarshipId));
  }
  localStorage.setItem(key, JSON.stringify(saved));
  
  // Reload the current page context to refresh heart status
  const hash = window.location.hash.substring(1) || 'landing';
  if (hash === 'dashboard') {
    loadRecommendations();
  } else if (hash === 'saved-scholarships') {
    loadSavedScholarships();
  }
}

async function loadSavedScholarships() {
  const container = document.getElementById('saved-scholarships-container');
  if (!container) return;

  if (!currentStudentId) {
    container.innerHTML = '<p style="color:red;">Please login first.</p>';
    return;
  }

  const key = 'saved_scholarships_student_' + currentStudentId;
  const savedIds = JSON.parse(localStorage.getItem(key)) || [];

  if (savedIds.length === 0) {
    container.innerHTML = '<p style="color:#718096; font-size: 14.5px;">You haven\'t bookmarked any scholarships yet. Browse recommended scholarships or partner universities to save them.</p>';
    return;
  }

  container.innerHTML = '<p style="color: #a0aec0;">Loading your bookmarked scholarships...</p>';

  // Fetch all scholarships from DB
  const result = await apiFetch('/scholarships/index.php');
  if (!result.ok || !result.data || !result.data.success) {
    container.innerHTML = '<p style="color:red;">Error loading scholarships.</p>';
    return;
  }

  const allScholarships = result.data.data || [];
  const savedScholarships = allScholarships.filter(s => savedIds.includes(parseInt(s.id)));

  if (savedScholarships.length === 0) {
    container.innerHTML = '<p style="color:#718096; font-size: 14.5px;">No matching saved scholarships found.</p>';
    return;
  }

  let html = '';
  savedScholarships.forEach(s => {
    const isSaved = true;
    const bookmarkBtn = `
      <button onclick="toggleBookmark(${s.id})" class="btn-bookmark" style="background: none; border: none; cursor: pointer; color: #7a151a; padding: 6px; display: inline-flex; align-items: center; justify-content: center; transition: color 0.2s;" title="Remove from Saved">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    `;

    const cleanTitle = s.title.replace(/'/g, "\\'");
    const cleanUni = s.university.replace(/'/g, "\\'");

    html += `
      <div class="card" style="position: relative;">
        <div style="position: absolute; top: 16px; right: 16px; display: flex; gap: 8px; align-items: center;">
          ${bookmarkBtn}
        </div>
        <h4>${s.title}</h4>
        <p><strong>University:</strong> ${s.university}</p>
        <p><strong>Type:</strong> ${s.scholarship_type}</p>
        <p><strong>Required GWA:</strong> ${s.minimum_gwa}</p>
        <p><strong>Course:</strong> ${s.course || 'Any'}</p>
        <p><strong>Description:</strong> ${s.description}</p>
        <div style="display: flex; gap: 12px; align-items: center; margin-top: 16px; flex-wrap: wrap;">
          ${s.official_scholarship_url ? '<a href="' + s.official_scholarship_url + '" target="_blank" style="margin-top:0;">Apply Now</a>' : '<span style="font-size: 13.5px; color: #718096;">No official link</span>'}
          <button onclick="openTrackerModal(${s.id}, '${cleanTitle}', '${cleanUni}')" class="auth-btn" style="padding: 10px 16px; margin: 0; font-size: 13.5px; background-color: #26374b; box-shadow: 0 4px 6px rgba(38, 55, 75, 0.15); display: inline-flex; align-items: center; gap: 6px; border: none; color: white;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <rect x="7" y="7" width="3" height="9"></rect>
              <rect x="14" y="7" width="3" height="5"></rect>
            </svg> Track Status
          </button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

// ─── Application Status Tracker ───
let cachedAllScholarships = [];

async function fetchAllScholarships() {
  if (cachedAllScholarships.length > 0) return cachedAllScholarships;
  const result = await apiFetch('/scholarships/index.php');
  if (result.ok && result.data && result.data.success) {
    cachedAllScholarships = result.data.data || [];
  }
  return cachedAllScholarships;
}

async function onTrackerUniChange() {
  const uniSelect = document.getElementById('tracker-uni-select');
  const customUniGroup = document.getElementById('tracker-uni-custom-group');
  const titleSelect = document.getElementById('tracker-title-select');
  const customTitleGroup = document.getElementById('tracker-title-custom-group');
  const customUniInput = document.getElementById('tracker-uni');
  const customTitleInput = document.getElementById('tracker-title');

  const selectedUni = uniSelect.value;

  if (selectedUni === 'custom') {
    customUniGroup.style.display = 'block';
    customUniInput.value = '';
    customUniInput.required = true;
    
    titleSelect.innerHTML = '<option value="custom">Other (Custom)</option>';
    titleSelect.value = 'custom';
    customTitleGroup.style.display = 'block';
    customTitleInput.value = '';
    customTitleInput.required = true;
  } else if (!selectedUni) {
    customUniGroup.style.display = 'none';
    customUniInput.value = '';
    customUniInput.required = false;
    titleSelect.innerHTML = '<option value="">Select Scholarship</option><option value="custom">Other (Custom)</option>';
    titleSelect.value = '';
    customTitleGroup.style.display = 'none';
    customTitleInput.value = '';
    customTitleInput.required = false;
  } else {
    customUniGroup.style.display = 'none';
    customUniInput.value = selectedUni;
    customUniInput.required = false;

    const scholarships = await fetchAllScholarships();
    const matching = scholarships.filter(s => {
      const sUni = s.university.toLowerCase();
      const selUni = selectedUni.toLowerCase();
      return sUni.includes(selUni) || selUni.includes(sUni);
    });

    let html = '<option value="">Select Scholarship</option>';
    matching.forEach(s => {
      html += `<option value="${s.title}" data-id="${s.id}">${s.title}</option>`;
    });
    html += '<option value="custom">Other (Custom)</option>';
    titleSelect.innerHTML = html;
    titleSelect.value = '';
    
    customTitleGroup.style.display = 'none';
    customTitleInput.value = '';
    customTitleInput.required = false;
  }
}

function onTrackerTitleChange() {
  const titleSelect = document.getElementById('tracker-title-select');
  const customTitleGroup = document.getElementById('tracker-title-custom-group');
  const customTitleInput = document.getElementById('tracker-title');
  const selectedTitle = titleSelect.value;
  const scholarshipIdInput = document.getElementById('tracker-scholarship-id');

  if (selectedTitle === 'custom') {
    customTitleGroup.style.display = 'block';
    customTitleInput.value = '';
    customTitleInput.required = true;
    scholarshipIdInput.value = '';
  } else {
    customTitleGroup.style.display = 'none';
    customTitleInput.value = selectedTitle;
    customTitleInput.required = false;

    const selectedOption = titleSelect.options[titleSelect.selectedIndex];
    const sId = selectedOption ? selectedOption.getAttribute('data-id') : null;
    scholarshipIdInput.value = sId || '';
  }
}

async function openTrackerModal(scholarshipId, title, university) {
  const modal = document.getElementById('tracker-modal');
  if (!modal) return;

  const uniSelect = document.getElementById('tracker-uni-select');
  const customUniGroup = document.getElementById('tracker-uni-custom-group');
  const titleSelect = document.getElementById('tracker-title-select');
  const customTitleGroup = document.getElementById('tracker-title-custom-group');
  const customUniInput = document.getElementById('tracker-uni');
  const customTitleInput = document.getElementById('tracker-title');
  const scholarshipIdInput = document.getElementById('tracker-scholarship-id');

  scholarshipIdInput.value = scholarshipId || '';
  customUniInput.value = university || '';
  customTitleInput.value = title || '';
  document.getElementById('tracker-status').value = 'Draft';

  const scholarships = await fetchAllScholarships();

  let matchedUni = '';
  if (university) {
    const uniOptions = Array.from(uniSelect.options).map(opt => opt.value);
    const lowerUni = university.toLowerCase();
    matchedUni = uniOptions.find(opt => opt && (lowerUni.includes(opt.toLowerCase()) || opt.toLowerCase().includes(lowerUni)));
  }

  if (matchedUni) {
    uniSelect.value = matchedUni;
    customUniGroup.style.display = 'none';
    customUniInput.required = false;

    const matching = scholarships.filter(s => {
      const sUni = s.university.toLowerCase();
      const selUni = matchedUni.toLowerCase();
      return sUni.includes(selUni) || selUni.includes(sUni);
    });

    let html = '<option value="">Select Scholarship</option>';
    matching.forEach(s => {
      html += `<option value="${s.title}" data-id="${s.id}">${s.title}</option>`;
    });
    html += '<option value="custom">Other (Custom)</option>';
    titleSelect.innerHTML = html;

    let matchedTitle = '';
    if (title) {
      const match = matching.find(s => s.title.toLowerCase() === title.toLowerCase());
      if (match) {
        matchedTitle = match.title;
        scholarshipIdInput.value = match.id;
      }
    }

    if (matchedTitle) {
      titleSelect.value = matchedTitle;
      customTitleGroup.style.display = 'none';
      customTitleInput.required = false;
    } else if (title) {
      titleSelect.value = 'custom';
      customTitleGroup.style.display = 'block';
      customTitleInput.value = title;
      customTitleInput.required = true;
    } else {
      titleSelect.value = '';
      customTitleGroup.style.display = 'none';
      customTitleInput.required = false;
    }
  } else if (university || title) {
    uniSelect.value = university ? 'custom' : '';
    customUniGroup.style.display = university ? 'block' : 'none';
    customUniInput.required = !!university;

    titleSelect.innerHTML = '<option value="custom">Other (Custom)</option>';
    titleSelect.value = 'custom';
    customTitleGroup.style.display = 'block';
    customTitleInput.required = true;
  } else {
    uniSelect.value = '';
    customUniGroup.style.display = 'none';
    customUniInput.required = false;

    titleSelect.innerHTML = '<option value="">Select Scholarship</option><option value="custom">Other (Custom)</option>';
    titleSelect.value = '';
    customTitleGroup.style.display = 'none';
    customTitleInput.required = false;
  }

  modal.style.display = 'flex';
}

function closeTrackerModal() {
  const modal = document.getElementById('tracker-modal');
  if (modal) modal.style.display = 'none';
}

// Form submit handler for Tracker Modal
document.getElementById('tracker-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!currentStudentId) return;

  const id = document.getElementById('tracker-scholarship-id').value;
  const title = document.getElementById('tracker-title').value.trim();
  const university = document.getElementById('tracker-uni').value.trim();
  const status = document.getElementById('tracker-status').value;

  const key = 'student_applications_' + currentStudentId;
  let apps = JSON.parse(localStorage.getItem(key)) || [];

  if (id) {
    // If tracking a specific scholarship, check if it's already tracked and update/override it
    const existingIndex = apps.findIndex(app => app.scholarshipId === parseInt(id));
    if (existingIndex > -1) {
      apps[existingIndex].status = status;
      apps[existingIndex].title = title;
      apps[existingIndex].university = university;
      apps[existingIndex].dateUpdated = new Date().toISOString().split('T')[0];
    } else {
      apps.push({
        id: Date.now(),
        scholarshipId: parseInt(id),
        title,
        university,
        status,
        dateUpdated: new Date().toISOString().split('T')[0]
      });
    }
  } else {
    // Add custom application
    apps.push({
      id: Date.now(),
      scholarshipId: null,
      title,
      university,
      status,
      dateUpdated: new Date().toISOString().split('T')[0]
    });
  }

  localStorage.setItem(key, JSON.stringify(apps));
  closeTrackerModal();

  // If currently on tracker page, refresh kanban
  const hash = window.location.hash.substring(1) || 'landing';
  if (hash === 'application-tracker') {
    renderKanbanBoard();
  } else {
    // Navigate to tracker page to show it
    showPage('application-tracker');
  }
});

function renderKanbanBoard() {
  if (!currentStudentId) return;

  const key = 'student_applications_' + currentStudentId;
  const apps = JSON.parse(localStorage.getItem(key)) || [];
  const statuses = ['Draft', 'Submitted', 'Under Review', 'Shortlisted', 'Offered', 'Declined'];

  // Clear lists and count badges
  statuses.forEach(status => {
    const listId = 'list-' + status.replace(' ', '-');
    const badgeId = 'badge-' + status.replace(' ', '-');
    const list = document.getElementById(listId);
    const badge = document.getElementById(badgeId);

    if (list) list.innerHTML = '';
    if (badge) badge.textContent = '0';
  });

  // Populate cards
  apps.forEach(app => {
    const status = app.status;
    const listId = 'list-' + status.replace(' ', '-');
    const badgeId = 'badge-' + status.replace(' ', '-');
    const list = document.getElementById(listId);
    const badge = document.getElementById(badgeId);

    if (!list) return;

    // Increment count badge
    if (badge) {
      badge.textContent = parseInt(badge.textContent) + 1;
    }

    const card = document.createElement('div');
    card.className = 'kanban-card';

    card.innerHTML = `
      <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: inherit; line-height: 1.4; font-family: 'Montserrat', sans-serif;">${app.title}</h4>
      <p style="margin: 0; font-size: 11.5px; color: #718096;">${app.university}</p>
      <div style="font-size: 10px; color: #a0aec0; margin-top: -2px;">Updated: ${app.dateUpdated || 'N/A'}</div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
        <select onchange="moveApplication(${app.id}, this.value)" style="font-size: 11px; padding: 4px 6px; border: 1px solid #cbd5e0; border-radius: 4px; color: inherit; width: 125px; cursor: pointer; font-family: inherit;">
          <option value="Draft" ${status === 'Draft' ? 'selected' : ''}>Draft</option>
          <option value="Submitted" ${status === 'Submitted' ? 'selected' : ''}>Submitted</option>
          <option value="Under Review" ${status === 'Under Review' ? 'selected' : ''}>Under Review</option>
          <option value="Shortlisted" ${status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
          <option value="Offered" ${status === 'Offered' ? 'selected' : ''}>Offered</option>
          <option value="Declined" ${status === 'Declined' ? 'selected' : ''}>Declined</option>
        </select>
        
        <button onclick="deleteApplication(${app.id})" style="background: none; border: none; cursor: pointer; color: #e53e3e; display: inline-flex; align-items: center; justify-content: center; padding: 4px;" title="Delete Application">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
    list.appendChild(card);
  });

  // Show empty indicator inside columns if 0 cards
  statuses.forEach(status => {
    const listId = 'list-' + status.replace(' ', '-');
    const list = document.getElementById(listId);
    if (list && list.children.length === 0) {
      list.innerHTML = '<div style="font-size:12px; color:#a0aec0; text-align:center; padding:16px 0; border:1px dashed #e2e8f0; border-radius:6px;">No apps</div>';
    }
  });
}

function moveApplication(appId, newStatus) {
  if (!currentStudentId) return;

  const key = 'student_applications_' + currentStudentId;
  let apps = JSON.parse(localStorage.getItem(key)) || [];
  const index = apps.findIndex(app => app.id === appId);

  if (index > -1) {
    apps[index].status = newStatus;
    apps[index].dateUpdated = new Date().toISOString().split('T')[0];
    localStorage.setItem(key, JSON.stringify(apps));
    renderKanbanBoard();
  }
}

function deleteApplication(appId) {
  if (!currentStudentId) return;
  if (!confirm('Are you sure you want to remove this application from the tracker?')) return;

  const key = 'student_applications_' + currentStudentId;
  let apps = JSON.parse(localStorage.getItem(key)) || [];
  apps = apps.filter(app => app.id !== appId);

  localStorage.setItem(key, JSON.stringify(apps));
  renderKanbanBoard();
}

// FAQs & Help Center Contact Form event handler wires up below

// Wire up FAQs & Help Center Contact Form automatically
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('help-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const out = document.getElementById('contact-result');
      out.innerHTML = '<p style="color:green; font-weight:600; margin-top: 12px;">Thank you! Your message has been sent successfully. Our team will get back to you shortly.</p>';
      contactForm.reset();
      setTimeout(() => { out.innerHTML = ''; }, 5000);
    });
  }

  const landingContact = document.getElementById('landing-contact-form');
  if (landingContact) {
    landingContact.addEventListener('submit', (e) => {
      e.preventDefault();
      const out = document.getElementById('landing-contact-result');
      if (out) {
        out.innerHTML = '<p style="color:green; font-weight:600; margin-top: 12px;">Thank you! Your message has been sent successfully. Our team will get back to you shortly.</p>';
        landingContact.reset();
        setTimeout(() => { out.innerHTML = ''; }, 5000);
      }
    });
  }
});





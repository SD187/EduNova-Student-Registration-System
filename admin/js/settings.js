const API_BASE = `${window.location.origin}/api`;

function toast(msg, type='info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 2200);
}

function getToken(){ return localStorage.getItem('adminToken') || localStorage.getItem('token'); }

async function fetchJson(url, options={}){
  const res = await fetch(url, options);
  const ct = res.headers.get('content-type') || '';
  const body = ct.includes('application/json') ? await res.json() : await res.text();
  if(!res.ok) throw new Error(body?.message || (typeof body==='string'? body : 'Request failed'));
  return body;
}

async function loadProfile(){
  // Use token to decode minimal info provided by login response? Backend lacks profile endpoint → derive from token is not safe.
  // We will add a backend /api/admin/me for current admin profile.
  const data = await fetchJson(`${API_BASE}/admin/me`, { headers: { 'Authorization': `Bearer ${getToken()}` }});
  document.getElementById('profileFullName').value = data.full_name || '';
  document.getElementById('profileEmail').value = data.email || '';
  document.getElementById('profileUsername').value = data.username || '';
  document.getElementById('profileRole').value = data.role || '';
}

async function saveProfile(){
  const payload = {
    full_name: document.getElementById('profileFullName').value.trim(),
    email: document.getElementById('profileEmail').value.trim()
  };
  await fetchJson(`${API_BASE}/admin/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(payload)
  });
  toast('Profile updated');
}

async function changePassword(){
  const payload = {
    current_password: document.getElementById('currentPassword').value,
    new_password: document.getElementById('newPassword').value,
    confirm_password: document.getElementById('confirmPassword').value
  };
  if (payload.new_password !== payload.confirm_password) { toast('Passwords do not match', 'error'); return; }
  await fetchJson(`${API_BASE}/admin/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(payload)
  });
  toast('Password changed');
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
}

async function loadAppSettings(){
  const data = await fetchJson(`${API_BASE}/settings/app`, { headers: { 'Authorization': `Bearer ${getToken()}` }});
  document.getElementById('appSiteName').value = data.site_name || 'EduNova';
  document.getElementById('appLogoUrl').value = data.logo_url || '';
  document.getElementById('appCorsOrigins').value = (data.cors_origins||[]).join(',');
  document.getElementById('appEnableRegistrations').value = String(!!data.enable_registrations);
}

async function saveAppSettings(){
  const payload = {
    site_name: document.getElementById('appSiteName').value.trim(),
    logo_url: document.getElementById('appLogoUrl').value.trim(),
    cors_origins: document.getElementById('appCorsOrigins').value.split(',').map(s=>s.trim()).filter(Boolean),
    enable_registrations: document.getElementById('appEnableRegistrations').value === 'true'
  };
  await fetchJson(`${API_BASE}/settings/app`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(payload)
  });
  toast('Application settings saved');
}

function setupNav(){
  document.querySelectorAll('.nav-item').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if (href) window.location.href = href;
    });
  });
  const logout = document.querySelector('.logout-btn');
  if (logout) logout.addEventListener('click', ()=>{ localStorage.removeItem('adminToken'); localStorage.removeItem('token'); window.location.href='logout.html'; });
}

document.addEventListener('DOMContentLoaded', async ()=>{
  try {
    setupNav();
    await loadProfile();
    await loadAppSettings();
    document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);
    document.getElementById('changePasswordBtn').addEventListener('click', changePassword);
    document.getElementById('saveAppSettingsBtn').addEventListener('click', saveAppSettings);
  } catch (e) {
    toast(e.message || 'Failed to load settings', 'error');
  }
});

// Expose a global logout compatible with sidebar onclick in settings.html
window.logout = function(){
  try {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
  } catch(e) {}
  window.location.href = 'logout.html';
};



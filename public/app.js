const API_BASE = window.location.origin.includes('3000') 
  ? '' 
  : 'http://localhost:3000'; // fallback to local backend if frontend is hosted on separate origin

let currentRole = 'volunteer'; // Default selection
let currentUser = null;
let events = [];

// Show dynamic toast notifications
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.className = 'toast'; // Reset
  
  if (type === 'error') {
    toast.classList.add('toast-error');
  } else if (type === 'success') {
    toast.classList.add('toast-success');
  }
  
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 4000);
}

// Switch between volunteer and admin tabs
function switchTab(role) {
  currentRole = role;
  document.getElementById('tab-volunteer').classList.toggle('active', role === 'volunteer');
  document.getElementById('tab-admin').classList.toggle('active', role === 'admin');
}

// Handle login submissions
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const endpoint = currentRole === 'admin' ? '/api/auth/admin' : '/api/auth/volunteer';
  const submitBtn = document.getElementById('login-submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerText = 'Signing In...';

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Invalid credentials');
    }

    showToast('Logged in successfully!');
    
    // In our payload: 
    // Volunteer returns: { data: { user: { id, name, email }, token } }
    // Admin returns: { data: { admin: { id, name, email }, token } }
    const userPayload = currentRole === 'admin' ? result.data.admin : result.data.user;
    currentUser = {
      id: userPayload.id,
      name: userPayload.name,
      email: userPayload.email,
      role: currentRole
    };
    
    setupDashboard();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = 'Sign In';
  }
}

// Setup elements upon successful login
function setupDashboard() {
  document.getElementById('auth-view').classList.add('hidden');
  document.getElementById('dashboard-view').classList.remove('hidden');
  
  // Set role and username header badges
  document.getElementById('user-role-badge').innerText = currentUser.role;
  document.getElementById('user-display-name').innerText = currentUser.name;

  // Toggle Admin panel options
  const adminPanel = document.getElementById('admin-create-event-card');
  if (currentUser.role === 'admin') {
    adminPanel.classList.remove('hidden');
  } else {
    adminPanel.classList.add('hidden');
  }

  // Fetch events
  loadEvents();
}

// Fetch all events from API
async function loadEvents() {
  const loader = document.getElementById('events-loader');
  const grid = document.getElementById('events-grid');
  loader.classList.remove('hidden');
  grid.innerHTML = '';

  try {
    const response = await fetch(`${API_BASE}/api/events`, {
      credentials: 'include'
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Could not fetch events');
    }

    events = result.data || [];
    document.getElementById('total-events-count').innerText = events.length;
    document.getElementById('event-list-badge').innerText = `${events.length} active`;
    
    if (events.length === 0) {
      grid.innerHTML = '<div class="no-data">No volunteering events available.</div>';
    } else {
      events.forEach(event => {
        const card = createEventCard(event);
        grid.appendChild(card);
      });
    }
  } catch (err) {
    showToast(err.message, 'error');
    grid.innerHTML = `<div class="no-data">${err.message}</div>`;
  } finally {
    loader.classList.add('hidden');
  }
}

// Create Card markup for events
function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'event-card';

  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const isExpired = dateObj < new Date();
  
  let actionButtonsHtml = '';
  if (currentUser.role === 'admin') {
    actionButtonsHtml = `<button class="btn btn-primary btn-sm" onclick="viewRegistrations('${event.id}', '${escapeHtml(event.title)}')">View Registrations</button>`;
  } else {
    actionButtonsHtml = `<button class="btn btn-success btn-sm" onclick="registerForEvent('${event.id}')" ${isExpired ? 'disabled' : ''}>Register</button>`;
  }

  card.innerHTML = `
    <div class="event-header">
      <span class="event-title">${escapeHtml(event.title)}</span>
      <span class="event-status-tag status-${event.status}">${event.status}</span>
    </div>
    <p class="event-desc">${escapeHtml(event.description || 'No description provided.')}</p>
    <div class="event-meta">
      <span>📍 <strong>Location:</strong> ${escapeHtml(event.location)}</span>
      <span>📅 <strong>Date:</strong> ${formattedDate}</span>
      <span>👥 <strong>Capacity:</strong> ${event.capacity} volunteers</span>
    </div>
    <div class="event-actions">
      ${actionButtonsHtml}
    </div>
  `;

  return card;
}

// Register volunteer to event
async function registerForEvent(eventId) {
  try {
    const response = await fetch(`${API_BASE}/api/events/registration/${eventId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }
    showToast('Successfully registered for event!');
    
    // Update active registration count
    const regCountEl = document.getElementById('active-registrations-count');
    regCountEl.innerText = parseInt(regCountEl.innerText) + 1;
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Admin action: view registrations modal
async function viewRegistrations(eventId, eventTitle) {
  const modal = document.getElementById('registrations-modal');
  const loader = document.getElementById('registrations-loader');
  const table = document.getElementById('registrations-table');
  const list = document.getElementById('registrations-list');
  const noData = document.getElementById('no-registrations-msg');
  
  document.getElementById('modal-event-title').innerText = `Registrations for ${eventTitle}`;
  modal.classList.remove('hidden');
  loader.classList.remove('hidden');
  table.classList.add('hidden');
  noData.classList.add('hidden');
  list.innerHTML = '';

  try {
    const response = await fetch(`${API_BASE}/api/events/registration/${eventId}`, {
      credentials: 'include'
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Could not load registrations');
    }
    
    const registrations = result.data || [];
    if (registrations.length === 0) {
      noData.classList.remove('hidden');
    } else {
      table.classList.remove('hidden');
      registrations.forEach(reg => {
        const row = document.createElement('tr');
        const regDate = new Date(reg.registered_at).toLocaleString();
        row.innerHTML = `
          <td><code>${reg.volunteer_id}</code></td>
          <td>${regDate}</td>
        `;
        list.appendChild(row);
      });
    }
  } catch (err) {
    showToast(err.message, 'error');
    noData.innerText = err.message;
    noData.classList.remove('hidden');
  } finally {
    loader.classList.add('hidden');
  }
}

// Close registrations modal
function closeRegistrationsModal() {
  document.getElementById('registrations-modal').classList.add('hidden');
}

// Create new Event (Admin)
async function handleCreateEvent(event) {
  event.preventDefault();
  
  const title = document.getElementById('event-title').value.trim();
  const description = document.getElementById('event-description').value.trim();
  const location = document.getElementById('event-location').value.trim();
  const date = document.getElementById('event-date').value;
  const capacity = parseInt(document.getElementById('event-capacity').value);
  const status = document.getElementById('event-status').value;

  try {
    const response = await fetch(`${API_BASE}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, location, date, capacity, status }),
      credentials: 'include'
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create event');
    }

    showToast('Event published successfully!');
    document.getElementById('create-event-form').reset();
    
    // Reload events explorer
    loadEvents();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Logout session
async function handleLogout() {
  try {
    const response = await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Logout request failed');
    }

    showToast('Logged out successfully');
    currentUser = null;
    
    // Switch views
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('auth-view').classList.remove('hidden');
    
    // Reset login fields
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Utility function to escape inputs
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

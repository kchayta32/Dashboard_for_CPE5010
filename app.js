/* ==========================================
   CPE5010 Submission System - JavaScript
   ========================================== */

// ===== Data Models =====

// กลุ่มทั้งหมด 14 กลุ่ม
const GROUPS_DATA = [
    { id: 1, members: ["แนน", "นก", "เฟรช", "มา", "มี่", "ไอซ์"] },
    { id: 2, members: ["ตัน", "โรบอท", "พี", "ปาร์ม", "ดล"] },
    { id: 3, members: ["ต้า", "เขต", "เนย", "น้ำ", "หญิง", "โอ๊ค"] },
    { id: 4, members: ["ม่อน", "ปลื้ม", "บิ๊ก", "สตางค์"] },
    { id: 5, members: ["ซี", "กิด", "มอส"] },
    { id: 6, members: ["เอฟขนอม", "เน๊ะบางบ่อ", "ทิมนคร", "เกมส์สุราษฎร์", "เพลงสุพรรณ"] },
    { id: 7, members: ["เจ๋งซอยมังกร", "ปั๊บโป๊เตโต้", "แฟ้มลาซาล", "บูมบางแค", "แคร์บางคน", "อลัม"] },
    { id: 8, members: ["เซน", "บอส", "ปอย", "ปาย", "โบ้"] },
    { id: 9, members: ["โอ๊ต", "เต้", "โฟน", "เขต", "อาท", "ฟลุ๊ค"] },
    { id: 10, members: ["มิ้น", "กาญ", "เนย"] },
    { id: 11, members: ["บอส", "โต้", "น้อยหน่า", "จู้", "กี้", "พี่อาม"] },
    { id: 12, members: ["กิจ", "โอม"] }
];

// งานเริ่มต้น
const DEFAULT_ASSIGNMENTS = [
    {
        id: 1,
        name: "สไลด์สำหรับพรีเซ้นแนวคิดการออกแบบเกม (mini-project)",
        maxScore: 100
    }
];

// ข้อมูลการส่งงานเริ่มต้น (กลุ่มที่ส่งแล้ว)
const DEFAULT_SUBMISSIONS = {
    "3-1": { submitted: true, submittedAt: "5 ม.ค. 2569 12:06 PM", score: null },
    "9-1": { submitted: true, submittedAt: "5 ม.ค. 2569 12:07 PM", score: null },
    "7-1": { submitted: true, submittedAt: "5 ม.ค. 2569 12:15 PM", score: null },
    "6-1": { submitted: true, submittedAt: "5 ม.ค. 2569 8:06 PM", score: null },
    "11-1": { submitted: true, submittedAt: "5 ม.ค. 2569 9:20 PM", score: null },
    "2-1": { submitted: true, submittedAt: "5 ม.ค. 2569 9:34 PM", score: null },
    "1-1": { submitted: true, submittedAt: "5 ม.ค. 2569 10:12 PM", score: null }
};

// ===== State Management =====

const STORAGE_KEY = 'cpe5010_data';

let state = {
    groups: [...GROUPS_DATA],
    assignments: [],
    submissions: {},
    currentAssignmentId: 1
};

// ===== LocalStorage Functions =====

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state = {
                groups: parsed.groups || [...GROUPS_DATA],
                assignments: parsed.assignments || [...DEFAULT_ASSIGNMENTS],
                submissions: parsed.submissions || { ...DEFAULT_SUBMISSIONS },
                currentAssignmentId: parsed.currentAssignmentId || 1
            };
        } catch (e) {
            console.error('Error loading state:', e);
            initializeDefaultState();
        }
    } else {
        initializeDefaultState();
    }
}

function initializeDefaultState() {
    state = {
        groups: [...GROUPS_DATA],
        assignments: [...DEFAULT_ASSIGNMENTS],
        submissions: { ...DEFAULT_SUBMISSIONS },
        currentAssignmentId: 1
    };
    saveState();
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        showToast('บันทึกข้อมูลสำเร็จ', 'success');
    } catch (e) {
        console.error('Error saving state:', e);
        showToast('เกิดข้อผิดพลาดในการบันทึก', 'error');
    }
}

// ===== Render Functions =====

function renderAssignmentTabs() {
    const container = document.getElementById('assignmentTabs');
    if (!container) return;

    let html = '';
    state.assignments.forEach(assignment => {
        const isActive = assignment.id === state.currentAssignmentId;
        html += `
            <div class="tab-wrapper">
                <button class="tab ${isActive ? 'active' : ''}" 
                        onclick="selectAssignment(${assignment.id})">
                    งานที่ ${assignment.id}
                </button>
                <div class="tab-actions">
                    <button class="tab-action-btn" onclick="openEditAssignmentModal(${assignment.id})" title="แก้ไขงาน">✏️</button>
                    <button class="tab-action-btn tab-action-delete" onclick="deleteAssignment(${assignment.id})" title="ลบงาน">✕</button>
                </div>
            </div>
        `;
    });
    html += `<button class="tab tab-add" onclick="openModal('assignmentModal')">+ เพิ่มงาน</button>`;

    container.innerHTML = html;
}

function renderCurrentAssignment() {
    const container = document.getElementById('currentAssignment');
    if (!container) return;

    const assignment = state.assignments.find(a => a.id === state.currentAssignmentId);
    if (!assignment) {
        container.innerHTML = '<p>ไม่พบข้อมูลงาน</p>';
        return;
    }

    const stats = getAssignmentStats(assignment.id);

    container.innerHTML = `
        <div class="assignment-title">📝 ${assignment.name}</div>
        <div class="assignment-meta">
            <span>💯 คะแนนเต็ม: ${assignment.maxScore} คะแนน</span>
            <span>✅ ส่งแล้ว: ${stats.submitted}/${state.groups.length} กลุ่ม</span>
            <span>📊 ให้คะแนนแล้ว: ${stats.graded}/${stats.submitted} กลุ่ม</span>
        </div>
    `;
}

function renderGroupsTable() {
    const tbody = document.getElementById('groupsTableBody');
    if (!tbody) return;

    const currentAssignment = state.assignments.find(a => a.id === state.currentAssignmentId);
    if (!currentAssignment) return;

    let html = '';
    state.groups.forEach(group => {
        const submissionKey = `${group.id}-${state.currentAssignmentId}`;
        const submission = state.submissions[submissionKey] || { submitted: false, submittedAt: null, score: null };

        const membersHtml = group.members.map(m => `<span class="member-tag">${m}</span>`).join('');

        const statusHtml = submission.submitted
            ? '<span class="status-badge status-submitted">✅ ส่งแล้ว</span>'
            : '<span class="status-badge status-pending">⏳ ยังไม่ส่ง</span>';

        const dateHtml = submission.submittedAt || '-';

        const scoreDisabled = !submission.submitted;
        const scoreValue = submission.score !== null ? submission.score : '';

        const actionHtml = submission.submitted
            ? `<button class="action-btn btn-edit" onclick="openEditDateModal(${group.id})">✏️ แก้ไข</button>
               <button class="action-btn btn-unsubmit" onclick="unsubmit(${group.id})">❌ ยกเลิก</button>`
            : `<button class="action-btn btn-submit" onclick="openSubmitModal(${group.id})">📤 ส่งงาน</button>`;

        html += `
            <tr>
                <td><div class="group-number">${group.id}</div></td>
                <td><div class="members-list">${membersHtml}</div></td>
                <td>${statusHtml}</td>
                <td class="submit-date">${dateHtml}</td>
                <td>
                    <input type="number" 
                           class="score-input" 
                           value="${scoreValue}" 
                           min="0" 
                           max="${currentAssignment.maxScore}"
                           ${scoreDisabled ? 'disabled' : ''}
                           onchange="updateScore(${group.id}, this.value)"
                           placeholder="-">
                </td>
                <td class="action-btns">${actionHtml}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function renderStats() {
    const stats = getAssignmentStats(state.currentAssignmentId);

    document.getElementById('totalGroups').textContent = state.groups.length;
    document.getElementById('submittedCount').textContent = stats.submitted;
    document.getElementById('pendingCount').textContent = stats.pending;
    document.getElementById('gradedCount').textContent = stats.graded;
}

function getAssignmentStats(assignmentId) {
    let submitted = 0;
    let graded = 0;

    state.groups.forEach(group => {
        const key = `${group.id}-${assignmentId}`;
        const submission = state.submissions[key];
        if (submission && submission.submitted) {
            submitted++;
            if (submission.score !== null) {
                graded++;
            }
        }
    });

    return {
        submitted,
        pending: state.groups.length - submitted,
        graded
    };
}

function render() {
    renderAssignmentTabs();
    renderCurrentAssignment();
    renderGroupsTable();
    renderStats();
}

// ===== Assignment Functions =====

function selectAssignment(id) {
    state.currentAssignmentId = id;
    saveState();
    render();
}

function addAssignment() {
    const nameInput = document.getElementById('newAssignmentName');
    const maxScoreInput = document.getElementById('newAssignmentMaxScore');

    const name = nameInput.value.trim();
    const maxScore = parseInt(maxScoreInput.value) || 100;

    if (!name) {
        showToast('กรุณาระบุชื่องาน', 'error');
        return;
    }

    const newId = state.assignments.length + 1;
    state.assignments.push({
        id: newId,
        name,
        maxScore
    });

    state.currentAssignmentId = newId;
    saveState();
    closeModal('assignmentModal');
    render();

    // Reset form
    nameInput.value = '';
    maxScoreInput.value = '100';

    showToast(`เพิ่มงานที่ ${newId} สำเร็จ`, 'success');
}

// ===== Edit/Delete Assignment Functions =====

let pendingEditAssignmentId = null;

function openEditAssignmentModal(id) {
    pendingEditAssignmentId = id;
    const assignment = state.assignments.find(a => a.id === id);
    if (!assignment) return;

    document.getElementById('editAssignmentName').value = assignment.name;
    document.getElementById('editAssignmentMaxScore').value = assignment.maxScore;

    openModal('editAssignmentModal');
}

function saveEditAssignment() {
    if (!pendingEditAssignmentId) return;

    const assignment = state.assignments.find(a => a.id === pendingEditAssignmentId);
    if (!assignment) return;

    const name = document.getElementById('editAssignmentName').value.trim();
    const maxScore = parseInt(document.getElementById('editAssignmentMaxScore').value) || 100;

    if (!name) {
        showToast('กรุณาระบุชื่องาน', 'error');
        return;
    }

    assignment.name = name;
    assignment.maxScore = maxScore;

    saveState();
    closeModal('editAssignmentModal');
    render();

    showToast(`แก้ไขงานที่ ${pendingEditAssignmentId} สำเร็จ`, 'success');
    pendingEditAssignmentId = null;
}

function deleteAssignment(id) {
    if (state.assignments.length <= 1) {
        showToast('ไม่สามารถลบงานสุดท้ายได้', 'error');
        return;
    }

    const assignment = state.assignments.find(a => a.id === id);
    if (!assignment) return;

    if (!confirm(`ยืนยันการลบ "${assignment.name}"?\nข้อมูลการส่งงานทั้งหมดจะถูกลบด้วย`)) return;

    // Remove assignment
    state.assignments = state.assignments.filter(a => a.id !== id);

    // Remove related submissions
    Object.keys(state.submissions).forEach(key => {
        if (key.endsWith(`-${id}`)) {
            delete state.submissions[key];
        }
    });

    // Switch to another assignment if current was deleted
    if (state.currentAssignmentId === id) {
        state.currentAssignmentId = state.assignments[0].id;
    }

    saveState();
    render();

    showToast(`ลบงานที่ ${id} สำเร็จ`, 'success');
}

// ===== Submission Functions =====

let pendingSubmitGroupId = null;

function openSubmitModal(groupId) {
    pendingSubmitGroupId = groupId;

    const group = state.groups.find(g => g.id === groupId);
    const assignmentId = state.currentAssignmentId;

    document.getElementById('submitModalInfo').textContent =
        `บันทึกการส่งงานที่ ${assignmentId} ของกลุ่ม ${groupId}`;

    // Set default date/time to now
    const now = new Date();
    document.getElementById('submitDate').value = now.toISOString().split('T')[0];
    document.getElementById('submitTime').value = now.toTimeString().slice(0, 5);

    openModal('submitModal');
}

function confirmSubmit() {
    if (!pendingSubmitGroupId) return;

    const dateInput = document.getElementById('submitDate').value;
    const timeInput = document.getElementById('submitTime').value;

    if (!dateInput || !timeInput) {
        showToast('กรุณาระบุวันและเวลา', 'error');
        return;
    }

    const submittedAt = formatThaiDateTime(dateInput, timeInput);
    const key = `${pendingSubmitGroupId}-${state.currentAssignmentId}`;

    state.submissions[key] = {
        submitted: true,
        submittedAt,
        score: null
    };

    saveState();
    closeModal('submitModal');
    render();

    showToast(`กลุ่ม ${pendingSubmitGroupId} ส่งงานสำเร็จ`, 'success');
    pendingSubmitGroupId = null;
}

// ===== Edit Date Functions =====

let pendingEditGroupId = null;

function openEditDateModal(groupId) {
    pendingEditGroupId = groupId;

    const key = `${groupId}-${state.currentAssignmentId}`;
    const submission = state.submissions[key];

    document.getElementById('editModalInfo').textContent =
        `แก้ไขวันเวลาส่งงานที่ ${state.currentAssignmentId} ของกลุ่ม ${groupId}`;
    document.getElementById('currentSubmitDate').textContent =
        `วันเวลาปัจจุบัน: ${submission.submittedAt}`;

    // Set default date/time to now
    const now = new Date();
    document.getElementById('editDate').value = now.toISOString().split('T')[0];
    document.getElementById('editTime').value = now.toTimeString().slice(0, 5);

    openModal('editDateModal');
}

function confirmEditDate() {
    if (!pendingEditGroupId) return;

    const dateInput = document.getElementById('editDate').value;
    const timeInput = document.getElementById('editTime').value;

    if (!dateInput || !timeInput) {
        showToast('กรุณาระบุวันและเวลา', 'error');
        return;
    }

    const submittedAt = formatThaiDateTime(dateInput, timeInput);
    const key = `${pendingEditGroupId}-${state.currentAssignmentId}`;

    if (state.submissions[key]) {
        state.submissions[key].submittedAt = submittedAt;
    }

    saveState();
    closeModal('editDateModal');
    render();

    showToast(`แก้ไขวันเวลาส่งของกลุ่ม ${pendingEditGroupId} สำเร็จ`, 'success');
    pendingEditGroupId = null;
}

function unsubmit(groupId) {
    if (!confirm(`ยืนยันการยกเลิกการส่งงานของกลุ่ม ${groupId}?`)) return;

    const key = `${groupId}-${state.currentAssignmentId}`;
    delete state.submissions[key];

    saveState();
    render();

    showToast(`ยกเลิกการส่งงานของกลุ่ม ${groupId}`, 'success');
}

function updateScore(groupId, value) {
    const key = `${groupId}-${state.currentAssignmentId}`;
    const submission = state.submissions[key];

    if (!submission) return;

    const score = value === '' ? null : parseFloat(value);
    submission.score = score;

    saveState();
    renderStats();
}

function markAllSubmitted() {
    if (!confirm('ยืนยันการทำเครื่องหมายว่าทุกกลุ่มส่งแล้ว?')) return;

    const now = new Date();
    const submittedAt = formatThaiDateTime(
        now.toISOString().split('T')[0],
        now.toTimeString().slice(0, 5)
    );

    state.groups.forEach(group => {
        const key = `${group.id}-${state.currentAssignmentId}`;
        if (!state.submissions[key]) {
            state.submissions[key] = {
                submitted: true,
                submittedAt,
                score: null
            };
        }
    });

    saveState();
    render();

    showToast('ทำเครื่องหมายส่งทุกกลุ่มสำเร็จ', 'success');
}

function clearAllSubmissions() {
    if (!confirm('ยืนยันการล้างข้อมูลการส่งงานทั้งหมดของงานนี้?')) return;

    state.groups.forEach(group => {
        const key = `${group.id}-${state.currentAssignmentId}`;
        delete state.submissions[key];
    });

    saveState();
    render();

    showToast('ล้างข้อมูลการส่งงานสำเร็จ', 'success');
}

// ===== Export Functions =====

function saveData() {
    saveState();
}

function toggleDropdown() {
    const dropdown = document.getElementById('exportDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        const dropdown = document.getElementById('exportDropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
});

function exportJSON() {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `cpe5010_data_${timestamp}.json`;

    downloadFile(blob, filename);
    showToast(`ดาวน์โหลด ${filename} สำเร็จ`, 'success');

    // Close dropdown
    document.getElementById('exportDropdown').classList.remove('show');
}

function exportCSV() {
    const assignment = state.assignments.find(a => a.id === state.currentAssignmentId);
    if (!assignment) {
        showToast('กรุณาเลือกงานก่อน', 'error');
        return;
    }

    // CSV Header
    let csv = '\ufeff'; // BOM for Thai encoding
    csv += 'กลุ่ม,สมาชิก,สถานะ,วันเวลาที่ส่ง,คะแนน\n';

    // CSV Data
    state.groups.forEach(group => {
        const key = `${group.id}-${state.currentAssignmentId}`;
        const submission = state.submissions[key] || { submitted: false, submittedAt: null, score: null };

        const members = group.members.join(' | ');
        const status = submission.submitted ? 'ส่งแล้ว' : 'ยังไม่ส่ง';
        const date = submission.submittedAt || '-';
        const score = submission.score !== null ? submission.score : '-';

        // Escape fields with commas or quotes
        const escapeCsv = (field) => {
            const str = String(field);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        csv += `${group.id},${escapeCsv(members)},${status},${escapeCsv(date)},${score}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `cpe5010_งานที่${state.currentAssignmentId}_${timestamp}.csv`;

    downloadFile(blob, filename);
    showToast(`ดาวน์โหลด ${filename} สำเร็จ`, 'success');

    // Close dropdown
    document.getElementById('exportDropdown').classList.remove('show');
}

function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== Utility Functions =====

function formatThaiDateTime(dateStr, timeStr) {
    const [year, month, day] = dateStr.split('-');
    const thaiYear = parseInt(year) + 543;

    const months = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const monthIndex = parseInt(month) - 1;
    const thaiMonth = months[monthIndex];

    const [hours, minutes] = timeStr.split(':');
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    return `${parseInt(day)} ${thaiMonth} ${thaiYear} ${hour}:${minutes} ${ampm}`;
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-message').textContent = message;
    toast.className = 'toast show ' + type;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Initialization =====

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    render();

    console.log('CPE5010 Submission System initialized');
    console.log('Groups:', state.groups.length);
    console.log('Assignments:', state.assignments.length);
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Auto-save on visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        saveState();
    }
});

/**
 * BrandingForYou AI Tool Hub - Common JS
 * Shared logic for localStorage, clipboard, and tool synergy.
 */

const BFY_STORAGE_KEY = 'bfy_shared_profile';

// --- Shared Brand Profile Logic ---

// Save brand profile to localStorage
function saveBrandProfile(data) {
  const current = getBrandProfile();
  const updated = { ...current, ...data };
  localStorage.setItem(BFY_STORAGE_KEY, JSON.stringify(updated));
}

// Load brand profile
function getBrandProfile() {
  const saved = localStorage.getItem(BFY_STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
}

// Auto-fill form fields from profile
function autoFillProfile(formId) {
  const profile = getBrandProfile();
  const form = document.getElementById(formId);
  if (!form) return;

  Object.keys(profile).forEach(key => {
    const el = form.querySelector(`[name="${key}"]`) || document.getElementById(key);
    if (el) {
      if (el.type === 'checkbox') {
        el.checked = profile[key];
      } else {
        el.value = profile[key];
      }
    }
  });

  // Also listen for changes to update profile
  form.addEventListener('input', (e) => {
    const { name, value, type, checked, id } = e.target;
    const fieldName = name || id;
    if (fieldName) {
      const data = {};
      data[fieldName] = type === 'checkbox' ? checked : value;
      saveBrandProfile(data);
    }
    
    // Remove error styling on input
    e.target.classList.remove('input-error');
  });
}

// Reset brand profile
function resetBrandProfile() {
  if (confirm('저장된 클라이언트 프로필(자동완성) 데이터를 모두 삭제하고 초기화하시겠습니까?')) {
    localStorage.removeItem(BFY_STORAGE_KEY);
    const form = document.getElementById('tool-form');
    if (form) form.reset();
    
    // Reset inputs not in form but in step-bodies
    document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(el => el.value = '');
    
    // Reset chip selections to active default (usually first one)
    document.querySelectorAll('.chip-group').forEach(group => {
      const chips = group.querySelectorAll('.chip-btn');
      chips.forEach(c => c.classList.remove('active'));
      if (chips.length > 0) chips[0].classList.add('active');
      
      const hiddenInput = group.querySelector('input[type="hidden"]');
      if (hiddenInput) {
        hiddenInput.value = chips.length > 0 ? chips[0].getAttribute('data-value') : '';
      }
    });
    
    alert('프로필 데이터가 초기화되었습니다. 새로운 작업을 시작하세요!');
  }
}

// --- Clipboard Utilities ---

async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ 복사 완료';
    btn.classList.add('btn-success');
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('btn-success');
    }, 2000);
  } catch (err) {
    console.error('Failed to copy: ', err);
    alert('복사에 실패했습니다.');
  }
}

function openInClaude(prompt) {
  navigator.clipboard.writeText(prompt).then(() => {
    window.open('https://claude.ai/new', '_blank');
  });
}

function openInChatGPT(prompt) {
  navigator.clipboard.writeText(prompt).then(() => {
    window.open('https://chatgpt.com/', '_blank');
  });
}

// Form Validation UI Helper
function validateForm(requiredElementIds) {
  let isValid = true;
  requiredElementIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) {
      el.classList.add('input-error');
      isValid = false;
    }
  });
  
  if (!isValid) {
    // Find first error and expand its accordion if necessary
    const firstError = document.querySelector('.input-error');
    if (firstError) {
      const section = firstError.closest('.step-section');
      if (section && !section.classList.contains('active')) {
        section.classList.add('active');
      }
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  return isValid;
}

// --- UI Helpers ---

function setupAccordions() {
  document.querySelectorAll('.step-section').forEach(section => {
    const header = section.querySelector('.step-header');
    if (!header) return;
    
    // 토글 아이콘이 없으면 추가
    if (!header.querySelector('.toggle-icon')) {
      const icon = document.createElement('span');
      icon.className = 'toggle-icon';
      icon.textContent = '▼';
      header.appendChild(icon);
    }
    
    // 기본적으로 첫 번째 섹션만 열어둠
    if (section.previousElementSibling && section.previousElementSibling.classList.contains('step-section')) {
      section.classList.remove('active');
    } else {
      section.classList.add('active');
    }

    header.addEventListener('click', () => {
      section.classList.toggle('active');
    });
  });
}

function setupChipSelection() {
  document.querySelectorAll('.chip-group').forEach(group => {
    // 칩 그룹 내에 숨겨진 input이 없으면 생성
    let hiddenInput = group.querySelector('input[type="hidden"]');
    if (!hiddenInput) {
      hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.id = group.getAttribute('data-id') || 'chip_' + Math.random().toString(36).substr(2, 9);
      group.appendChild(hiddenInput);
    }
    
    const isMulti = group.hasAttribute('data-multi');
    const chips = group.querySelectorAll('.chip-btn');
    
    // 선택된 칩의 값을 hidden input에 업데이트
    const updateHiddenValue = () => {
      const activeValues = Array.from(group.querySelectorAll('.chip-btn.active')).map(btn => btn.getAttribute('data-value'));
      hiddenInput.value = isMulti ? activeValues.join(', ') : (activeValues[0] || '');
      hiddenInput.dispatchEvent(new Event('input', { bubbles: true })); // 이벤트 트리거 (프로필 자동 저장용)
    };

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        if (!isMulti) {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        } else {
          chip.classList.toggle('active');
        }
        updateHiddenValue();
      });
    });
    
    updateHiddenValue(); // 초기화
  });
}

function showResult(promptText) {
  const resultArea = document.getElementById('result-area');
  const resultBox = document.getElementById('result-box');
  if (resultArea && resultBox) {
    resultBox.textContent = promptText;
    resultArea.style.display = 'block';
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function toggleSection(sectionId) {
  const body = document.getElementById(sectionId);
  const icon = document.querySelector(`[data-toggle="${sectionId}"]`);
  if (body) {
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? 'block' : 'none';
    if (icon) icon.textContent = isHidden ? '▲' : '▼';
  }
}

// Floating Help Modal Setup
function setupHelpModal() {
  // Inject FAB if not exists
  if (!document.getElementById('bfy-fab-help')) {
    const fab = document.createElement('div');
    fab.id = 'bfy-fab-help';
    fab.className = 'fab-help';
    fab.innerHTML = '❓';
    fab.title = '사용 가이드 보기';
    document.body.appendChild(fab);

    const modal = document.createElement('div');
    modal.id = 'bfy-help-modal';
    modal.className = 'help-modal';
    modal.innerHTML = `
      <div class="help-modal-content">
        <button class="modal-close" onclick="document.getElementById('bfy-help-modal').classList.remove('show')">×</button>
        <h2 style="margin-bottom: 20px; color: var(--bfy-navy); display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 28px;">💡</span> 브랜딩포유 AI 도구 가이드
        </h2>
        
        <div style="background: var(--bfy-bg); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h4 style="color: var(--bfy-primary); margin-bottom: 12px;">✅ 이것만 기억하세요!</h4>
          <ol style="padding-left: 20px; color: var(--bfy-text); line-height: 1.8; font-size: 15px;">
            <li><strong style="color:var(--bfy-navy)">빈칸 채우기:</strong> 주어진 스텝에 맞춰 브랜드 정보와 상황을 편하게 입력합니다. (자동저장 지원)</li>
            <li><strong style="color:var(--bfy-navy)">버튼 클릭:</strong> <span style="background:var(--bfy-primary); color:white; padding:2px 6px; border-radius:4px; font-size:12px;">프롬프트 생성하기</span>를 누르면 전문가 수준의 명령어가 탄생합니다.</li>
            <li><strong style="color:var(--bfy-navy)">AI에 붙여넣기:</strong> 생성된 결과창에서 ChatGPT 또는 Claude 버튼을 눌러 새 창을 띄우고, <b>붙여넣기(Ctrl+V)</b>만 하시면 끝!</li>
          </ol>
        </div>
        
        <p style="font-size: 14px; color: var(--bfy-text-light); text-align: center; margin-bottom: 16px;">
          ⚠️ 다른 클라이언트/브랜드 작업을 새로 시작하려면?<br>
          우측 상단의 <strong style="color: var(--bfy-danger);">🔄 데이터 초기화</strong> 버튼을 눌러주세요.
        </p>
        
        <button class="btn-generate" onclick="document.getElementById('bfy-help-modal').classList.remove('show')">확인했습니다</button>
      </div>
    `;
    document.body.appendChild(modal);

    fab.addEventListener('click', () => {
      modal.classList.add('show');
    });

    // 닫기 클릭 (바깥 영역)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('show');
    });
  }
}

// --- Tool Synergy ---

// Helper to get URL parameters
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Initialize common features
document.addEventListener('DOMContentLoaded', () => {
  setupAccordions();
  setupChipSelection();
  autoFillProfile('tool-form');
  setupHelpModal();
});

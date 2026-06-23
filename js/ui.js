/**
 * UI Manager
 * Handles all UI updates and screen management
 */

class UIManager {
    constructor() {
        this.alertVisible = false;
        this.activeScreen = 'main-menu';
    }

    updateTime(timeString) {
        const timeDisplay = document.getElementById('current-time');
        if (timeDisplay) {
            timeDisplay.textContent = timeString;
        }
    }

    updateNightInfo(nightNumber) {
        const nightInfo = document.getElementById('night-info');
        if (nightInfo) {
            nightInfo.textContent = `NIGHT ${nightNumber}/6`;
        }
    }

    updatePowerStatus(percentage) {
        const powerBar = document.getElementById('power-bar');
        const powerPercent = document.getElementById('power-percent');
        
        if (powerBar) {
            powerBar.style.width = percentage + '%';
            
            // Change color based on level
            if (percentage > 50) {
                powerBar.style.background = 'linear-gradient(90deg, #0f0, #ff0)';
                powerBar.classList.remove('critical');
            } else if (percentage > 20) {
                powerBar.style.background = 'linear-gradient(90deg, #ff0, #f00)';
                powerBar.classList.remove('critical');
            } else {
                powerBar.style.background = '#f00';
                powerBar.classList.add('critical');
            }
        }

        if (powerPercent) {
            powerPercent.textContent = percentage + '%';
        }

        // Update power usage breakdown
        if (window.game && window.game.powerSystem) {
            const usage = window.game.powerSystem.getPowerUsageBreakdown();
            const doorUsage = document.getElementById('door-usage');
            const lightUsage = document.getElementById('light-usage');
            const camUsage = document.getElementById('cam-usage');

            if (doorUsage) doorUsage.textContent = Math.floor(usage.doors * 10) + '%';
            if (lightUsage) lightUsage.textContent = Math.floor(usage.lights * 10) + '%';
            if (camUsage) camUsage.textContent = Math.floor(usage.cameras * 10) + '%';
        }
    }

    updateDoorStatus() {
        if (!window.game || !window.game.powerSystem) return;

        const ps = window.game.powerSystem;
        const leftBtn = document.getElementById('left-door-btn');
        const rightBtn = document.getElementById('right-door-btn');

        if (leftBtn) {
            leftBtn.textContent = ps.leftDoorClosed ? 'CLOSED' : 'OPEN';
            leftBtn.classList.toggle('open', !ps.leftDoorClosed);
        }

        if (rightBtn) {
            rightBtn.textContent = ps.rightDoorClosed ? 'CLOSED' : 'OPEN';
            rightBtn.classList.toggle('open', !ps.rightDoorClosed);
        }
    }

    updateAnimatronicStatus(status) {
        const statusList = document.getElementById('status-list');
        if (!statusList) return;

        statusList.innerHTML = '';

        for (const [key, animStatus] of Object.entries(status)) {
            if (animStatus.aiLevel > 0) {
                const item = document.createElement('div');
                item.className = 'status-item' + (animStatus.threat ? ' active' : '');

                item.innerHTML = `
                    <div class="animatronic-name">${animStatus.name}</div>
                    <div class="status-detail">
                        <span>AI: ${animStatus.aiLevel}</span>
                        <span>${animStatus.threat ? '⚠ THREAT' : 'Safe'}</span>
                    </div>
                    <div class="status-detail">
                        <span>${animStatus.location}</span>
                    </div>
                `;

                statusList.appendChild(item);
            }
        }
    }

    showHallwayView(side, animatronic) {
        const canvas = document.getElementById('hallwayCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0f0';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(`${side} HALLWAY`, canvas.width / 2, 20);

        if (animatronic) {
            ctx.fillStyle = '#f00';
            ctx.fillText('⚠ THREAT DETECTED', canvas.width / 2, 50);
        } else {
            ctx.fillStyle = '#0f0';
            ctx.fillText('All Clear', canvas.width / 2, 50);
        }
    }

    showAlert(title, message) {
        const alertBox = document.getElementById('alert-box');
        if (!alertBox) return;

        document.getElementById('alert-title').textContent = title;
        document.getElementById('alert-message').textContent = message;

        this.showScreen('alert-box');
        this.alertVisible = true;
    }

    hideAlert() {
        this.hideScreen('alert-box');
        this.alertVisible = false;
    }

    showGameOver(nightNumber, timeString) {
        document.getElementById('go-night').textContent = nightNumber;
        document.getElementById('go-time').textContent = timeString;
        this.showScreen('game-over-screen');
    }

    showNightComplete(nightNumber, pay, bonus) {
        document.getElementById('nc-night').textContent = nightNumber;
        document.getElementById('nc-pay').textContent = pay;
        document.getElementById('nc-bonus').textContent = bonus;
        this.showScreen('night-complete-screen');
    }

    showScreen(screenId) {
        const screen = document.getElementById(screenId);
        if (screen) {
            if (screenId === 'alert-box') {
                screen.classList.remove('alert-hidden');
            } else {
                screen.classList.remove('screen-hidden');
                screen.classList.add('screen-shown');
            }
            this.activeScreen = screenId;
        }
    }

    hideScreen(screenId) {
        const screen = document.getElementById(screenId);
        if (screen) {
            if (screenId === 'alert-box') {
                screen.classList.add('alert-hidden');
            } else {
                screen.classList.add('screen-hidden');
                screen.classList.remove('screen-shown');
            }
        }
    }

    updateCameraDisplay() {
        if (!window.game || !window.game.cameraSystem) return;

        const camera = window.game.cameraSystem.getActiveCamera();
        const status = window.game.cameraSystem.getStatus();

        document.getElementById('camera-name').textContent = camera.name;
        document.getElementById('camera-num').textContent = `CAM ${String(status.currentCamera).padStart(2, '0')}`;

        // Render camera feed
        window.game.cameraSystem.render();
    }

    showGameOverScreen() {
        this.showScreen('game-over-screen');
    }

    showNightCompleteScreen() {
        this.showScreen('night-complete-screen');
    }
}

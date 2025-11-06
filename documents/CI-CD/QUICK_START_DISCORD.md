# ⚡ Discord Notification - Quick Start (5 phút)

## 🚀 3 Bước Đơn Giản:

### **1️⃣ Tạo Discord Webhook** (2 phút)

```
Discord → Server Settings → Integrations → Webhooks → New Webhook
```

1. Name: `GitHub CI/CD Bot`
2. Channel: Chọn channel (vd: `#github-notifications`)
3. **Copy Webhook URL** → Save Changes

**URL có dạng:**
```
https://discord.com/api/webhooks/1234567890/AbCdEfGhIj...
```

---

### **2️⃣ Add vào GitHub** (1 phút)

```
GitHub Repo → Settings → Secrets → Actions → New secret
```

- **Name:** `DISCORD_WEBHOOK_URL`
- **Value:** Paste webhook URL từ Discord
- Click "Add secret"

---

### **3️⃣ Update Workflow** (2 phút)

**File:** `.github/workflows/test.yml`

**Tìm dòng 281-303** (phần `Send Messenger Notification`)

**Thay bằng code trong file:** `documents/CI-CD/discord-notification-code.yml`

**Hoặc copy code này:**

```yaml
- name: Send Discord Notification
  if: always()
  continue-on-error: true
  run: |
    if [[ -z "${{ secrets.DISCORD_WEBHOOK_URL }}" ]]; then
      echo "⚠️ Discord webhook not configured"
      exit 0
    fi
    
    # Color based on results
    if [[ "${{ steps.summary.outputs.success_count }}" == "4" ]]; then
      COLOR="5763719"  # Green
    elif [[ "${{ steps.summary.outputs.success_count }}" -ge "2" ]]; then
      COLOR="16776960"  # Yellow
    else
      COLOR="15548997"  # Red
    fi
    
    # Get test statuses
    SONAR="$( [[ "${{ needs.sonarcloud.result }}" == "success" || "${{ needs.sonarcloud.result }}" == "skipped" ]] && echo "✅" || echo "❌" )"
    SNYK="$( [[ "${{ needs.snyk-security.result }}" == "success" ]] && echo "✅" || echo "❌" )"
    TRIVY="$( [[ "${{ needs.trivy-security.result }}" == "success" ]] && echo "✅" || echo "❌" )"
    PLAYWRIGHT="$( [[ "${{ needs.playwright-tests.result }}" == "success" ]] && echo "✅" || echo "❌" )"
    
    # Send to Discord
    curl -H "Content-Type: application/json" \
      -X POST "${{ secrets.DISCORD_WEBHOOK_URL }}" \
      -d '{
        "username": "GitHub CI/CD Bot",
        "embeds": [{
          "title": "'"${{ steps.summary.outputs.status_emoji }} Test Pipeline"'",
          "description": "**'"${{ steps.summary.outputs.overall_status }}"'**",
          "color": '"$COLOR"',
          "fields": [
            {"name":"SonarCloud","value":"'"${SONAR}"'","inline":true},
            {"name":"Snyk","value":"'"${SNYK}"'","inline":true},
            {"name":"Trivy","value":"'"${TRIVY}"'","inline":true},
            {"name":"Playwright","value":"'"${PLAYWRIGHT}"'","inline":true},
            {"name":"Rate","value":"'"${{ steps.summary.outputs.success_count }}/4"'","inline":false},
            {"name":"Link","value":"[View](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})","inline":false}
          ],
          "timestamp": "'"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)"'"
        }]
      }'
```

**Save & Push:**
```bash
git add .github/workflows/test.yml
git commit -m "feat: add Discord notifications"
git push
```

---

## ✅ Test Ngay!

**Option 1:** Push empty commit
```bash
git commit --allow-empty -m "test: Discord notification"
git push
```

**Option 2:** Trigger manual
```
GitHub → Actions → "Quality & Security Tests" → Run workflow
```

**Đợi vài phút** → Check Discord channel!

---

## 🎨 Kết Quả

Bạn sẽ thấy message đẹp như này:

```
🤖 GitHub CI/CD Bot

🎉 Test Pipeline
━━━━━━━━━━━━━━━━━━━━━━━━
🎉 ALL TESTS PASSED

SonarCloud     ✅
Snyk          ✅
Trivy         ✅
Playwright    ✅

Rate: 4/4
Link: [View]
```

---

## ❓ Không Hoạt Động?

### Check 3 điều này:

1. **Secret name đúng chưa?** 
   - PHẢI là: `DISCORD_WEBHOOK_URL`
   - Không thêm space hoặc ký tự khác

2. **Webhook URL đúng format?**
   ```
   https://discord.com/api/webhooks/[ID]/[TOKEN]
   ```

3. **Workflow syntax đúng chưa?**
   - Check YAML indentation
   - View GitHub Actions logs

### Test webhook trực tiếp:
```bash
curl -H "Content-Type: application/json" \
  -X POST "YOUR_WEBHOOK_URL" \
  -d '{"content":"Test message!"}'
```

Nếu nhận được message → Webhook OK!

---

## 📚 Chi Tiết Hơn?

Xem full guide: `documents/CI-CD/DISCORD_NOTIFICATION_SETUP.md`

---

## ✨ Done!

Giờ mỗi lần test chạy xong, bạn sẽ nhận notification tự động trong Discord! 🎉


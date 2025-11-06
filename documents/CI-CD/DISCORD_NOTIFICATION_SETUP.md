# 🎮 Discord Notification Setup - Step by Step Guide

**Date:** November 6, 2025  
**Difficulty:** ⭐ Very Easy (5 minutes)  
**Cost:** 🆓 Free

---

## 🎯 What You'll Get

GitHub Actions will automatically send test results to your Discord channel:

![Example](https://i.imgur.com/example.png)
```
🎉 Test Pipeline Completed

📊 Overall Status: 🎉 ALL TESTS PASSED
✅ Success Rate: 4/4 test suites

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Detailed Results:
1️⃣ SonarCloud: ✅ PASSED
2️⃣ Snyk Security: ✅ PASSED
3️⃣ Trivy Security: ✅ PASSED
4️⃣ Playwright E2E: ✅ PASSED

🔗 View Details: https://github.com/.../runs/123
🕐 Time: 2025-11-06 10:30:00 UTC
```

---

## 📋 Step-by-Step Instructions

### **STEP 1: Create Discord Webhook** (2 minutes)

#### 1.1 Open your Discord server
- Mở Discord app hoặc truy cập https://discord.com
- Chọn server bạn muốn nhận thông báo

#### 1.2 Vào Server Settings
- Click vào tên server (góc trên bên trái)
- Chọn **"Server Settings"** (Cài đặt máy chủ)

![Discord Server Settings](https://support.discord.com/hc/article_attachments/360060485072/server_settings.png)

#### 1.3 Tạo Webhook
1. Trong menu bên trái, chọn **"Integrations"** (Tích hợp)
2. Click **"Webhooks"** → **"New Webhook"** (Webhook mới)

![Create Webhook](https://support.discord.com/hc/article_attachments/360060504012/new_webhook.png)

#### 1.4 Cấu hình Webhook
1. **Name:** `GitHub CI/CD Bot` (hoặc tên bạn thích)
2. **Channel:** Chọn channel nhận thông báo (vd: `#github-notifications`)
3. **Avatar:** (Optional) Upload ảnh cho bot

![Configure Webhook](https://support.discord.com/hc/article_attachments/360060485332/webhook_settings.png)

#### 1.5 Copy Webhook URL
1. Click **"Copy Webhook URL"** (Sao chép URL webhook)
2. URL sẽ có dạng:
   ```
   https://discord.com/api/webhooks/1234567890123456789/AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
   ```
3. **LƯU LẠI URL NÀY** - bạn sẽ cần nó ở bước tiếp theo!

4. Click **"Save Changes"** (Lưu thay đổi)

---

### **STEP 2: Add Webhook to GitHub Secrets** (1 minute)

#### 2.1 Mở GitHub Repository
- Truy cập: https://github.com/YOUR_USERNAME/web_project
- Hoặc repo bạn đang dùng

#### 2.2 Vào Settings
1. Click tab **"Settings"** (góc trên bên phải)
2. Trong menu bên trái, chọn **"Secrets and variables"** → **"Actions"**

![GitHub Secrets](https://docs.github.com/assets/cb-45016/mw-1440/images/help/actions/actions-secrets-and-variables.webp)

#### 2.3 Tạo Secret mới
1. Click nút **"New repository secret"**

![New Secret](https://docs.github.com/assets/cb-36793/mw-1440/images/help/actions/new-repository-secret.webp)

#### 2.4 Nhập thông tin
1. **Name:** `DISCORD_WEBHOOK_URL` (PHẢI ĐÚNG TÊN NÀY!)
2. **Secret:** Paste webhook URL từ Discord (bước 1.5)
   ```
   https://discord.com/api/webhooks/1234567890123456789/AbCd...
   ```
3. Click **"Add secret"**

✅ **Xong! Secret đã được thêm.**

---

### **STEP 3: Update GitHub Workflow** (2 minutes)

#### 3.1 Mở file workflow
Đường dẫn: `.github/workflows/test.yml`

#### 3.2 Thay thế Messenger notification step
Tìm phần này (dòng 281-303):

```yaml
- name: Send Messenger Notification
  if: always()
  continue-on-error: true
  run: |
    # Check if Messenger webhook is configured
    if [[ -z "${{ secrets.MESSENGER_WEBHOOK_URL }}" ]]; then
      echo "⚠️ Messenger webhook not configured. Skipping notification."
      echo "To enable: Add MESSENGER_WEBHOOK_URL to GitHub Secrets"
      exit 0
    fi
    
    # ... rest of messenger code
```

**Thay bằng code này:**

```yaml
- name: Send Discord Notification
  if: always()
  continue-on-error: true
  run: |
    # Check if Discord webhook is configured
    if [[ -z "${{ secrets.DISCORD_WEBHOOK_URL }}" ]]; then
      echo "⚠️ Discord webhook not configured. Skipping notification."
      echo "To enable: Add DISCORD_WEBHOOK_URL to GitHub Secrets"
      exit 0
    fi
    
    # Prepare Discord embed message
    if [[ "${{ steps.summary.outputs.success_count }}" == "4" ]]; then
      COLOR="5763719"  # Green
    elif [[ "${{ steps.summary.outputs.success_count }}" -ge "2" ]]; then
      COLOR="16776960"  # Yellow
    else
      COLOR="15548997"  # Red
    fi
    
    # Build detailed fields
    FIELDS='[
      {"name":"SonarCloud Analysis","value":"'"$( [[ "${{ needs.sonarcloud.result }}" == "success" || "${{ needs.sonarcloud.result }}" == "skipped" ]] && echo "✅ PASSED" || echo "❌ FAILED" )"'","inline":true},
      {"name":"Snyk Security","value":"'"$( [[ "${{ needs.snyk-security.result }}" == "success" ]] && echo "✅ PASSED" || echo "❌ FAILED" )"'","inline":true},
      {"name":"Trivy Security","value":"'"$( [[ "${{ needs.trivy-security.result }}" == "success" ]] && echo "✅ PASSED" || echo "❌ FAILED" )"'","inline":true},
      {"name":"Playwright E2E","value":"'"$( [[ "${{ needs.playwright-tests.result }}" == "success" ]] && echo "✅ PASSED" || echo "❌ FAILED" )"'","inline":true},
      {"name":"Success Rate","value":"'"${{ steps.summary.outputs.success_count }}/4 test suites"'","inline":false},
      {"name":"Branch","value":"'"${{ github.ref_name }}"'","inline":true},
      {"name":"Triggered by","value":"'"${{ github.actor }}"'","inline":true},
      {"name":"View Details","value":"[Click here](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})","inline":false}
    ]'
    
    # Send to Discord
    curl -H "Content-Type: application/json" \
      -X POST "${{ secrets.DISCORD_WEBHOOK_URL }}" \
      -d '{
        "username": "GitHub CI/CD Bot",
        "avatar_url": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        "embeds": [{
          "title": "'"${{ steps.summary.outputs.status_emoji }} Test Pipeline Completed"'",
          "description": "**'"${{ steps.summary.outputs.overall_status }}"'**",
          "color": '"$COLOR"',
          "fields": '"$FIELDS"',
          "timestamp": "'"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)"'",
          "footer": {
            "text": "GitHub Actions",
            "icon_url": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          }
        }]
      }' \
      || echo "Failed to send Discord notification"
```

#### 3.3 Save file
```bash
git add .github/workflows/test.yml
git commit -m "feat: add Discord notification for test results"
git push
```

---

### **STEP 4: Test the Notification** (1 minute)

#### Option 1: Trigger manually
1. Vào GitHub Actions: https://github.com/YOUR_REPO/actions
2. Chọn workflow **"Quality & Security Tests"**
3. Click **"Run workflow"** → **"Run workflow"**

![Run Workflow](https://docs.github.com/assets/cb-58864/mw-1440/images/help/actions/workflow-dispatch-button.webp)

#### Option 2: Push commit
```bash
git commit --allow-empty -m "test: trigger Discord notification"
git push
```

#### 4.3 Check Discord
- Mở Discord channel bạn đã chọn
- Sau vài phút, bạn sẽ thấy message từ bot!

---

## 🎨 Expected Result

Bạn sẽ nhận được message như này trong Discord:

```
🤖 GitHub CI/CD Bot

🎉 Test Pipeline Completed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 ALL TESTS PASSED

📊 SonarCloud Analysis     ✅ PASSED
📊 Snyk Security           ✅ PASSED  
📊 Trivy Security          ✅ PASSED
📊 Playwright E2E          ✅ PASSED

✅ Success Rate: 4/4 test suites
🌿 Branch: master
👤 Triggered by: your-username
🔗 View Details: [Click here]

🕐 2025-11-06 10:30:00 UTC
```

Với màu sắc:
- 🟢 **Green** = All tests passed
- 🟡 **Yellow** = Some tests failed
- 🔴 **Red** = Multiple failures

---

## ❓ Troubleshooting

### ❌ "Discord webhook not configured"
**Nguyên nhân:** Secret chưa được thêm hoặc tên sai

**Giải pháp:**
1. Kiểm tra tên secret: PHẢI là `DISCORD_WEBHOOK_URL` (không thêm/bớt ký tự)
2. Vào GitHub Settings → Secrets → Actions
3. Xóa secret cũ nếu có
4. Tạo lại với tên chính xác

### ❌ "Failed to send Discord notification"
**Nguyên nhân:** Webhook URL không hợp lệ

**Giải pháp:**
1. Quay lại Discord → Server Settings → Integrations → Webhooks
2. Copy lại Webhook URL
3. Update secret trong GitHub

### ❌ Không nhận được message
**Nguyên nhân:** 
- Workflow chưa chạy xong
- Bot không có quyền gửi message vào channel

**Giải pháp:**
1. Check GitHub Actions logs: https://github.com/YOUR_REPO/actions
2. Tìm job **"test-summary"**
3. Xem log của step **"Send Discord Notification"**
4. Kiểm tra channel permissions trong Discord

### 🧪 Test Webhook trực tiếp
Mở terminal và chạy:

```bash
curl -H "Content-Type: application/json" \
  -X POST "YOUR_WEBHOOK_URL" \
  -d '{
    "username": "Test Bot",
    "content": "This is a test message from curl!"
  }'
```

Nếu không nhận được message → Webhook URL sai hoặc webhook đã bị xóa.

---

## 🎨 Customize Message (Optional)

### Change Bot Name
```yaml
"username": "Your Custom Bot Name"
```

### Change Bot Avatar
```yaml
"avatar_url": "https://your-image-url.com/avatar.png"
```

### Change Embed Color
```yaml
COLOR="5763719"   # Green (#57F287)
COLOR="16776960"  # Yellow (#FFFF00)
COLOR="15548997"  # Red (#ED4245)
COLOR="3447003"   # Blue (#3498DB)
COLOR="10181046"  # Purple (#9B59B6)
```

### Add More Fields
```yaml
{"name":"Custom Field","value":"Custom Value","inline":true}
```

---

## 🔒 Security Tips

1. ✅ **NEVER share your Webhook URL publicly**
2. ✅ Keep webhook URL in GitHub Secrets only
3. ✅ Don't commit webhook URL to git
4. ✅ Regenerate webhook if accidentally exposed:
   - Discord → Server Settings → Integrations
   - Click webhook → Delete → Create new

---

## 📊 Comparison with Other Methods

| Method | Setup Time | Difficulty | Features |
|--------|-----------|-----------|----------|
| **Discord** | 5 min | ⭐ Easy | Rich embeds, colors, inline fields |
| Telegram | 5 min | ⭐ Easy | Simple text, markdown |
| Messenger | 30 min | ⭐⭐⭐ Hard | Requires Facebook App, webhook server |
| Slack | 5 min | ⭐ Easy | Similar to Discord |

**→ Discord is the BEST choice for quick setup with beautiful messages!**

---

## ✅ Summary Checklist

- [ ] Created Discord Webhook
- [ ] Copied Webhook URL
- [ ] Added `DISCORD_WEBHOOK_URL` to GitHub Secrets
- [ ] Updated `.github/workflows/test.yml`
- [ ] Committed and pushed changes
- [ ] Triggered workflow to test
- [ ] Received notification in Discord

**If all checked → You're done! 🎉**

---

## 🆘 Need Help?

**Common Issues:**
1. Secret name must be EXACTLY: `DISCORD_WEBHOOK_URL`
2. Don't add quotes around webhook URL in GitHub Secret
3. Make sure workflow file syntax is correct (no YAML errors)

**Still stuck?**
- Check GitHub Actions logs
- Test webhook URL directly with curl
- Verify Discord permissions
- Make sure webhook wasn't deleted in Discord

**Working?**
- You'll see "✅ Notification sent" in GitHub Actions logs
- Message appears in Discord within seconds
- Check Discord notification settings if you don't see it

---

## 🎯 Next Steps

Once notifications are working:
1. ✅ Test different scenarios (pass/fail)
2. ✅ Customize message format
3. ✅ Add @mentions for urgent failures (optional)
4. ✅ Create separate channels for different workflows

**Enjoy your automated Discord notifications! 🎉**


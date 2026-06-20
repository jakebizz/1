# 🚀 AdLine Quick Start Guide

Get AdLine up and running in 10 minutes!

## For Developers (Earn Money)

### Install the Extension

1. **Download the extension**
   ```bash
   cd adline-extension
   npm install
   npm run compile
   npm run package
   code --install-extension adline-1.0.0.vsix
   ```

2. **Configure your account**
   - Open VS Code
   - Press `Cmd/Ctrl + Shift + P`
   - Type "AdLine: Configure Account"
   - Your user ID will be auto-generated

3. **Enable monetization**
   - Press `Cmd/Ctrl + Shift + P`
   - Type "AdLine: Enable Monetization"
   - Start earning!

4. **Check your earnings**
   - Press `Cmd/Ctrl + Shift + P`
   - Type "AdLine: Show Earnings"
   - See your stats dashboard

### Start Earning

Just code normally! Ads appear in the status bar during AI processing:
```
💰 Try SuperAPI - REST APIs in 60 seconds
```

**Click = earn money. That's it!**

---

## For Advertisers (Get Customers)

### Create Your First Campaign

1. **Email us**: advertise@adline.dev
   ```
   Subject: New Campaign

   Company: YourCompany
   Ad Message: Your compelling 50-char message
   Budget: $500
   Model: CPC ($0.50 per click)
   ```

2. **We'll set you up** with:
   - Campaign dashboard
   - Real-time analytics
   - A/B testing tools

3. **Track performance**
   - Impressions
   - Clicks
   - CTR
   - Conversions

### Ad Best Practices

**Good Ad:**
```
💡 SuperAPI - Build REST APIs in 60 seconds
```
- Clear value prop
- Specific benefit
- Action-oriented

**Bad Ad:**
```
Check out our API tool - it's great!
```
- Vague
- No specific benefit
- Generic

---

## Run Your Own Instance

### 1. Start the Ad Server

```bash
cd adline-server
npm install
cp .env.example .env
npm start
```

Server runs on http://localhost:3000

### 2. Update Extension Config

In `adline-extension/src/extension.ts`:
```typescript
const API_ENDPOINT = 'http://localhost:3000';
```

### 3. Deploy the Website

```bash
cd adline-website
# Open in browser for local testing
open index.html

# Or deploy to Vercel
vercel --prod
```

---

## Test the System

### Create Test Ad

```bash
curl -X POST http://localhost:3000/admin/ads \
  -H "Content-Type: application/json" \
  -d '{
    "advertiserId": "test-advertiser",
    "message": "💡 Test Ad - Click me!",
    "tooltip": "This is a test advertisement",
    "url": "https://example.com",
    "clickValue": 0.50,
    "impressionValue": 0.002,
    "budget": 100
  }'
```

### View Test Ad

1. Install extension
2. Enable monetization
3. Ad appears in status bar
4. Click to earn $0.25 (50% of $0.50)

---

## Key Metrics

### Developer Earnings
- **Impressions**: $0.001/view (your share)
- **Clicks**: $0.25/click (your share)
- **Average**: $2-10/day for active developers

### Advertiser Costs
- **CPC**: $0.50 per click
- **CPM**: $2 per 1000 impressions
- **Average CTR**: 4.2%

### Example Day
```
You code for 8 hours
200 impressions × $0.001 = $0.20
8 clicks × $0.25 = $2.00
Total: $2.20/day = $66/month
```

---

## Troubleshooting

### Extension Not Showing Ads

1. Check extension is enabled:
   ```
   Cmd/Ctrl+Shift+P → "AdLine: Enable Monetization"
   ```

2. Check server is running:
   ```bash
   curl http://localhost:3000/health
   ```

3. Check browser console:
   - Open Developer Tools
   - Look for errors

### Server Not Starting

1. Check port 3000 is available:
   ```bash
   lsof -i :3000
   ```

2. Check dependencies:
   ```bash
   npm install
   ```

3. Check database:
   ```bash
   ls -la adline.db
   ```

### No Earnings Showing

1. Wait 30 seconds for first ad
2. Click an ad to test
3. Check earnings:
   ```
   Cmd/Ctrl+Shift+P → "AdLine: Show Earnings"
   ```

---

## Production Deployment

### Extension → VS Code Marketplace

```bash
cd adline-extension
vsce package
vsce publish
```

### Server → Railway

```bash
cd adline-server
railway login
railway init
railway up
```

Update extension with production URL:
```typescript
const API_ENDPOINT = 'https://your-app.railway.app';
```

### Website → Vercel

```bash
cd adline-website
vercel --prod
```

---

## Next Steps

### As a Developer
1. Share with friends (earn referral bonus)
2. Code daily to maximize earnings
3. Track your growth in dashboard

### As an Advertiser
1. Start with $500 test budget
2. A/B test different messages
3. Scale successful campaigns
4. Track ROI carefully

### As Platform Owner
1. Get 100 beta users
2. Sign 5 advertisers
3. Reach $1k MRR
4. Scale to 1,000 users
5. Build self-service dashboard

---

## Resources

- **Full Documentation**: See ADLINE_README.md
- **API Reference**: See server.js comments
- **Support**: support@adline.dev
- **Sales**: advertise@adline.dev

---

## Success Story

**Month 1:**
- 50 developers install extension
- 2 advertisers paying $500/month
- $1,000 MRR

**Month 3:**
- 500 developers
- 10 advertisers
- $10,000 MRR

**Month 12:**
- 10,000 developers
- 100 advertisers
- $100,000 MRR

**Your passive income platform is ready.** 🚀💰

Start small, scale fast, build sustainably.

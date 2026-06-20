const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./adline.db', (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

// Initialize database tables
function initDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS ads (
            id TEXT PRIMARY KEY,
            advertiser_id TEXT,
            message TEXT,
            tooltip TEXT,
            url TEXT,
            click_value REAL DEFAULT 0.50,
            impression_value REAL DEFAULT 0.002,
            budget REAL,
            spent REAL DEFAULT 0,
            active INTEGER DEFAULT 1,
            created_at INTEGER,
            impressions INTEGER DEFAULT 0,
            clicks INTEGER DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS impressions (
            id TEXT PRIMARY KEY,
            ad_id TEXT,
            user_id TEXT,
            timestamp INTEGER,
            FOREIGN KEY(ad_id) REFERENCES ads(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS clicks (
            id TEXT PRIMARY KEY,
            ad_id TEXT,
            user_id TEXT,
            timestamp INTEGER,
            FOREIGN KEY(ad_id) REFERENCES ads(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT,
            total_impressions INTEGER DEFAULT 0,
            total_clicks INTEGER DEFAULT 0,
            total_earnings REAL DEFAULT 0,
            created_at INTEGER
        )
    `);

    // Insert demo ads if none exist
    db.get('SELECT COUNT(*) as count FROM ads', (err, row) => {
        if (!err && row.count === 0) {
            insertDemoAds();
        }
    });
}

// Insert demo ads for testing
function insertDemoAds() {
    const demoAds = [
        {
            id: uuidv4(),
            advertiser_id: 'demo-1',
            message: '💡 Try SuperAPI - REST APIs in 60 seconds',
            tooltip: 'Build production-ready APIs without boilerplate',
            url: 'https://example.com/superapi',
            click_value: 0.50,
            impression_value: 0.002,
            budget: 1000,
            active: 1,
            created_at: Date.now()
        },
        {
            id: uuidv4(),
            advertiser_id: 'demo-2',
            message: '🚀 Deploy to Cloud in 1 Click - CloudDeploy',
            tooltip: 'Zero-config deployments for developers',
            url: 'https://example.com/clouddeploy',
            click_value: 0.75,
            impression_value: 0.003,
            budget: 2000,
            active: 1,
            created_at: Date.now()
        },
        {
            id: uuidv4(),
            advertiser_id: 'demo-3',
            message: '🔥 AI Code Review - Find bugs before production',
            tooltip: 'Automated code review powered by AI',
            url: 'https://example.com/codereview',
            click_value: 1.00,
            impression_value: 0.005,
            budget: 5000,
            active: 1,
            created_at: Date.now()
        },
        {
            id: uuidv4(),
            advertiser_id: 'demo-4',
            message: '⚡ 10x Faster Queries with TurboSQL',
            tooltip: 'Database optimization made simple',
            url: 'https://example.com/turbosql',
            click_value: 0.60,
            impression_value: 0.002,
            budget: 1500,
            active: 1,
            created_at: Date.now()
        }
    ];

    const stmt = db.prepare(`
        INSERT INTO ads (id, advertiser_id, message, tooltip, url, click_value,
                        impression_value, budget, active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    demoAds.forEach(ad => {
        stmt.run(
            ad.id, ad.advertiser_id, ad.message, ad.tooltip, ad.url,
            ad.click_value, ad.impression_value, ad.budget, ad.active, ad.created_at
        );
    });

    stmt.finalize();
    console.log('Demo ads inserted');
}

// API Routes

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

// Get next ad to display
app.get('/ads/next', (req, res) => {
    const { userId, platform = 'vscode', context = 'statusbar' } = req.query;

    // Get active ads with budget remaining
    db.get(`
        SELECT * FROM ads
        WHERE active = 1 AND (budget - spent) > impression_value
        ORDER BY RANDOM()
        LIMIT 1
    `, (err, ad) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!ad) {
            // No ads available, return fallback
            return res.json({
                id: 'fallback',
                message: '💰 Earn passive income with AdLine',
                tooltip: 'Get paid to code',
                url: 'https://adline.dev',
                click_value: 0,
                impression_value: 0
            });
        }

        res.json({
            id: ad.id,
            message: ad.message,
            tooltip: ad.tooltip,
            url: ad.url,
            click_value: ad.click_value,
            impression_value: ad.impression_value
        });
    });
});

// Track impression
app.post('/ads/impression', (req, res) => {
    const { adId, userId, timestamp } = req.body;

    if (!adId || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const impressionId = uuidv4();

    // Insert impression
    db.run(
        'INSERT INTO impressions (id, ad_id, user_id, timestamp) VALUES (?, ?, ?, ?)',
        [impressionId, adId, userId, timestamp || Date.now()],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to track impression' });
            }

            // Update ad stats and spending
            db.get('SELECT impression_value FROM ads WHERE id = ?', [adId], (err, ad) => {
                if (!err && ad) {
                    const revenue = ad.impression_value;

                    db.run(
                        'UPDATE ads SET impressions = impressions + 1, spent = spent + ? WHERE id = ?',
                        [revenue, adId]
                    );

                    // Update user earnings (50% revenue share)
                    const userEarnings = revenue * 0.5;
                    db.run(`
                        INSERT INTO users (id, total_impressions, total_earnings, created_at)
                        VALUES (?, 1, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                            total_impressions = total_impressions + 1,
                            total_earnings = total_earnings + ?
                    `, [userId, userEarnings, Date.now(), userEarnings]);
                }
            });

            res.json({ success: true, impressionId });
        }
    );
});

// Track click
app.post('/ads/click', (req, res) => {
    const { adId, userId, timestamp } = req.body;

    if (!adId || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const clickId = uuidv4();

    // Insert click
    db.run(
        'INSERT INTO clicks (id, ad_id, user_id, timestamp) VALUES (?, ?, ?, ?)',
        [clickId, adId, userId, timestamp || Date.now()],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to track click' });
            }

            // Update ad stats and spending
            db.get('SELECT click_value FROM ads WHERE id = ?', [adId], (err, ad) => {
                if (!err && ad) {
                    const revenue = ad.click_value;

                    db.run(
                        'UPDATE ads SET clicks = clicks + 1, spent = spent + ? WHERE id = ?',
                        [revenue, adId]
                    );

                    // Update user earnings (50% revenue share)
                    const userEarnings = revenue * 0.5;
                    db.run(`
                        INSERT INTO users (id, total_clicks, total_earnings, created_at)
                        VALUES (?, 1, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                            total_clicks = total_clicks + 1,
                            total_earnings = total_earnings + ?
                    `, [userId, userEarnings, Date.now(), userEarnings]);
                }
            });

            res.json({ success: true, clickId });
        }
    );
});

// Get user earnings
app.get('/users/:userId/earnings', (req, res) => {
    const { userId } = req.params;

    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.json({
                impressions: 0,
                clicks: 0,
                earnings: 0
            });
        }

        res.json({
            impressions: user.total_impressions,
            clicks: user.total_clicks,
            earnings: user.total_earnings
        });
    });
});

// Admin: Create new ad campaign
app.post('/admin/ads', (req, res) => {
    const { advertiserId, message, tooltip, url, clickValue, impressionValue, budget } = req.body;

    if (!advertiserId || !message || !budget) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const adId = uuidv4();

    db.run(`
        INSERT INTO ads (id, advertiser_id, message, tooltip, url, click_value,
                        impression_value, budget, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        adId, advertiserId, message, tooltip || '', url || '',
        clickValue || 0.50, impressionValue || 0.002, budget, Date.now()
    ], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to create ad' });
        }

        res.json({ success: true, adId });
    });
});

// Admin: Get ad performance
app.get('/admin/ads/:adId/stats', (req, res) => {
    const { adId } = req.params;

    db.get(`
        SELECT
            a.*,
            (SELECT COUNT(*) FROM impressions WHERE ad_id = a.id) as total_impressions,
            (SELECT COUNT(*) FROM clicks WHERE ad_id = a.id) as total_clicks
        FROM ads a
        WHERE a.id = ?
    `, [adId], (err, ad) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!ad) {
            return res.status(404).json({ error: 'Ad not found' });
        }

        const ctr = ad.total_impressions > 0
            ? (ad.total_clicks / ad.total_impressions * 100).toFixed(2)
            : 0;

        res.json({
            ...ad,
            ctr,
            remaining_budget: ad.budget - ad.spent
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AdLine server running on port ${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}`);
    console.log(`💰 Demo ads loaded and ready`);
});

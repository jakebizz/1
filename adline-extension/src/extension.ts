import * as vscode from 'vscode';
import axios from 'axios';

// AdLine Extension - Monetize your code time
// Displays sponsored messages in status bar and tracks revenue

const API_ENDPOINT = 'https://api.adline.dev'; // Your API endpoint
let statusBarItem: vscode.StatusBarItem;
let currentAd: any = null;
let earningsData = { impressions: 0, clicks: 0, revenue: 0 };
let adRefreshTimer: NodeJS.Timeout | null = null;

export function activate(context: vscode.ExtensionContext) {
    console.log('AdLine extension activated!');

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100
    );
    context.subscriptions.push(statusBarItem);

    // Load earnings from storage
    loadEarnings(context);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('adline.enable', () => {
            vscode.workspace.getConfiguration('adline').update('enabled', true, true);
            vscode.window.showInformationMessage('AdLine monetization enabled!');
            startAdRotation(context);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('adline.disable', () => {
            vscode.workspace.getConfiguration('adline').update('enabled', false, true);
            vscode.window.showInformationMessage('AdLine monetization disabled');
            stopAdRotation();
            statusBarItem.hide();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('adline.showEarnings', () => {
            showEarningsPanel(context);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('adline.configure', () => {
            configureAccount(context);
        })
    );

    // Start if enabled
    const config = vscode.workspace.getConfiguration('adline');
    if (config.get('enabled')) {
        startAdRotation(context);
    } else {
        // Show welcome message on first install
        showWelcomeMessage(context);
    }

    // Monitor IDE activity for optimal ad timing
    monitorIDEActivity(context);
}

async function startAdRotation(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('adline');
    const refreshInterval = config.get('refreshInterval') as number || 30000;

    // Fetch and display ad immediately
    await fetchAndDisplayAd(context);

    // Set up rotation
    if (adRefreshTimer) {
        clearInterval(adRefreshTimer);
    }

    adRefreshTimer = setInterval(() => {
        fetchAndDisplayAd(context);
    }, refreshInterval);
}

function stopAdRotation() {
    if (adRefreshTimer) {
        clearInterval(adRefreshTimer);
        adRefreshTimer = null;
    }
}

async function fetchAndDisplayAd(context: vscode.ExtensionContext) {
    try {
        const config = vscode.workspace.getConfiguration('adline');
        const userId = config.get('userId') as string || await getUserId(context);

        // Fetch ad from API
        const response = await axios.get(`${API_ENDPOINT}/ads/next`, {
            params: {
                userId,
                platform: 'vscode',
                context: 'statusbar'
            },
            timeout: 5000
        });

        currentAd = response.data;

        if (currentAd) {
            displayAd(currentAd, context);
            trackImpression(currentAd, userId);
        }
    } catch (error) {
        // Fallback to demo ad if API unavailable
        displayDemoAd();
    }
}

function displayAd(ad: any, context: vscode.ExtensionContext) {
    // Format: "💰 Sponsored: [Message] - Click for details"
    const adText = `💰 ${ad.message || ad.text}`;

    statusBarItem.text = adText;
    statusBarItem.tooltip = `${ad.tooltip || 'Sponsored message'}\n\nClick to learn more • Earning you passive income!`;
    statusBarItem.command = 'adline.adClicked';
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    statusBarItem.show();

    // Register click handler
    const clickDisposable = vscode.commands.registerCommand('adline.adClicked', () => {
        handleAdClick(ad, context);
    });
    context.subscriptions.push(clickDisposable);
}

function displayDemoAd() {
    statusBarItem.text = '💰 AdLine Demo: Earn passive income while you code!';
    statusBarItem.tooltip = 'Click to set up AdLine and start earning';
    statusBarItem.command = 'adline.configure';
    statusBarItem.show();
}

async function handleAdClick(ad: any, context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('adline');
    const userId = config.get('userId') as string || await getUserId(context);

    // Track click
    try {
        await axios.post(`${API_ENDPOINT}/ads/click`, {
            adId: ad.id,
            userId,
            timestamp: Date.now()
        });

        // Update earnings
        earningsData.clicks += 1;
        earningsData.revenue += ad.clickValue || 0.05; // $0.05 per click default
        saveEarnings(context);

        // Show notification
        const action = await vscode.window.showInformationMessage(
            `💰 Nice! You earned $${(ad.clickValue || 0.05).toFixed(3)}`,
            'View Earnings',
            'Open Ad'
        );

        if (action === 'View Earnings') {
            vscode.commands.executeCommand('adline.showEarnings');
        } else if (action === 'Open Ad' && ad.url) {
            vscode.env.openExternal(vscode.Uri.parse(ad.url));
        }
    } catch (error) {
        console.error('Error tracking click:', error);
    }
}

async function trackImpression(ad: any, userId: string) {
    try {
        await axios.post(`${API_ENDPOINT}/ads/impression`, {
            adId: ad.id,
            userId,
            timestamp: Date.now()
        });

        earningsData.impressions += 1;
        earningsData.revenue += ad.impressionValue || 0.001; // $0.001 per impression
    } catch (error) {
        console.error('Error tracking impression:', error);
    }
}

function showEarningsPanel(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'adlineEarnings',
        'AdLine Earnings',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    const earnings = earningsData;
    const cpm = earnings.impressions > 0 ? (earnings.revenue / earnings.impressions * 1000) : 0;
    const ctr = earnings.impressions > 0 ? (earnings.clicks / earnings.impressions * 100) : 0;

    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    padding: 20px;
                    color: var(--vscode-foreground);
                    background: var(--vscode-editor-background);
                }
                .stat-card {
                    background: var(--vscode-editor-inactiveSelectionBackground);
                    padding: 20px;
                    margin: 10px 0;
                    border-radius: 8px;
                    border-left: 4px solid var(--vscode-button-background);
                }
                .stat-value {
                    font-size: 32px;
                    font-weight: bold;
                    color: var(--vscode-button-background);
                }
                .stat-label {
                    font-size: 14px;
                    opacity: 0.8;
                    margin-top: 5px;
                }
                h1 { color: var(--vscode-button-background); }
                .metric { display: flex; justify-content: space-between; margin: 10px 0; }
            </style>
        </head>
        <body>
            <h1>💰 Your AdLine Earnings</h1>

            <div class="stat-card">
                <div class="stat-value">$${earnings.revenue.toFixed(2)}</div>
                <div class="stat-label">Total Earnings</div>
            </div>

            <div class="stat-card">
                <div class="stat-value">${earnings.impressions.toLocaleString()}</div>
                <div class="stat-label">Total Impressions</div>
            </div>

            <div class="stat-card">
                <div class="stat-value">${earnings.clicks.toLocaleString()}</div>
                <div class="stat-label">Total Clicks</div>
            </div>

            <h2>Performance Metrics</h2>
            <div class="metric">
                <span>CPM (Cost per 1000 impressions):</span>
                <strong>$${cpm.toFixed(2)}</strong>
            </div>
            <div class="metric">
                <span>CTR (Click-through rate):</span>
                <strong>${ctr.toFixed(2)}%</strong>
            </div>
            <div class="metric">
                <span>Revenue per click:</span>
                <strong>$${earnings.clicks > 0 ? (earnings.revenue / earnings.clicks).toFixed(3) : '0.000'}</strong>
            </div>

            <p style="margin-top: 30px; opacity: 0.7;">
                💡 Keep coding to increase your passive income!<br>
                Earnings are calculated at 50% revenue share.
            </p>
        </body>
        </html>
    `;
}

async function configureAccount(context: vscode.ExtensionContext) {
    const userId = await vscode.window.showInputBox({
        prompt: 'Enter your AdLine User ID (or leave blank to generate one)',
        placeHolder: 'user-123-abc',
        value: vscode.workspace.getConfiguration('adline').get('userId') as string
    });

    if (userId !== undefined) {
        const finalUserId = userId || generateUserId();
        await vscode.workspace.getConfiguration('adline').update('userId', finalUserId, true);

        vscode.window.showInformationMessage(
            `AdLine configured! Your ID: ${finalUserId}`,
            'Start Earning'
        ).then(action => {
            if (action === 'Start Earning') {
                vscode.commands.executeCommand('adline.enable');
            }
        });
    }
}

async function getUserId(context: vscode.ExtensionContext): Promise<string> {
    let userId = context.globalState.get<string>('adline.userId');

    if (!userId) {
        userId = generateUserId();
        await context.globalState.update('adline.userId', userId);
        await vscode.workspace.getConfiguration('adline').update('userId', userId, true);
    }

    return userId;
}

function generateUserId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function loadEarnings(context: vscode.ExtensionContext) {
    const saved = context.globalState.get<any>('adline.earnings');
    if (saved) {
        earningsData = saved;
    }
}

function saveEarnings(context: vscode.ExtensionContext) {
    context.globalState.update('adline.earnings', earningsData);
}

function monitorIDEActivity(context: vscode.ExtensionContext) {
    // Monitor text document changes to detect active coding
    vscode.workspace.onDidChangeTextDocument(() => {
        // User is actively coding - good time for impressions
    });

    // Monitor terminal activity for Claude Code / AI agent usage
    vscode.window.onDidOpenTerminal(() => {
        // Terminal opened - potential AI agent activity
    });
}

function showWelcomeMessage(context: vscode.ExtensionContext) {
    const hasShownWelcome = context.globalState.get('adline.welcomeShown');

    if (!hasShownWelcome) {
        vscode.window.showInformationMessage(
            '💰 AdLine: Earn passive income while you code!',
            'Get Started',
            'Learn More'
        ).then(action => {
            if (action === 'Get Started') {
                vscode.commands.executeCommand('adline.configure');
            } else if (action === 'Learn More') {
                vscode.env.openExternal(vscode.Uri.parse('https://adline.dev'));
            }
        });

        context.globalState.update('adline.welcomeShown', true);
    }
}

export function deactivate() {
    stopAdRotation();
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

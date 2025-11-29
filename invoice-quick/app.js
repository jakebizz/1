// Storage keys
const INVOICES_KEY = 'invoiceQuick_invoices';
const CLIENTS_KEY = 'invoiceQuick_clients';
const SETTINGS_KEY = 'invoiceQuick_settings';

// Global state
let invoices = JSON.parse(localStorage.getItem(INVOICES_KEY)) || [];
let clients = JSON.parse(localStorage.getItem(CLIENTS_KEY)) || [];
let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
    isPro: false,
    monthlyInvoiceCount: 0,
    lastResetMonth: new Date().getMonth()
};

// Navigation
document.getElementById('dashboardLink').addEventListener('click', (e) => {
    e.preventDefault();
    showView('dashboardView');
    updateDashboard();
});

document.getElementById('newInvoiceLink').addEventListener('click', (e) => {
    e.preventDefault();
    checkInvoiceLimit() && showView('invoiceView');
});

document.getElementById('createInvoiceBtn').addEventListener('click', () => {
    checkInvoiceLimit() && showView('invoiceView');
});

document.getElementById('clientsLink').addEventListener('click', (e) => {
    e.preventDefault();
    showView('clientsView');
    renderClients();
});

document.getElementById('pricingLink').addEventListener('click', (e) => {
    e.preventDefault();
    showView('pricingView');
});

document.getElementById('upgradeBtn').addEventListener('click', () => {
    showView('pricingView');
});

document.getElementById('upgradeToPro').addEventListener('click', () => {
    // In a real app, this would integrate with Stripe
    alert('🎉 Integration with Stripe would go here!\n\nIn production:\n- Stripe Checkout for payments\n- Webhook for subscription management\n- User authentication\n\nFor now, simulating upgrade...');
    settings.isPro = true;
    saveSettings();
    alert('✅ Upgraded to Pro! (Demo mode)');
    updateDashboard();
});

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    const linkMap = {
        'dashboardView': 'dashboardLink',
        'invoiceView': 'newInvoiceLink',
        'clientsView': 'clientsLink',
        'pricingView': 'pricingLink'
    };
    if (linkMap[viewId]) {
        document.getElementById(linkMap[viewId]).classList.add('active');
    }
}

// Check invoice limit
function checkInvoiceLimit() {
    resetMonthlyCountIfNeeded();

    if (!settings.isPro && settings.monthlyInvoiceCount >= 5) {
        alert('⚠️ Free plan limit reached!\n\nYou\'ve used all 5 free invoices this month.\n\nUpgrade to Pro for unlimited invoices!');
        showView('pricingView');
        return false;
    }
    return true;
}

function resetMonthlyCountIfNeeded() {
    const currentMonth = new Date().getMonth();
    if (settings.lastResetMonth !== currentMonth) {
        settings.monthlyInvoiceCount = 0;
        settings.lastResetMonth = currentMonth;
        saveSettings();
    }
}

// Invoice form handling
document.getElementById('invoiceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveInvoice();
});

// Set default dates
const today = new Date().toISOString().split('T')[0];
const dueDate = new Date();
dueDate.setDate(dueDate.getDate() + 30);
document.getElementById('invoiceDate').value = today;
document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];

// Generate invoice number
document.getElementById('invoiceNumber').value = `INV-${String(invoices.length + 1).padStart(4, '0')}`;

// Line items
document.getElementById('addLineItemBtn').addEventListener('click', addLineItem);

function addLineItem() {
    const lineItems = document.getElementById('lineItems');
    const newItem = document.createElement('div');
    newItem.className = 'line-item';
    newItem.innerHTML = `
        <input type="text" placeholder="Description" class="item-description" required>
        <input type="number" placeholder="Qty" class="item-quantity" value="1" min="1" required>
        <input type="number" placeholder="Rate" class="item-rate" step="0.01" min="0" required>
        <span class="item-total">$0.00</span>
        <button type="button" class="btn-remove" onclick="removeLineItem(this)">×</button>
    `;
    lineItems.appendChild(newItem);
    attachLineItemListeners(newItem);
}

function removeLineItem(btn) {
    btn.closest('.line-item').remove();
    calculateTotal();
}

// Attach listeners to all line items
function attachLineItemListeners(item) {
    const qty = item.querySelector('.item-quantity');
    const rate = item.querySelector('.item-rate');

    qty.addEventListener('input', () => updateLineItemTotal(item));
    rate.addEventListener('input', () => updateLineItemTotal(item));
}

function updateLineItemTotal(item) {
    const qty = parseFloat(item.querySelector('.item-quantity').value) || 0;
    const rate = parseFloat(item.querySelector('.item-rate').value) || 0;
    const total = qty * rate;
    item.querySelector('.item-total').textContent = `$${total.toFixed(2)}`;
    calculateTotal();
}

function calculateTotal() {
    const items = document.querySelectorAll('.line-item');
    let total = 0;
    items.forEach(item => {
        const qty = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const rate = parseFloat(item.querySelector('.item-rate').value) || 0;
        total += qty * rate;
    });
    document.getElementById('invoiceTotal').textContent = `$${total.toFixed(2)}`;
}

// Initialize line item listeners
document.querySelectorAll('.line-item').forEach(attachLineItemListeners);

// Preview invoice
document.getElementById('previewBtn').addEventListener('click', () => {
    const preview = generateInvoicePreview();
    document.getElementById('invoicePreview').innerHTML = preview;
    document.getElementById('previewSection').style.display = 'block';
    document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth' });
});

function generateInvoicePreview() {
    const data = getFormData();
    const items = data.lineItems.map(item => `
        <tr>
            <td>${item.description}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">$${item.rate.toFixed(2)}</td>
            <td class="text-right">$${item.total.toFixed(2)}</td>
        </tr>
    `).join('');

    return `
        <h1>INVOICE</h1>
        <div class="invoice-header">
            <div>
                <h3>From:</h3>
                <p><strong>${data.businessName}</strong></p>
                <p>${data.businessEmail}</p>
                <p>${data.businessPhone}</p>
                <p style="white-space: pre-line;">${data.businessAddress}</p>
            </div>
            <div>
                <p><strong>Invoice #:</strong> ${data.invoiceNumber}</p>
                <p><strong>Date:</strong> ${new Date(data.invoiceDate).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</p>
            </div>
        </div>
        <div class="invoice-details">
            <div class="detail-section">
                <h3>Bill To:</h3>
                <p><strong>${data.clientName}</strong></p>
                <p>${data.clientEmail}</p>
                <p style="white-space: pre-line;">${data.clientAddress}</p>
            </div>
        </div>
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="text-right">Quantity</th>
                    <th class="text-right">Rate</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${items}
            </tbody>
        </table>
        <div class="invoice-totals">
            <div class="total-row final">
                <span>Total:</span>
                <span>$${data.total.toFixed(2)}</span>
            </div>
        </div>
        ${data.notes ? `<div style="margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px;"><strong>Notes:</strong><br>${data.notes}</div>` : ''}
    `;
}

function getFormData() {
    const lineItems = Array.from(document.querySelectorAll('.line-item')).map(item => {
        const qty = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const rate = parseFloat(item.querySelector('.item-rate').value) || 0;
        return {
            description: item.querySelector('.item-description').value,
            quantity: qty,
            rate: rate,
            total: qty * rate
        };
    });

    const total = lineItems.reduce((sum, item) => sum + item.total, 0);

    return {
        id: Date.now(),
        businessName: document.getElementById('businessName').value,
        businessEmail: document.getElementById('businessEmail').value,
        businessPhone: document.getElementById('businessPhone').value,
        businessAddress: document.getElementById('businessAddress').value,
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        clientAddress: document.getElementById('clientAddress').value,
        invoiceNumber: document.getElementById('invoiceNumber').value,
        invoiceDate: document.getElementById('invoiceDate').value,
        dueDate: document.getElementById('dueDate').value,
        lineItems: lineItems,
        notes: document.getElementById('invoiceNotes').value,
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
}

// Save invoice
function saveInvoice() {
    const invoice = getFormData();
    invoices.push(invoice);
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));

    // Increment monthly count
    settings.monthlyInvoiceCount++;
    saveSettings();

    // Generate PDF
    generatePDF(invoice);

    // Reset form and go to dashboard
    alert('✅ Invoice saved and PDF generated!');
    document.getElementById('invoiceForm').reset();
    showView('dashboardView');
    updateDashboard();
}

// Generate PDF
function generatePDF(invoice) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(24);
    doc.setTextColor(102, 126, 234);
    doc.text('INVOICE', 20, 20);

    // Invoice details
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 150, 20);
    doc.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 150, 26);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 150, 32);

    // From
    doc.setFontSize(12);
    doc.text('From:', 20, 40);
    doc.setFontSize(10);
    doc.text(invoice.businessName, 20, 46);
    doc.text(invoice.businessEmail, 20, 52);
    doc.text(invoice.businessPhone, 20, 58);
    const addressLines = invoice.businessAddress.split('\n');
    addressLines.forEach((line, i) => {
        doc.text(line, 20, 64 + (i * 6));
    });

    // Bill To
    doc.setFontSize(12);
    doc.text('Bill To:', 20, 90);
    doc.setFontSize(10);
    doc.text(invoice.clientName, 20, 96);
    doc.text(invoice.clientEmail, 20, 102);
    const clientAddressLines = invoice.clientAddress.split('\n');
    clientAddressLines.forEach((line, i) => {
        doc.text(line, 20, 108 + (i * 6));
    });

    // Line items table
    let y = 130;
    doc.setFillColor(243, 244, 246);
    doc.rect(20, y, 170, 8, 'F');
    doc.setFontSize(10);
    doc.text('Description', 22, y + 5);
    doc.text('Qty', 120, y + 5);
    doc.text('Rate', 140, y + 5);
    doc.text('Amount', 165, y + 5);

    y += 12;
    invoice.lineItems.forEach(item => {
        doc.text(item.description.substring(0, 40), 22, y);
        doc.text(String(item.quantity), 120, y);
        doc.text(`$${item.rate.toFixed(2)}`, 140, y);
        doc.text(`$${item.total.toFixed(2)}`, 165, y);
        y += 8;
    });

    // Total
    y += 10;
    doc.setFontSize(14);
    doc.text(`Total: $${invoice.total.toFixed(2)}`, 140, y);

    // Notes
    if (invoice.notes) {
        y += 20;
        doc.setFontSize(10);
        doc.text('Notes:', 20, y);
        const noteLines = doc.splitTextToSize(invoice.notes, 170);
        doc.text(noteLines, 20, y + 6);
    }

    // Save PDF
    doc.save(`${invoice.invoiceNumber}.pdf`);
}

// Dashboard
function updateDashboard() {
    resetMonthlyCountIfNeeded();

    // Update usage banner
    document.getElementById('invoiceCount').textContent = settings.monthlyInvoiceCount;
    if (settings.isPro) {
        document.querySelector('.usage-banner').innerHTML = '<p>Pro Plan: <strong>Unlimited</strong> invoices ✨</p>';
    }

    // Calculate stats
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(i => i.status === 'paid').length;
    const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);

    document.getElementById('totalInvoices').textContent = totalInvoices;
    document.getElementById('paidInvoices').textContent = paidInvoices;
    document.getElementById('pendingInvoices').textContent = pendingInvoices;
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;

    // Render invoice list
    const invoiceList = document.getElementById('invoiceList');
    if (invoices.length === 0) {
        invoiceList.innerHTML = '<p class="empty-state">No invoices yet. Create your first invoice to get started!</p>';
    } else {
        invoiceList.innerHTML = invoices.map(inv => `
            <div class="invoice-item">
                <div class="invoice-info">
                    <h4>${inv.invoiceNumber} - ${inv.clientName}</h4>
                    <p>Due: ${new Date(inv.dueDate).toLocaleDateString()} • $${inv.total.toFixed(2)}</p>
                </div>
                <div class="invoice-actions">
                    <span class="badge-${inv.status}">${inv.status.toUpperCase()}</span>
                    <button class="btn-secondary" onclick="toggleStatus(${inv.id})">
                        Mark as ${inv.status === 'paid' ? 'Pending' : 'Paid'}
                    </button>
                    <button class="btn-primary" onclick="downloadInvoice(${inv.id})">Download PDF</button>
                </div>
            </div>
        `).reverse().join('');
    }
}

window.toggleStatus = function(id) {
    const invoice = invoices.find(i => i.id === id);
    if (invoice) {
        invoice.status = invoice.status === 'paid' ? 'pending' : 'paid';
        localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
        updateDashboard();
    }
};

window.downloadInvoice = function(id) {
    const invoice = invoices.find(i => i.id === id);
    if (invoice) {
        generatePDF(invoice);
    }
};

// Clients
function renderClients() {
    const clientList = document.getElementById('clientList');
    const uniqueClients = [...new Map(invoices.map(inv => [inv.clientEmail, {
        name: inv.clientName,
        email: inv.clientEmail,
        address: inv.clientAddress,
        totalInvoices: invoices.filter(i => i.clientEmail === inv.clientEmail).length,
        totalSpent: invoices.filter(i => i.clientEmail === inv.clientEmail && i.status === 'paid')
            .reduce((sum, i) => sum + i.total, 0)
    }])).values()];

    if (uniqueClients.length === 0) {
        clientList.innerHTML = '<p class="empty-state">No clients yet. Add a client to get started!</p>';
    } else {
        clientList.innerHTML = uniqueClients.map(client => `
            <div class="client-item">
                <div class="client-info">
                    <h4>${client.name}</h4>
                    <p>${client.email} • ${client.totalInvoices} invoices • $${client.totalSpent.toFixed(2)} paid</p>
                </div>
            </div>
        `).join('');
    }
}

// Save settings
function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Initialize
updateDashboard();

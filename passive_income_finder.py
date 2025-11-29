#!/usr/bin/env python3
"""
Passive Income Opportunity Finder & Tracker
Analyzes and tracks various passive income streams including:
- High-yield dividend stocks
- REITs (Real Estate Investment Trusts)
- Bond yields
- Savings account rates
- Passive income projections
"""

import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any
import random


class PassiveIncomeOpportunity:
    """Represents a passive income opportunity"""

    def __init__(self, name: str, category: str, annual_yield: float,
                 min_investment: float, risk_level: str, description: str):
        self.name = name
        self.category = category
        self.annual_yield = annual_yield
        self.min_investment = min_investment
        self.risk_level = risk_level
        self.description = description

    def calculate_monthly_income(self, investment: float) -> float:
        """Calculate monthly passive income from investment"""
        return (investment * self.annual_yield) / 12

    def calculate_annual_income(self, investment: float) -> float:
        """Calculate annual passive income from investment"""
        return investment * self.annual_yield

    def to_dict(self) -> Dict[str, Any]:
        return {
            'name': self.name,
            'category': self.category,
            'annual_yield': self.annual_yield,
            'min_investment': self.min_investment,
            'risk_level': self.risk_level,
            'description': self.description
        }


class PassiveIncomeFinder:
    """Finds and analyzes passive income opportunities"""

    def __init__(self):
        self.opportunities = self._load_opportunities()

    def _load_opportunities(self) -> List[PassiveIncomeOpportunity]:
        """Load current passive income opportunities with realistic yields"""
        return [
            # High Dividend Stocks
            PassiveIncomeOpportunity(
                "Altria Group (MO)",
                "Dividend Stock",
                0.0875,  # 8.75% yield
                100,
                "Medium",
                "Tobacco company with consistent dividend history"
            ),
            PassiveIncomeOpportunity(
                "AT&T (T)",
                "Dividend Stock",
                0.0620,  # 6.20% yield
                100,
                "Medium",
                "Telecom giant with stable dividends"
            ),
            PassiveIncomeOpportunity(
                "Verizon (VZ)",
                "Dividend Stock",
                0.0680,  # 6.80% yield
                100,
                "Medium-Low",
                "Reliable telecom dividend payer"
            ),

            # REITs
            PassiveIncomeOpportunity(
                "Realty Income Corp (O)",
                "REIT",
                0.0540,  # 5.40% yield
                500,
                "Medium",
                "Monthly dividend REIT - 'The Monthly Dividend Company'"
            ),
            PassiveIncomeOpportunity(
                "AGNC Investment Corp",
                "Mortgage REIT",
                0.1420,  # 14.20% yield
                250,
                "High",
                "Mortgage REIT with high yield but higher volatility"
            ),
            PassiveIncomeOpportunity(
                "Public Storage (PSA)",
                "REIT",
                0.0430,  # 4.30% yield
                500,
                "Low-Medium",
                "Self-storage REIT with steady income"
            ),

            # Dividend ETFs
            PassiveIncomeOpportunity(
                "Vanguard High Dividend Yield ETF (VYM)",
                "Dividend ETF",
                0.0320,  # 3.20% yield
                100,
                "Low",
                "Diversified dividend ETF focusing on high-yield stocks"
            ),
            PassiveIncomeOpportunity(
                "Schwab U.S. Dividend Equity ETF (SCHD)",
                "Dividend ETF",
                0.0360,  # 3.60% yield
                100,
                "Low",
                "Quality dividend ETF with strong track record"
            ),

            # Bonds
            PassiveIncomeOpportunity(
                "iShares 20+ Year Treasury Bond ETF (TLT)",
                "Bond ETF",
                0.0445,  # 4.45% yield
                250,
                "Low-Medium",
                "Long-term Treasury bonds with stable income"
            ),
            PassiveIncomeOpportunity(
                "Corporate Bond ETF (LQD)",
                "Bond ETF",
                0.0520,  # 5.20% yield
                250,
                "Medium",
                "Investment-grade corporate bonds"
            ),

            # High-Yield Savings & CDs
            PassiveIncomeOpportunity(
                "High-Yield Savings Account",
                "Savings",
                0.0450,  # 4.50% APY
                1,
                "Very Low",
                "FDIC insured savings with competitive rates"
            ),
            PassiveIncomeOpportunity(
                "12-Month CD",
                "Certificate of Deposit",
                0.0500,  # 5.00% APY
                500,
                "Very Low",
                "FDIC insured with guaranteed return"
            ),

            # Crypto Staking (Higher risk, illustrative yields)
            PassiveIncomeOpportunity(
                "ETH Staking",
                "Crypto Staking",
                0.0380,  # ~3.8% APY
                1000,
                "Very High",
                "Ethereum staking rewards (crypto volatility risk)"
            ),
            PassiveIncomeOpportunity(
                "Stablecoin Yield",
                "Crypto Lending",
                0.0450,  # ~4.5% APY
                100,
                "High",
                "Lending stablecoins (platform and depegging risk)"
            ),

            # Alternative Investments
            PassiveIncomeOpportunity(
                "Fundrise eREIT",
                "Private REIT",
                0.0680,  # ~6.8% target yield
                1000,
                "Medium-High",
                "Private real estate investment platform"
            ),
            PassiveIncomeOpportunity(
                "Peer-to-Peer Lending",
                "P2P Lending",
                0.0550,  # ~5.5% average
                25,
                "High",
                "Lending to individuals/businesses (default risk)"
            ),
        ]

    def get_opportunities_by_category(self, category: str) -> List[PassiveIncomeOpportunity]:
        """Filter opportunities by category"""
        return [opp for opp in self.opportunities if opp.category == category]

    def get_opportunities_by_risk(self, risk_level: str) -> List[PassiveIncomeOpportunity]:
        """Filter opportunities by risk level"""
        return [opp for opp in self.opportunities if opp.risk_level == risk_level]

    def get_top_yields(self, limit: int = 10) -> List[PassiveIncomeOpportunity]:
        """Get opportunities with highest yields"""
        return sorted(self.opportunities, key=lambda x: x.annual_yield, reverse=True)[:limit]

    def get_low_entry_opportunities(self, max_investment: float = 500) -> List[PassiveIncomeOpportunity]:
        """Find opportunities with low minimum investment"""
        return [opp for opp in self.opportunities if opp.min_investment <= max_investment]

    def calculate_portfolio_income(self, investments: Dict[str, float]) -> Dict[str, Any]:
        """
        Calculate total passive income from a portfolio
        investments: Dict mapping opportunity name to investment amount
        """
        total_annual = 0
        total_monthly = 0
        total_invested = 0
        breakdown = []

        for opp in self.opportunities:
            if opp.name in investments:
                amount = investments[opp.name]
                annual = opp.calculate_annual_income(amount)
                monthly = opp.calculate_monthly_income(amount)

                total_annual += annual
                total_monthly += monthly
                total_invested += amount

                breakdown.append({
                    'name': opp.name,
                    'invested': amount,
                    'annual_income': annual,
                    'monthly_income': monthly,
                    'yield': opp.annual_yield
                })

        return {
            'total_invested': total_invested,
            'total_annual_income': total_annual,
            'total_monthly_income': total_monthly,
            'effective_yield': total_annual / total_invested if total_invested > 0 else 0,
            'breakdown': breakdown
        }


class PassiveIncomeTracker:
    """Track personal passive income investments"""

    def __init__(self, filename: str = 'passive_income_portfolio.json'):
        self.filename = filename
        self.portfolio = self._load_portfolio()

    def _load_portfolio(self) -> Dict[str, float]:
        """Load portfolio from file"""
        if os.path.exists(self.filename):
            with open(self.filename, 'r') as f:
                return json.load(f)
        return {}

    def save_portfolio(self):
        """Save portfolio to file"""
        with open(self.filename, 'w') as f:
            json.dump(self.portfolio, f, indent=2)

    def add_investment(self, opportunity_name: str, amount: float):
        """Add or update investment"""
        if opportunity_name in self.portfolio:
            self.portfolio[opportunity_name] += amount
        else:
            self.portfolio[opportunity_name] = amount
        self.save_portfolio()

    def remove_investment(self, opportunity_name: str):
        """Remove investment"""
        if opportunity_name in self.portfolio:
            del self.portfolio[opportunity_name]
            self.save_portfolio()

    def get_portfolio(self) -> Dict[str, float]:
        """Get current portfolio"""
        return self.portfolio


def print_header(text: str, width: int = 80):
    """Print formatted header"""
    print("\n" + "=" * width)
    print(text.center(width))
    print("=" * width)


def print_opportunity(opp: PassiveIncomeOpportunity, investment: float = 10000):
    """Print detailed opportunity information"""
    print(f"\n{opp.name}")
    print("-" * 60)
    print(f"Category:        {opp.category}")
    print(f"Annual Yield:    {opp.annual_yield * 100:.2f}%")
    print(f"Risk Level:      {opp.risk_level}")
    print(f"Min Investment:  ${opp.min_investment:,.2f}")
    print(f"\nWith ${investment:,.2f} investment:")
    print(f"  Monthly Income:  ${opp.calculate_monthly_income(investment):,.2f}")
    print(f"  Annual Income:   ${opp.calculate_annual_income(investment):,.2f}")
    print(f"\nDescription: {opp.description}")


def display_dashboard(finder: PassiveIncomeFinder, tracker: PassiveIncomeTracker):
    """Display interactive dashboard"""

    print_header("💰 PASSIVE INCOME OPPORTUNITY FINDER 💰")

    print("\n📊 MENU OPTIONS:")
    print("1. View Top Yield Opportunities")
    print("2. Browse by Category")
    print("3. Browse by Risk Level")
    print("4. Low Entry Opportunities (<$500)")
    print("5. Calculate Portfolio Income")
    print("6. View Sample Diversified Portfolio")
    print("7. Income Goal Calculator")
    print("8. View All Opportunities")
    print("9. Exit")

    choice = input("\nEnter your choice (1-9): ").strip()

    if choice == "1":
        print_header("🏆 TOP 10 HIGHEST YIELDS")
        top = finder.get_top_yields(10)
        for i, opp in enumerate(top, 1):
            print(f"\n{i}. {opp.name}")
            print(f"   Yield: {opp.annual_yield * 100:.2f}% | Risk: {opp.risk_level} | Min: ${opp.min_investment:,.0f}")
            print(f"   {opp.description}")

        # Show income projection
        print("\n" + "-" * 60)
        print("Income Projection with $10,000 in Top Opportunity:")
        top_opp = top[0]
        print(f"Monthly: ${top_opp.calculate_monthly_income(10000):,.2f}")
        print(f"Annual:  ${top_opp.calculate_annual_income(10000):,.2f}")

    elif choice == "2":
        print_header("📁 BROWSE BY CATEGORY")
        categories = list(set(opp.category for opp in finder.opportunities))
        for i, cat in enumerate(categories, 1):
            opps = finder.get_opportunities_by_category(cat)
            avg_yield = sum(o.annual_yield for o in opps) / len(opps)
            print(f"{i}. {cat} ({len(opps)} opportunities, avg {avg_yield*100:.2f}% yield)")

    elif choice == "3":
        print_header("⚠️ BROWSE BY RISK LEVEL")
        risk_levels = ["Very Low", "Low", "Low-Medium", "Medium", "Medium-High", "High", "Very High"]
        for risk in risk_levels:
            opps = finder.get_opportunities_by_risk(risk)
            if opps:
                avg_yield = sum(o.annual_yield for o in opps) / len(opps)
                print(f"\n{risk} Risk: {len(opps)} opportunities (avg {avg_yield*100:.2f}% yield)")
                for opp in opps:
                    print(f"  • {opp.name} - {opp.annual_yield*100:.2f}%")

    elif choice == "4":
        print_header("🎯 LOW ENTRY OPPORTUNITIES (Under $500)")
        low_entry = finder.get_low_entry_opportunities(500)
        for opp in sorted(low_entry, key=lambda x: x.min_investment):
            print(f"\n{opp.name} - ${opp.min_investment:,.0f} minimum")
            print(f"  Yield: {opp.annual_yield * 100:.2f}% | Risk: {opp.risk_level}")
            print(f"  ${100:,.0f} investment → ${opp.calculate_monthly_income(100):.2f}/month")

    elif choice == "5":
        print_header("💼 PORTFOLIO INCOME CALCULATOR")
        print("\nEnter investments (name: amount) or 'done' to finish:")
        investments = {}

        # Show available opportunities
        print("\nAvailable opportunities:")
        for i, opp in enumerate(finder.opportunities, 1):
            print(f"{i}. {opp.name}")

        print("\nExample: 'Altria Group (MO): 5000' or just the number: '1: 5000'")

        while True:
            entry = input("\nInvestment (or 'done'): ").strip()
            if entry.lower() == 'done':
                break

            try:
                if ':' in entry:
                    name_or_num, amount = entry.split(':', 1)
                    name_or_num = name_or_num.strip()
                    amount = float(amount.strip())

                    # Check if it's a number reference
                    if name_or_num.isdigit():
                        idx = int(name_or_num) - 1
                        if 0 <= idx < len(finder.opportunities):
                            name = finder.opportunities[idx].name
                        else:
                            print("Invalid opportunity number")
                            continue
                    else:
                        name = name_or_num

                    investments[name] = amount
                    print(f"Added ${amount:,.2f} to {name}")
            except:
                print("Invalid format. Use 'Name: Amount' or 'Number: Amount'")

        if investments:
            result = finder.calculate_portfolio_income(investments)
            print("\n" + "=" * 60)
            print("PORTFOLIO ANALYSIS".center(60))
            print("=" * 60)
            print(f"\nTotal Invested:       ${result['total_invested']:,.2f}")
            print(f"Monthly Income:       ${result['total_monthly_income']:,.2f}")
            print(f"Annual Income:        ${result['total_annual_income']:,.2f}")
            print(f"Effective Yield:      {result['effective_yield'] * 100:.2f}%")

            print("\n" + "-" * 60)
            print("BREAKDOWN:")
            for item in result['breakdown']:
                print(f"\n{item['name']}")
                print(f"  Invested: ${item['invested']:,.2f} @ {item['yield']*100:.2f}%")
                print(f"  Income: ${item['monthly_income']:,.2f}/mo (${item['annual_income']:,.2f}/yr)")

    elif choice == "6":
        print_header("🎯 SAMPLE DIVERSIFIED PORTFOLIO")
        print("\n$50,000 Conservative-Moderate Portfolio:")
        print("-" * 60)

        sample_portfolio = {
            "Schwab U.S. Dividend Equity ETF (SCHD)": 15000,
            "Vanguard High Dividend Yield ETF (VYM)": 10000,
            "High-Yield Savings Account": 10000,
            "Realty Income Corp (O)": 8000,
            "12-Month CD": 5000,
            "AT&T (T)": 2000
        }

        result = finder.calculate_portfolio_income(sample_portfolio)

        for item in result['breakdown']:
            pct = (item['invested'] / result['total_invested']) * 100
            print(f"\n{pct:.0f}% - {item['name']}")
            print(f"  ${item['invested']:,.0f} @ {item['yield']*100:.2f}% = ${item['monthly_income']:,.2f}/month")

        print("\n" + "=" * 60)
        print(f"Total Monthly Income:  ${result['total_monthly_income']:,.2f}")
        print(f"Total Annual Income:   ${result['total_annual_income']:,.2f}")
        print(f"Effective Yield:       {result['effective_yield'] * 100:.2f}%")

        # Show 10-year projection with reinvestment
        print("\n" + "-" * 60)
        print("10-YEAR PROJECTION (with dividend reinvestment):")
        principal = result['total_invested']
        rate = result['effective_yield']
        for year in [1, 3, 5, 10]:
            future_value = principal * ((1 + rate) ** year)
            annual_income = future_value * rate
            print(f"Year {year:2d}: ${future_value:,.2f} portfolio → ${annual_income:,.2f}/year income")

    elif choice == "7":
        print_header("🎯 INCOME GOAL CALCULATOR")

        try:
            goal = float(input("\nTarget monthly passive income: $"))
            risk = input("Risk tolerance (low/medium/high): ").strip().lower()

            # Select appropriate opportunities based on risk
            if risk == "low":
                selected = [o for o in finder.opportunities if o.risk_level in ["Very Low", "Low", "Low-Medium"]]
            elif risk == "medium":
                selected = [o for o in finder.opportunities if o.risk_level in ["Low-Medium", "Medium"]]
            else:
                selected = finder.opportunities

            if selected:
                avg_yield = sum(o.annual_yield for o in selected) / len(selected)
                required_investment = (goal * 12) / avg_yield

                print(f"\n{'='*60}")
                print(f"To generate ${goal:,.2f}/month (${goal*12:,.2f}/year)")
                print(f"At average {avg_yield*100:.2f}% yield ({risk} risk)")
                print(f"You need to invest: ${required_investment:,.2f}")
                print(f"{'='*60}")

                print(f"\nRecommended {risk.upper()} risk opportunities:")
                for opp in sorted(selected, key=lambda x: x.annual_yield, reverse=True)[:5]:
                    needed = (goal * 12) / opp.annual_yield
                    print(f"\n• {opp.name} ({opp.annual_yield*100:.2f}%)")
                    print(f"  Investment needed: ${needed:,.2f}")
                    print(f"  Risk: {opp.risk_level}")
        except:
            print("Invalid input")

    elif choice == "8":
        print_header("📋 ALL OPPORTUNITIES")
        categories = {}
        for opp in finder.opportunities:
            if opp.category not in categories:
                categories[opp.category] = []
            categories[opp.category].append(opp)

        for category, opps in sorted(categories.items()):
            print(f"\n\n{'='*60}")
            print(f"{category.upper()}")
            print('='*60)
            for opp in sorted(opps, key=lambda x: x.annual_yield, reverse=True):
                print(f"\n{opp.name}")
                print(f"  Yield: {opp.annual_yield*100:.2f}% | Risk: {opp.risk_level} | Min: ${opp.min_investment:,.0f}")
                print(f"  $10k investment → ${opp.calculate_monthly_income(10000):,.2f}/mo")
                print(f"  {opp.description}")


def main():
    """Main program loop"""
    finder = PassiveIncomeFinder()
    tracker = PassiveIncomeTracker()

    print("\n" + "="*80)
    print("💰 PASSIVE INCOME OPPORTUNITY FINDER & TRACKER 💰".center(80))
    print("="*80)
    print("\nDiscover and analyze passive income opportunities!")
    print("Track dividend stocks, REITs, bonds, savings, and more.")
    print("\nDisclaimer: This is for educational purposes. Not financial advice.")
    print("Always do your own research and consider consulting a financial advisor.")

    while True:
        try:
            display_dashboard(finder, tracker)

            continue_choice = input("\n\nContinue exploring? (y/n): ").strip().lower()
            if continue_choice != 'y':
                break
        except KeyboardInterrupt:
            print("\n\nExiting...")
            break
        except Exception as e:
            print(f"\nError: {e}")
            continue

    print("\n" + "="*80)
    print("Thanks for using Passive Income Finder!".center(80))
    print("Remember: Diversification and patience are key to passive income success.".center(80))
    print("="*80 + "\n")


if __name__ == "__main__":
    main()

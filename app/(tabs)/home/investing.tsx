import React, { useState } from 'react';
import { ScrollView, View } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { router } from 'expo-router';
import { ChevronLeftIcon } from '@/components/ui/icon';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
} from '@/components/ui/modal';
import TextButton from '@/components/inputs/text-button';
import { Heading } from '@/components/ui/heading';
import PageLayout from "@/components/layouts/page-layout";
import { PiggyBank, TrendingUp, Wallet, LineChart, Building2, BarChart3, FolderOpen } from 'lucide-react-native';

interface GuideCardProps {
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    description: string;
    onPress: () => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ icon, iconBgColor, title, description, onPress }) => (
    <View className="bg-white p-6 w-full rounded-xl border border-gray-200 shadow-black/10 elevation-5 flex-1 min-h-0">
        <View className={`w-20 h-20 rounded-xl justify-center items-center ${iconBgColor}`}>
            {icon}
        </View>
        <Text className="text-2xl font-semibold text-gray-900 mt-5 mb-2">{title}</Text>
        <View className="flex-row items-center justify-between mt-auto">
            <Text className="text-lg text-gray-500 leading-6 flex-1 mr-4">{description}</Text>
            <TextButton
                label="Read More"
                onPress={onPress}
                variant="secondary"
                size="md"
            // rounded="full"
            // textClassName="text-white text-base font-medium"
            />
        </View>
    </View>
);

// Expanded content for each account type
const getExpandedContent = (accountType: string) => {
    const content = {
        'Roth IRA': {
            title: 'Roth IRA - Tax-Free Growth',
            content: `A Roth IRA (Individual Retirement Account) is a retirement savings account that offers tax-free growth and tax-free withdrawals in retirement. Here's what you need to know:

KEY FEATURES

• Contributions: Made with after-tax dollars (no upfront tax deduction)
• Tax Treatment: Earnings grow tax-free, and qualified withdrawals are tax-free
• Contribution Limits (2025): $7,000 per year ($8,000 if age 50+)
• Income Limits: Phase-out begins at $146,000 (single) or $230,000 (married filing jointly)
• Age Requirement: Must have earned income, no age limit
• Early Withdrawal: Contributions can be withdrawn anytime penalty-free

BENEFITS

• Tax-free retirement income: Pay no taxes on withdrawals after age 59½
• No required minimum distributions (RMDs): Unlike traditional IRAs, you're never forced to withdraw
• Estate planning advantages: Can pass tax-free to beneficiaries
• Flexibility: Access contributions without penalty if needed

BEST FOR

Students and young professionals who expect to be in a higher tax bracket in retirement. The earlier you start, the more your money can grow tax-free.

GETTING STARTED

1. Open an account with a brokerage (Fidelity, Vanguard, Charles Schwab)
2. Contribute regularly (even small amounts add up)
3. Invest in low-cost index funds or target-date funds
4. Let compound growth work its magic over decades

Remember: Time is your greatest asset. Starting early, even with small contributions, can lead to substantial tax-free wealth in retirement.`
        },
        'Traditional IRA': {
            title: 'Traditional IRA - Tax-Deferred Growth',
            content: `A Traditional IRA is an individual retirement account that offers upfront tax deductions and tax-deferred growth. It's a powerful tool for building retirement savings on your own terms.

KEY FEATURES

• Contributions: Made with pre-tax dollars (you get a tax deduction now)
• Tax Treatment: Earnings grow tax-deferred; withdrawals taxed as ordinary income in retirement
• Contribution Limits (2025): $7,000 per year ($8,000 if age 50+)
• Deduction Limits: May be reduced if you or your spouse have a workplace retirement plan and earn above certain income levels
• Required Minimum Distributions (RMDs): Must start withdrawing at age 73
• Early Withdrawal Penalty: 10% penalty plus taxes if withdrawn before age 59½

BENEFITS

• Immediate tax savings: Reduce your taxable income now
• Tax-deferred growth: No taxes on earnings until withdrawal
• Full control: Choose from thousands of investment options
• Flexibility: Open account with any brokerage
• Accessible: Anyone with earned income can contribute

DEDUCTION PHASE-OUTS (2025)

If you have a workplace retirement plan:
• Single: Phase-out $77,000-$87,000
• Married filing jointly: Phase-out $123,000-$143,000

If you don't have a plan but spouse does:
• Married filing jointly: Phase-out $230,000-$240,000

BEST FOR

• People without access to a 401(k) or after maxing it out
• Those who want more investment options than a 401(k) offers
• Individuals expecting to be in a lower tax bracket in retirement
• Anyone seeking immediate tax deductions

TRADITIONAL IRA VS ROTH IRA

Choose Traditional if:
✓ You want immediate tax deductions
✓ You expect lower taxes in retirement
✓ You're in a high tax bracket now
✓ You need the tax break today

Choose Roth if:
✓ You want tax-free withdrawals later
✓ You expect higher taxes in retirement
✓ You're young with a long time horizon
✓ You're in a lower tax bracket now

GETTING STARTED

1. Open account with a brokerage (Fidelity, Vanguard, Charles Schwab)
2. Set up automatic monthly contributions
3. Invest in low-cost index funds or target-date funds
4. Claim your deduction when filing taxes
5. Contribute consistently every year

CONTRIBUTION DEADLINE

You can contribute for the previous tax year until Tax Day (April 15). This means you have extra time to maximize contributions and reduce your tax bill.

PRO TIP: If you're eligible for both traditional and Roth IRAs, consider splitting contributions between them for tax diversification in retirement.`
        },
        '401(k)': {
            title: '401(k) - Employer-Sponsored Retirement',
            content: `A 401(k) is an employer-sponsored retirement plan that offers tax advantages, higher contribution limits, and often includes employer matching contributions. It's one of the most powerful wealth-building tools available.

KEY FEATURES

• Employer-sponsored: Must be offered by your workplace
• Contribution Limits (2025): $23,000 per year ($30,500 if age 50+)
• Employer Match: Many employers contribute extra money (FREE MONEY!)
• Tax Treatment: Pre-tax contributions reduce taxable income now; withdrawals taxed in retirement
• Automatic Payroll: Contributions taken directly from paycheck
• Early Withdrawal Penalty: 10% penalty plus taxes if withdrawn before age 59½
• Required Minimum Distributions (RMDs): Must start at age 73

EMPLOYER MATCHING

Common matching formulas:
• 50% match on first 6% of salary (most common)
• 100% match on first 3% of salary
• Dollar-for-dollar up to 4% of salary

Example: If you earn $50,000 and contribute 6% ($3,000), employer matches 50% = $1,500 FREE money!

THE GOLDEN RULE: Always contribute at least enough to get the full employer match. It's an instant 50-100% return on investment!

BENEFITS

• Higher contribution limits: $23,000 vs $7,000 for IRAs
• Employer match: Free money that boosts returns
• Automatic saving: Set it and forget it from paycheck
• Immediate tax savings: Reduce taxable income
• Loan options: Can borrow from some 401(k) plans
• Legal protection: Protected from creditors in bankruptcy

TRADITIONAL VS ROTH 401(K)

Traditional 401(k):
• Pre-tax contributions (lower taxes now)
• Taxed on withdrawal in retirement
• Best if you expect lower tax rate in retirement

Roth 401(k):
• After-tax contributions (no tax break now)
• Tax-free withdrawals in retirement
• Best if you expect higher tax rate in retirement
• Still subject to RMDs at age 73

INVESTMENT OPTIONS

Most 401(k) plans offer:
• Target-date funds (easiest option)
• Index funds (low-cost, diversified)
• Company stock (be careful - don't over-concentrate)
• Bond funds (lower risk, lower returns)

CONTRIBUTION STRATEGY

1. Start: Contribute at least enough for full employer match
2. Increase gradually: Raise contribution by 1% annually
3. Maximize: Work toward contributing full $23,000 limit
4. Rebalance: Review and adjust investments annually

VESTING SCHEDULES

Employer contributions may have vesting requirements:
• Immediate: Keep all contributions right away
• Cliff vesting: 100% vested after 3 years
• Graded vesting: 20% per year over 5 years

Your contributions are always 100% vested and belong to you.

LEAVING YOUR JOB

When you leave, you have options:
1. Leave it: Keep account with old employer (if allowed)
2. Roll over: Transfer to new employer's 401(k)
3. IRA rollover: Move to IRA for more investment options (BEST for most)
4. Cash out: Take money (DON'T DO THIS - you'll pay taxes + penalty)

COMMON MISTAKES TO AVOID

× Not contributing enough for full match (leaving free money on table)
× Cashing out when changing jobs (loses years of compound growth)
× Investing too conservatively when young
× Never reviewing or rebalancing investments
× Taking loans from 401(k) unnecessarily
× Ignoring high expense ratio funds

MAXIMIZING YOUR 401(K)

• Start early and contribute consistently
• Increase contributions with every raise
• Choose low-cost index funds when available
• Rebalance annually
• Never cash out early
• Consider Roth 401(k) if young and in lower tax bracket

Remember: Your 401(k) is likely your most powerful tool for building wealth. Maximize employer match first, then work toward maxing out contributions as your income grows.`
        },
        'Margin Account': {
            title: 'Margin Account - Advanced Trading',
            content: `A margin account is a specialized brokerage account that allows you to borrow money from your broker to invest, using leverage to amplify potential gains (and losses). This is an advanced investing tool that requires experience and risk tolerance.

WHAT IS A MARGIN ACCOUNT?

A margin account lets you borrow up to 50% of the purchase price of securities. This borrowed money is called "margin," and your securities serve as collateral for the loan.

Example: With $10,000 cash, you can buy up to $20,000 worth of stock using 50% margin. If the stock goes up 10%, you gain $2,000 on your $10,000 investment (20% return). However, if it drops 10%, you lose $2,000 (20% loss).

KEY FEATURES

• Buying Power: Borrow up to 50% of purchase price for stocks
• Leverage: Control larger positions with less capital
• Margin Interest: Pay interest on borrowed funds (typically 5-12% annually)
• Collateral: Your securities serve as loan collateral
• Maintenance Requirement: Must maintain minimum account equity (usually 25-30%)
• Short Selling: Ability to profit from declining stock prices

MARGIN REQUIREMENTS

Initial Margin: 50% of purchase price must be your cash
Maintenance Margin: Account equity must stay above 25-30% of total value

Example Calculation:
• Buy $20,000 stock with $10,000 cash + $10,000 margin
• If stock drops to $13,000, your equity = $3,000 ($13,000 - $10,000 loan)
• Equity ratio = 23% ($3,000 / $13,000) - Below 25% triggers margin call

MARGIN CALLS

A margin call occurs when your account equity falls below the maintenance requirement. When this happens:

1. Broker notifies you immediately
2. You must either:
   • Deposit more cash
   • Sell securities to reduce loan
   • Add more securities as collateral
3. If you don't act quickly, broker can liquidate your positions without warning

MARGIN INTEREST COSTS

• Charged daily on borrowed amount
• Rates vary by broker and account balance
• Typical rates: 5-12% annually
• No interest charged on unused margin credit

Example: Borrow $10,000 at 8% annual rate = $800/year or $67/month in interest costs.

RISKS OF MARGIN TRADING

1. Amplified Losses
• Can lose more than your initial investment
• Losses magnified by leverage
• No limit to potential losses

2. Forced Liquidation
• Broker can sell your holdings without permission
• May happen during worst possible market timing
• Could realize losses you weren't ready to take

3. Interest Costs
• Borrowing costs eat into returns
• Must earn enough to cover interest expense
• Costs accumulate daily

4. Emotional Stress
• Increased volatility in account value
• Pressure from margin calls
• Can lead to poor decision-making

5. Market Volatility
• Sharp market declines trigger margin calls
• Flash crashes can wipe out positions
• Gaps in price can exceed stop-loss orders

WHEN MARGIN MIGHT BE APPROPRIATE

✓ You're an experienced trader
✓ You have stable income to cover potential losses
✓ You understand technical analysis and risk management
✓ You have a proven track record of profitable trading
✓ You can monitor positions frequently
✓ You have emergency funds separate from trading account
✓ You accept the risk of losing more than your initial investment

MARGIN TRADING STRATEGIES

1. Short-term Trading
• Day trading or swing trading
• Take advantage of short-term price movements
• Close positions before interest costs accumulate

2. Hedging
• Protect long positions with short sales
• Reduce portfolio volatility
• Requires sophisticated strategy

3. Portfolio Diversification
• Maintain exposure while accessing cash
• Avoid selling long-term holdings
• Use sparingly and short-term only

ALTERNATIVES TO MARGIN

Before using margin, consider these options:
• Save more cash to invest
• Use options strategies (defined risk)
• Invest in leveraged ETFs (built-in leverage)
• Paper trade to test strategies
• Start with smaller positions

BROKER COMPARISON

Different brokers offer different margin rates:
• Interactive Brokers: 5.83% - 6.83%
• Charles Schwab: 12.00% - 13.00%
• Fidelity: 11.57% - 13.32%
• TD Ameritrade: 12.00% - 13.00%

Lower rates save money but rates change frequently.

GETTING STARTED (IF YOU MUST)

1. Gain 2+ years of trading experience first
2. Understand all risks thoroughly
3. Apply for margin approval with broker
4. Start with small positions (10-20% of account)
5. Set strict stop-loss orders
6. Never use full margin capacity
7. Have exit strategy before entering trade
8. Keep detailed trading journal

RED FLAGS - DON'T USE MARGIN IF:

× You're new to investing
× You don't understand how margin works
× You're investing for retirement
× You can't afford to lose the money
× You're emotional about money
× You don't check accounts daily
× You're following "hot tips"
× You're trying to "get rich quick"

FINAL WARNING

Most professional traders avoid margin or use it very sparingly. Warren Buffett has said: "When you combine ignorance and leverage, you get some pretty interesting results."

Margin trading is not investing - it's speculation with borrowed money. The vast majority of individual investors should never use margin accounts. Stick with cash accounts and build wealth through consistent, long-term investing in diversified, low-cost index funds.

If you must use margin, treat it like a tool that can cut your hand off. Use it rarely, carefully, and always with a healthy respect for what can go wrong.`
        },
        'ETFs': {
            title: 'ETFs - Exchange-Traded Funds',
            content: `Exchange-Traded Funds (ETFs) are one of the best investment vehicles for building long-term wealth. They combine the diversification of mutual funds with the flexibility of stocks, all while keeping costs low.

WHAT IS AN ETF?

An ETF is a basket of securities (stocks, bonds, commodities, etc.) that trades on an exchange like a stock. When you buy one share of an ETF, you own a small piece of all the underlying assets.

Example: One share of VTI (Vanguard Total Stock Market ETF) gives you ownership in over 3,500 U.S. companies.

KEY FEATURES

• Trades like a stock: Buy and sell throughout trading day at market prices
• Diversification: Own hundreds or thousands of securities in one investment
• Low costs: Expense ratios typically 0.03% - 0.20%
• Transparency: Holdings disclosed daily
• Tax efficient: Generally more tax-efficient than mutual funds
• Fractional shares: Many brokers now offer fractional ETF shares
• No minimum investment: Buy one share at a time (or less)

TYPES OF ETFs

1. Stock ETFs
• Broad market: Total stock market, S&P 500
• Sector-specific: Technology, healthcare, energy
• International: Developed markets, emerging markets
• Size-based: Large-cap, mid-cap, small-cap

2. Bond ETFs
• Government bonds: Treasury bonds, municipal bonds
• Corporate bonds: Investment-grade, high-yield
• Total bond market: Diversified bond portfolio
• International bonds: Global bond exposure

3. Commodity ETFs
• Gold, silver, oil, agriculture
• Track physical commodity prices
• Alternative to owning physical commodities

4. Specialty ETFs
• Real estate (REITs)
• Target-date funds
• ESG (Environmental, Social, Governance)
• Factor-based (value, growth, dividend)

ADVANTAGES OF ETFs

✓ Low Cost
• Average expense ratio: 0.15%
• Some as low as 0.03%
• No load fees or sales charges

✓ Instant Diversification
• One purchase = hundreds of companies
• Reduces individual stock risk
• Builds well-rounded portfolio

✓ Flexibility
• Trade anytime during market hours
• Set limit orders and stop losses
• Use in any brokerage account

✓ Tax Efficiency
• Lower capital gains distributions
• "In-kind" creation/redemption process
• Tax-loss harvesting opportunities

✓ Transparency
• See all holdings daily
• Track performance easily
• Understand what you own

DISADVANTAGES TO CONSIDER

× Trading costs (if frequent trading)
× Bid-ask spreads on low-volume ETFs
× May trade at premium/discount to NAV
× Can't set automatic investments as easily
× Temptation to trade too frequently

POPULAR ETFs FOR BEGINNERS

Total Market:
• VTI (Vanguard Total Stock Market) - 0.03%
• ITOT (iShares Core S&P Total Market) - 0.03%

S&P 500:
• VOO (Vanguard S&P 500) - 0.03%
• SPY (SPDR S&P 500) - 0.09%
• IVV (iShares Core S&P 500) - 0.03%

International:
• VXUS (Vanguard Total International Stock) - 0.07%
• IXUS (iShares Core Total International) - 0.07%

Bonds:
• BND (Vanguard Total Bond Market) - 0.03%
• AGG (iShares Core U.S. Aggregate Bond) - 0.03%

BUILDING AN ETF PORTFOLIO

Simple Three-Fund Portfolio:
1. 60% VTI (Total U.S. Stock Market)
2. 30% VXUS (Total International Stock)
3. 10% BND (Total Bond Market)

Expense ratio: ~0.04% (just $4 per year on $10,000)

Aggressive Growth (20s-30s):
• 70% U.S. Stocks (VTI)
• 20% International Stocks (VXUS)
• 10% Bonds (BND)

Balanced (40s-50s):
• 50% U.S. Stocks (VTI)
• 25% International Stocks (VXUS)
• 25% Bonds (BND)

Conservative (Near retirement):
• 30% U.S. Stocks (VTI)
• 20% International Stocks (VXUS)
• 50% Bonds (BND)

HOW TO INVEST IN ETFs

1. Open brokerage account (Fidelity, Vanguard, Charles Schwab)
2. Fund your account
3. Search for ETF ticker symbol
4. Place order (market or limit)
5. Hold long-term (don't trade frequently)
6. Rebalance annually

ACTIVE VS PASSIVE ETFs

Passive ETFs (Recommended):
• Track an index (S&P 500, Total Market)
• Lower costs (0.03% - 0.10%)
• Consistent performance
• Tax efficient

Active ETFs:
• Manager picks investments
• Higher costs (0.50% - 1.00%+)
• Try to beat market (most fail)
• Less tax efficient

COMMON MISTAKES TO AVOID

× Choosing actively managed ETFs with high fees
× Trading too frequently (stay invested)
× Buying niche/trendy sector ETFs
× Ignoring expense ratios
× Not understanding what ETF holds
× Chasing past performance
× Over-diversifying (too many ETFs)

ETF VS INDIVIDUAL STOCKS

ETFs:
✓ Instant diversification
✓ Lower risk
✓ Consistent returns
✓ Less research required
✓ Better for most investors

Individual Stocks:
× Higher risk
× More research required
× Potential for higher returns
× Can lose entire investment
× Best for experienced investors

EXPENSE RATIOS MATTER

Over 30 years, $10,000 invested growing at 7% annually:

• 0.03% expense ratio = $74,872
• 0.50% expense ratio = $66,789
• 1.00% expense ratio = $59,345

Lower fees = $15,527 more money!

KEY TAKEAWAYS

• ETFs are ideal for long-term wealth building
• Stick with low-cost, broad market index ETFs
• VTI, VOO, VXUS, and BND cover most needs
• Expense ratios below 0.20% are essential
• Buy and hold for decades, not days
• Avoid active management and high fees
• Simple three-fund portfolio beats complex strategies

Remember: The best ETF portfolio is one you can stick with through market ups and downs. Keep it simple, keep costs low, and stay invested for the long term.`
        },
        'Mutual Funds': {
            title: 'Mutual Funds - Professional Management',
            content: `Mutual funds are professionally managed investment portfolios that pool money from many investors to purchase a diversified mix of stocks, bonds, or other securities. They've been the foundation of retirement investing for decades.

WHAT IS A MUTUAL FUND?

A mutual fund is a pooled investment where a professional manager buys and sells securities on behalf of all investors in the fund. Each investor owns shares that represent a portion of the fund's holdings.

Unlike ETFs, mutual funds only trade once per day after market close at the Net Asset Value (NAV) price.

KEY FEATURES

• Professional management: Expert managers make investment decisions
• Diversification: Instant access to diversified portfolio
• Accessibility: Easy to invest in through 401(k) and IRAs
• Automatic investing: Set up recurring purchases easily
• Fractional shares: Invest any dollar amount
• No trading during day: Price set once at market close

TYPES OF MUTUAL FUNDS

1. Stock Funds
• Growth funds: Focus on capital appreciation
• Value funds: Undervalued companies
• Blend funds: Mix of growth and value
• Index funds: Track specific market index
• Sector funds: Specific industry focus

2. Bond Funds
• Government bond funds
• Corporate bond funds
• Municipal bond funds
• High-yield bond funds
• Total bond market funds

3. Balanced/Hybrid Funds
• Mix of stocks and bonds
• Target-date funds: Adjust allocation over time
• Asset allocation funds: Fixed mix maintained

4. International Funds
• Developed markets
• Emerging markets
• Global funds (including U.S.)
• Regional funds (Asia, Europe, etc.)

INDEX FUNDS VS ACTIVELY MANAGED

Index Funds (Recommended):
• Track market index (S&P 500, Total Market)
• Lower fees (0.03% - 0.20%)
• Consistent returns matching market
• No manager risk
• Tax efficient

Example: VTSAX (Vanguard Total Stock Market Index)
• Expense ratio: 0.04%
• Owns 3,500+ companies
• Tracks total U.S. market

Actively Managed:
• Manager tries to beat market
• Higher fees (0.50% - 2.00%+)
• 80-90% underperform index over time
• Manager risk (turnover, bad decisions)
• Less tax efficient

FUND EXPENSES - CRITICAL TO UNDERSTAND

Expense Ratio:
• Annual fee as percentage of assets
• Automatically deducted from returns
• 0.03% = $3 per year per $10,000
• 1.00% = $100 per year per $10,000

Load Fees (AVOID):
• Front-end load: Fee to buy (up to 5.75%)
• Back-end load: Fee to sell
• No-load funds: No sales charges (choose these!)

Other Fees:
• 12b-1 fees: Marketing/distribution (avoid)
• Redemption fees: Early selling penalties
• Transaction fees: Per purchase charge

ADVANTAGES OF MUTUAL FUNDS

✓ Easy Automatic Investing
• Set up recurring investments easily
• Dollar-cost averaging made simple
• Perfect for 401(k) and IRA contributions

✓ Professional Management
• Expert oversight (for actively managed)
• Research and analysis included
• Portfolio rebalancing handled

✓ Proven Track Record
• Decades of performance history
• Well-regulated by SEC
• Transparent reporting

✓ Access in Retirement Accounts
• Standard offering in 401(k) plans
• Available in all IRAs
• Employer matching programs

✓ No Trading Temptation
• Can't trade during day
• Reduces emotional decisions
• Encourages long-term thinking

DISADVANTAGES

× Higher fees (often)
× Trade only once daily
× May have minimum investments ($1,000 - $3,000)
× Less tax efficient than ETFs
× Potential for unwanted capital gains distributions
× Can't use limit orders

BEST MUTUAL FUNDS FOR BEGINNERS

Vanguard (Lowest Costs):
• VTSAX - Total Stock Market (0.04%)
• VTIAX - Total International Stock (0.11%)
• VBTLX - Total Bond Market (0.05%)
• Target Retirement Funds (0.08%)

Fidelity (Zero expense ratio options):
• FZROX - Total Market Index (0.00%)
• FZILX - International Index (0.00%)
• FXNAX - U.S. Bond Index (0.025%)

Schwab:
• SWTSX - Total Stock Market (0.03%)
• SWISX - International Index (0.06%)
• SWAGX - U.S. Aggregate Bond (0.04%)

TARGET-DATE FUNDS

Popular "set it and forget it" option:

How They Work:
• Choose fund based on retirement year
• Example: "Target Retirement 2060 Fund"
• Automatically adjusts allocation over time
• Starts aggressive, becomes conservative

Pros:
✓ Complete portfolio in one fund
✓ Automatic rebalancing
✓ Professional management
✓ Simple for beginners

Cons:
× Higher expense ratios (0.08% - 1.00%)
× One-size-fits-all approach
× Less control over allocation

BUILDING A MUTUAL FUND PORTFOLIO

Classic Three-Fund Portfolio:
1. 60% Total U.S. Stock Market Fund (VTSAX)
2. 30% Total International Stock Fund (VTIAX)
3. 10% Total Bond Market Fund (VBTLX)

Total expense ratio: ~0.05%

Alternative - Single Target-Date Fund:
• Choose date closest to retirement
• Example: Vanguard Target Retirement 2060
• All-in-one solution

MUTUAL FUNDS IN YOUR 401(K)

What to look for:
✓ Index funds with expense ratios under 0.20%
✓ No-load funds
✓ Broad market exposure
✓ Target-date funds as simple option

What to avoid:
× Actively managed funds with fees over 0.50%
× Funds with front-end or back-end loads
× Niche sector funds
× Funds with high turnover

HOW TO INVEST IN MUTUAL FUNDS

1. Open account with fund company or brokerage
2. Meet minimum investment (often $1,000 - $3,000)
3. Set up automatic monthly investments
4. Invest consistently regardless of market
5. Hold for long term (years or decades)
6. Rebalance annually

MUTUAL FUNDS VS ETFs

Mutual Funds Better For:
✓ Automatic recurring investments
✓ 401(k) plans
✓ Those who want to avoid trading temptation
✓ Set-it-and-forget-it investors

ETFs Better For:
✓ Lower expense ratios
✓ Tax efficiency in taxable accounts
✓ Trading flexibility
✓ No minimum investment requirements

COMMON MISTAKES TO AVOID

× Choosing actively managed funds with high fees
× Paying load fees (always choose no-load)
× Chasing past performance
× Holding too many similar funds
× Ignoring expense ratios
× Selling during market downturns
× Not utilizing employer 401(k) match

THE POWER OF LOW FEES

$10,000 invested for 30 years at 7% annual return:

• 0.04% expense ratio = $75,280
• 0.50% expense ratio = $66,789
• 1.00% expense ratio = $59,345
• 2.00% expense ratio = $46,935

High fees cost you $28,345 over 30 years!

KEY TAKEAWAYS

• Index mutual funds are excellent for long-term wealth building
• Keep expense ratios below 0.20% (ideally under 0.10%)
• Avoid load fees entirely - choose no-load funds
• Vanguard, Fidelity, and Schwab offer best low-cost options
• Target-date funds work well for hands-off investors
• Perfect for 401(k) and IRA automatic investing
• Buy and hold for decades, not years
• Simple three-fund portfolio beats complex strategies

FINAL ADVICE

Whether you choose mutual funds or ETFs, the most important factors are:
1. Low costs (expense ratios under 0.20%)
2. Broad diversification
3. Consistent investing
4. Long-term holding
5. Ignoring short-term market noise

Most investors will do well with a simple portfolio of low-cost index mutual funds, contributing regularly, and staying invested through market ups and downs. It's not exciting, but it works.`
        },
        'Investment Strategies': {
            title: 'Investment Strategies for Success',
            content: `Building wealth through investing requires understanding key strategies and principles. Here's your guide to smart investing across all account types.

FUNDAMENTAL PRINCIPLES

1. Start Early
• Time is your greatest asset
• Compound growth accelerates over decades
• Even small amounts matter when started early

2. Diversification
• Don't put all eggs in one basket
• Spread investments across asset classes
• Reduces risk without sacrificing returns

3. Low-Cost Index Funds
• Beat most active managers over time
• Expense ratios matter (aim for <0.20%)
• Examples: S&P 500 index funds, total market funds

4. Dollar-Cost Averaging
• Invest consistently regardless of market conditions
• Reduces impact of market volatility
• Removes emotion from investing decisions

ASSET ALLOCATION BY AGE

In Your 20s:
• 90% stocks / 10% bonds
• Maximize growth potential
• Can weather market volatility

In Your 30s-40s:
• 80% stocks / 20% bonds
• Balance growth with stability
• Maintain aggressive approach

In Your 50s:
• 70% stocks / 30% bonds
• Begin reducing risk
• Preserve accumulated wealth

ACCOUNT PRIORITY ORDER

1. 401(k) up to employer match (free money!)
2. Pay off high-interest debt (credit cards)
3. Emergency fund (3-6 months expenses)
4. Max out Roth IRA ($7,000/year)
5. Max out 401(k) ($23,000/year)
6. Invest in taxable brokerage account

COMMON MISTAKES TO AVOID

× Trying to time the market (impossible consistently)
× Paying high fees for active management
× Panic selling during downturns
× Not taking advantage of employer match
× Keeping too much in cash (inflation erodes value)
× Over-concentrating in single stocks
× Ignoring tax optimization strategies

INVESTMENT OPTIONS FOR BEGINNERS

Target-Date Funds:
• Automatically adjusts allocation as you age
• Example: Target Date 2060 Fund for 2060 retirement
• Set it and forget it approach

Index Funds to Consider:
• Total Stock Market Index (VTI, VTSAX)
• S&P 500 Index (VOO, VFIAX)
• Total Bond Market Index (BND, VBTLX)
• International Stock Index (VXUS, VTIAX)

BUILDING YOUR PORTFOLIO

Simple Three-Fund Portfolio:
• 60% Total US Stock Market
• 30% Total International Stock Market
• 10% Total Bond Market

This provides global diversification, low costs, and easy maintenance.

STAYING THE COURSE

• Markets will fluctuate - that's normal
• Focus on time in the market, not timing the market
• Rebalance annually to maintain target allocation
• Increase contributions when possible
• Stay invested through downturns (they're buying opportunities)

Remember: Investing is a marathon, not a sprint. Consistency, discipline, and patience are more important than trying to find the "perfect" investment or timing.`
        }
    };
    return content[accountType as keyof typeof content] || { title: accountType, content: 'Information not available.' };
};

export default function InvestingLiteracyScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedContent, setSelectedContent] = useState({ title: '', content: '' });

    const handleGoBack = () => {
        router.back();
    };

    const handleReadMore = (accountType: string) => {
        const content = getExpandedContent(accountType);
        setSelectedContent(content);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <PageLayout title="Investing Accounts">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View className="py-6 flex-1">
                    {/* Guide Cards Grid */}
                    <View className="gap-4 flex-1">
                        <GuideCard
                            icon={<PiggyBank size={40} color="#dc2626" />}
                            iconBgColor="bg-red-100"
                            title="Roth IRA"
                            description="Tax-free growth and withdrawals"
                            onPress={() => handleReadMore('Roth IRA')}
                        />
                        <GuideCard
                            icon={<TrendingUp size={40} color="#db2777" />}
                            iconBgColor="bg-pink-100"
                            title="Traditional IRA"
                            description="Tax-deferred individual retirement"
                            onPress={() => handleReadMore('Traditional IRA')}
                        />
                        <GuideCard
                            icon={<Building2 size={40} color="#ea580c" />}
                            iconBgColor="bg-orange-100"
                            title="401(k)"
                            description="Employer-sponsored retirement plan"
                            onPress={() => handleReadMore('401(k)')}
                        />
                        <GuideCard
                            icon={<BarChart3 size={40} color="#0891b2" />}
                            iconBgColor="bg-cyan-100"
                            title="ETFs"
                            description="Low-cost diversified investing"
                            onPress={() => handleReadMore('ETFs')}
                        />
                        <GuideCard
                            icon={<FolderOpen size={40} color="#8b5cf6" />}
                            iconBgColor="bg-violet-100"
                            title="Mutual Funds"
                            description="Professional portfolio management"
                            onPress={() => handleReadMore('Mutual Funds')}
                        />
                        <GuideCard
                            icon={<Wallet size={40} color="#1e40af" />}
                            iconBgColor="bg-blue-100"
                            title="Margin Account"
                            description="Advanced trading with leverage"
                            onPress={() => handleReadMore('Margin Account')}
                        />
                        <GuideCard
                            icon={<LineChart size={40} color="#059669" />}
                            iconBgColor="bg-emerald-100"
                            title="Investment Strategies"
                            description="Build wealth over time"
                            onPress={() => handleReadMore('Investment Strategies')}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Modal for expanded content */}
            <Modal isOpen={isModalVisible} onClose={closeModal}>
                <ModalBackdrop />
                <ModalContent className="max-w-[90%] max-h-[80%] rounded-xl">
                    <ModalHeader>
                        <Heading size="lg">{selectedContent.title}</Heading>
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text className="text-base text-gray-700 leading-6 text-left">{selectedContent.content}</Text>
                        </ScrollView>
                    </ModalBody>
                    <ModalFooter>
                        <TextButton
                            label="Close"
                            onPress={closeModal}
                            variant="primary"
                            className="bg-red-600"
                            textClassName="text-white"
                        />
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </PageLayout>
    );
}



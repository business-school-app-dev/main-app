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
import { PiggyBank, TrendingUp, Wallet, LineChart, Briefcase, Building2 } from 'lucide-react-native';

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
        variant="primary"
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
    'Brokerage & Margin Accounts': {
      title: 'Brokerage & Margin Accounts',
      content: `Brokerage and margin accounts offer flexibility for investing outside of retirement accounts. They have different rules and advantages compared to IRAs and 401(k)s.

STANDARD BROKERAGE ACCOUNT

A taxable investment account with no contribution limits or withdrawal restrictions.

Features:
• No contribution limits: Invest as much as you want
• No withdrawal restrictions: Access your money anytime
• Tax treatment: Pay capital gains tax on profits when you sell
• Investment options: Stocks, bonds, ETFs, mutual funds, options, and more
• Flexibility: Use for any goal (not just retirement)

Tax Benefits:
• Long-term capital gains (held >1 year): Taxed at 0%, 15%, or 20%
• Tax-loss harvesting: Offset gains with losses to reduce taxes
• Step-up basis: Heirs receive assets at current value (no capital gains tax)

MARGIN ACCOUNT

A brokerage account that allows you to borrow money from your broker to invest (leverage).

Features:
• Buying power: Borrow up to 50% of purchase price for stocks
• Margin interest: Pay interest on borrowed funds (varies by broker)
• Increased risk: Losses are magnified, and you can lose more than you invest
• Margin calls: Must add funds if account value drops too low
• Not for beginners: Requires experience and risk tolerance

Margin Trading Risks:
• Amplified losses: Can lose more than your initial investment
• Interest costs: Borrowing money costs money
• Forced liquidation: Broker can sell your holdings if you don't meet margin requirements
• Market volatility: Sharp declines can trigger margin calls

WHEN TO USE EACH

Standard Brokerage:
✓ After maxing out retirement accounts
✓ Saving for medium-term goals (5-10 years)
✓ Want flexibility to access funds
✓ Building wealth outside retirement

Margin Account:
✓ Experienced investors only
✓ Short-term trading strategies
✓ Understand and accept higher risk
✓ Have stable income to cover potential losses

GETTING STARTED WITH BROKERAGE

1. Open account with reputable broker (Fidelity, Vanguard, Charles Schwab, Robinhood)
2. Start with standard account (not margin) until experienced
3. Invest in diversified, low-cost index funds
4. Hold investments long-term to minimize taxes
5. Consider tax-loss harvesting at year-end

CAUTION: Only use margin if you fully understand the risks. Most investors should avoid margin trading and stick with standard brokerage accounts for long-term wealth building.`
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
              icon={<TrendingUp size={40} color="#16a34a" />}
              iconBgColor="bg-green-100"
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
              icon={<Wallet size={40} color="#1e40af" />}
              iconBgColor="bg-blue-100"
              title="Brokerage & Margin Accounts"
              description="Flexible investing options"
              onPress={() => handleReadMore('Brokerage & Margin Accounts')}
            />
            <GuideCard
              icon={<LineChart size={40} color="#7c3aed" />}
              iconBgColor="bg-purple-100"
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



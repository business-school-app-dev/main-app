import React, { useState } from 'react';
import { ScrollView, Pressable, View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
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
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';

// Icon components for the cards
const CreditCardIcon = () => (
    <View style={styles.iconContainer}>
        <View style={[styles.creditCardBase, { backgroundColor: '#3B82F6' }]}>
            <View style={styles.creditCardLine} />
        </View>
    </View>
);

const TrendingUpIcon = () => (
    <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
        <View style={styles.chartContainer}>
            <View style={[styles.chartBar, { height: 12, backgroundColor: '#16A34A' }]} />
            <View style={[styles.chartBar, { height: 20, backgroundColor: '#16A34A', marginLeft: 4 }]} />
            <View style={[styles.chartBar, { height: 28, backgroundColor: '#16A34A', marginLeft: 4 }]} />
            <View style={[styles.chartBar, { height: 32, backgroundColor: '#16A34A', marginLeft: 4 }]} />
        </View>
    </View>
);

const ShieldIcon = () => (
    <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
        <View style={styles.shield} />
    </View>
);

const BookIcon = () => (
    <View style={[styles.iconContainer, { backgroundColor: '#FED7AA' }]}>
        <View style={styles.book}>
            <View style={styles.bookLine} />
            <View style={[styles.bookLine, { top: 10 }]} />
            <View style={[styles.bookLine, { top: 16 }]} />
            <View style={[styles.bookLine, { top: 22 }]} />
        </View>
    </View>
);

interface GuideCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress: () => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ icon, title, description, onPress }) => (
    <View style={styles.card}>
        {icon}
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Read More</Text>
        </TouchableOpacity>
    </View>
);

// Expanded content for each card type
const getExpandedContent = (cardType: string) => {
    const content = {
        'Credit Card Basics': {
            title: 'Credit Card Basics',
            content: `Credit cards are financial tools that allow you to borrow money from a bank or financial institution to make purchases. Here are the key concepts you should understand:

• Credit Limit: The maximum amount you can borrow on your card
• Interest Rate (APR): The cost of borrowing money, expressed as an annual percentage
• Minimum Payment: The smallest amount you must pay each month
• Grace Period: Time between purchase and when interest starts accruing
• Credit Score Impact: How your card usage affects your creditworthiness

Benefits of credit cards include building credit history, earning rewards, fraud protection, and convenience for online purchases. However, it's important to use them responsibly to avoid debt accumulation.`
        },
        'Building Credit': {
            title: 'Building Credit',
            content: `Building good credit takes time and consistent responsible behavior. Here are proven strategies to establish and improve your credit score:

• Pay on time, every time: Payment history is 35% of your credit score
• Keep balances low: Use less than 30% of your available credit limit
• Don't close old accounts: Length of credit history matters
• Limit new credit applications: Too many inquiries can hurt your score
• Monitor your credit report: Check for errors and dispute them promptly
• Consider becoming an authorized user on someone else's account

Start with a secured credit card or student card if you're new to credit. Be patient - building excellent credit typically takes 6+ months of responsible use.`
        },
        'Security Tips': {
            title: 'Security Tips',
            content: `Protecting your credit card information is crucial in today's digital world. Follow these security best practices:

• Never share your card details via email, text, or phone unless you initiated the contact
• Use secure websites (look for https://) when shopping online
• Monitor your statements regularly for unauthorized charges
• Set up account alerts for transactions and payments
• Cover your PIN when entering it in public
• Don't store card info on shared or public computers
• Report lost or stolen cards immediately
• Use contactless payments when possible
• Be cautious with public WiFi for financial transactions

If you notice suspicious activity, contact your card issuer immediately. Most banks offer zero liability protection for fraudulent charges.`
        },
        'Responsible Use': {
            title: 'Responsible Use',
            content: `Responsible credit card management helps you build wealth and avoid debt traps. Here are essential practices:

• Create a budget and stick to it
• Only charge what you can afford to pay off in full
• Pay your full balance each month to avoid interest charges
• Set up automatic payments for at least the minimum amount
• Use credit cards for planned purchases, not impulse buys
• Take advantage of rewards programs that match your spending
• Read and understand your card's terms and conditions
• Don't use credit cards for cash advances (high fees apply)
• Keep your credit utilization below 30% of your limit

Remember: Credit cards are tools to build credit and earn rewards, not extensions of your income. Living within your means is the foundation of financial health.`
        }
    };
    return content[cardType as keyof typeof content] || { title: cardType, content: 'Information not available.' };
};

export default function CreditCardsScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedContent, setSelectedContent] = useState({ title: '', content: '' });

    const handleGoBack = () => {
        router.back();
    };

    const handleReadMore = (cardType: string) => {
        const content = getExpandedContent(cardType);
        setSelectedContent(content);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleGoBack} style={styles.backButton}>
                    <ChevronLeftIcon style={styles.backIcon} />
                </Pressable>
                <Text style={styles.headerTitle}>Credit Cards</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Section Title */}
                    <Text style={styles.sectionTitle}>Quick Guides & Resources</Text>

                    {/* Guide Cards Grid */}
                    <View style={styles.gridContainer}>
                        <View style={styles.gridRow}>
                            <GuideCard
                                icon={<CreditCardIcon />}
                                title="Credit Card Basics"
                                description="Learn how credit cards work and their benefits"
                                onPress={() => handleReadMore('Credit Card Basics')}
                            />
                            <GuideCard
                                icon={<TrendingUpIcon />}
                                title="Building Credit"
                                description="Tips for establishing and improving credit score"
                                onPress={() => handleReadMore('Building Credit')}
                            />
                        </View>

                        <View style={styles.gridRow}>
                            <GuideCard
                                icon={<ShieldIcon />}
                                title="Security Tips"
                                description="Keep your credit card information safe"
                                onPress={() => handleReadMore('Security Tips')}
                            />
                            <GuideCard
                                icon={<BookIcon />}
                                title="Responsible Use"
                                description="Best practices for credit card management"
                                onPress={() => handleReadMore('Responsible Use')}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Modal for expanded content */}
            <Modal isOpen={isModalVisible} onClose={closeModal}>
                <ModalBackdrop />
                <ModalContent className="max-w-[90%] max-h-[80%]">
                    <ModalHeader>
                        <Heading size="lg">{selectedContent.title}</Heading>
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalText}>{selectedContent.content}</Text>
                        </ScrollView>
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={closeModal} className="bg-red-600">
                            <ButtonText className="text-white">Close</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        marginRight: 16,
        padding: 4,
    },
    backIcon: {
        width: 20,
        height: 20,
        color: '#DC2626',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 24,
    },
    gridContainer: {
        gap: 16,
    },
    gridRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        flex: 1,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginTop: 12,
        marginBottom: 6,
    },
    cardDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DBEAFE',
    },
    creditCardBase: {
        width: 32,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#1E40AF',
        justifyContent: 'flex-end',
        paddingBottom: 4,
        paddingLeft: 4,
    },
    creditCardLine: {
        width: 24,
        height: 4,
        backgroundColor: '#93C5FD',
        borderRadius: 2,
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 32,
    },
    chartBar: {
        width: 6,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    shield: {
        width: 24,
        height: 32,
        backgroundColor: '#7C3AED',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    book: {
        width: 24,
        height: 32,
        backgroundColor: '#EA580C',
        borderRadius: 2,
        position: 'relative',
    },
    bookLine: {
        position: 'absolute',
        left: 4,
        right: 4,
        height: 2,
        backgroundColor: '#FED7AA',
        top: 4,
    },
    modalText: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
        textAlign: 'left',
    },
});

// ============================================================================
// LEADERBOARD API MODULE
// ============================================================================
// Handles all leaderboard-related API calls and cooldown logic
// Includes: fetching top 10, fetching user stats, checking daily cooldown

import { User } from "@/types/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Animated } from "react-native";
import { checkQuizCooldown } from "./quiz";

// ============================================================================
// FETCH TOP 10 LEADERBOARD
// ============================================================================
// Fetches the top 10 users ranked by score (highest to lowest)
// Used in: Leaderboard screen display
export const fetchLeaderboard = async (retries = 3, delay = 1000): Promise<User[]> => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/topten`);
    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }
    const data = await response.json();
    if (data.success) {
      // Transform backend data to app format
      // Backend returns: { users: [{ username, score }, ...] }
      // App expects: { rank, name, score }
      return data.users.map((user: any, index: number) => ({
        rank: index + 1,           // Rank 1-10
        name: user.username,       // Username
        score: user.score,         // Total trophies/points
      }));
    }
    return [];
  } catch (error: any) {
    // Retry with exponential backoff (1s → 2s → 4s)
    if (retries === 0) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchLeaderboard(retries - 1, delay * 2);
  }
};

// ============================================================================
// FETCH CURRENT USER STATS
// ============================================================================
// Fetches current logged-in user's rank and score
// Used in: Profile/stats display
export const fetchCurrentUser = async (username: string, retries = 3, delay = 1000): Promise<User | null> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/challenges/user-stats?username=${encodeURIComponent(username)}`
    );
    if (!response.ok) {
      if (response.status === 404) return null; // User doesn't exist
      throw new Error("Failed to fetch user stats");
    }
    const data = await response.json();
    if (data.success && data.user) {
      // Transform backend data to app format
      return {
        rank: data.user.rank,      // User's rank (1 = top)
        name: data.user.username,  // Username
        score: data.user.score,    // Total trophies
      };
    }
    return null;
  } catch (error: any) {
    // Retry with exponential backoff
    if (retries === 0) {
      console.error("Error fetching current user:", error);
      return null;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchCurrentUser(username, retries - 1, delay * 2);
  }
};

// ============================================================================
// QUIZ BUTTON HANDLER - CHECK COOLDOWN & NAVIGATE
// ============================================================================
// Called when user taps "Daily Quiz" button
// Checks if they can take the quiz (daily cooldown enforcement)
// If can play: navigate to quiz screen
// If can't play: show modal with when they can play next
export const handleQuizButtonPress = async (
  setShowCooldownModal: (show: boolean) => void,  // Callback to show modal
  setCooldownMessage: (message: string) => void   // Callback to set modal message
) => {
  try {
    // Get the username from last quiz submission
    const lastUsername = await AsyncStorage.getItem("lastQuizUsername");

    // If we have a username, check if they can play
    if (lastUsername) {
      const cooldownStatus = await checkQuizCooldown(lastUsername);

      if (!cooldownStatus.canPlay) {
        // User is on cooldown - show modal with when they can play again
        setCooldownMessage(cooldownStatus.message);
        setShowCooldownModal(true);
        return; // Don't navigate to quiz
      }
    }

    // If can play (no username or cooldown passed), navigate to quiz
    router.push("/quiz");
  } catch (err) {
    console.error("Error checking cooldown:", err);
    // FAIL-OPEN: If cooldown check fails, allow user to try quiz anyway
    router.push("/quiz");
  }
};

// ============================================================================
// SIGN OUT HANDLER
// ============================================================================
// Called when user logs out
// Clears the stored username so next quiz attempt won't check cooldown
export const handleSignOut = async (
  setCurrentUser: (user: User | null) => void  // Callback to clear user state
) => {
  try {
    // Remove stored username for cooldown checking
    await AsyncStorage.removeItem("lastQuizUsername");
    // Clear current user from UI
    setCurrentUser(null);
  } catch (error) {
    console.error("Error clearing quiz username:", error);
  }
};

// ============================================================================
// ANIMATION HELPER - CARD TRANSITION
// ============================================================================
// Animates leaderboard card transitions (fade in/scale)
export const animateCardTransition = (
  cardFadeAnim: Animated.Value,   // Controls opacity
  cardScaleAnim: Animated.Value   // Controls size
) => {
  // This is the start of the animation setup
  // (rest of implementation would continue below)
};
) => {
  Animated.sequence([
    // Fade out and scale down current card
    Animated.parallel([
      Animated.timing(cardFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardScaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
    // Fade in and scale up new card
    Animated.parallel([
      Animated.timing(cardFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(cardScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]),
  ]).start();
};

export const animateQuizButton = (
  isSignedIn: boolean,
  quizButtonFadeAnim: Animated.Value,
  quizButtonSlideAnim: Animated.Value
) => {
  if (isSignedIn) {
    quizButtonFadeAnim.setValue(0);
    quizButtonSlideAnim.setValue(-20);
    Animated.parallel([
      Animated.timing(quizButtonFadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(quizButtonSlideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  } else {
    Animated.timing(quizButtonFadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
};

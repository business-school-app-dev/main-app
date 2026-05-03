import { User } from "@/types/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Animated } from "react-native";
import { checkQuizCooldown } from "./quiz";

export const fetchLeaderboard = async (retries = 3, delay = 1000): Promise<User[]> => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/topten`);
    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }
    const data = await response.json();
    if (data.success) {
      return data.users.map((user: any, index: number) => ({
        rank: index + 1,
        name: user.username,
        score: user.score,
      }));
    }
    return [];
  } catch (error: any) {
    if (retries === 0) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchLeaderboard(retries - 1, delay * 2);
  }
};

export const fetchCurrentUser = async (username: string, retries = 3, delay = 1000): Promise<User | null> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/challenges/user-stats?username=${encodeURIComponent(username)}`
    );
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch user stats");
    }
    const data = await response.json();
    if (data.success && data.user) {
      return {
        rank: data.user.rank,
        name: data.user.username,
        score: data.user.score,
      };
    }
    return null;
  } catch (error: any) {
    if (retries === 0) {
      console.error("Error fetching current user:", error);
      return null;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchCurrentUser(username, retries - 1, delay * 2);
  }
};

export const handleQuizButtonPress = async (
  setShowCooldownModal: (show: boolean) => void,
  setCooldownMessage: (message: string) => void
) => {
  try {
    // Check cooldown before navigating
    const lastUsername = await AsyncStorage.getItem("lastQuizUsername");

    if (lastUsername) {
      const cooldownStatus = await checkQuizCooldown(lastUsername);

      if (!cooldownStatus.canPlay) {
        setCooldownMessage(cooldownStatus.message);
        setShowCooldownModal(true);
        return; // Don't navigate
      }
    }

    // If can play, navigate to quiz
    router.push("/quiz");
  } catch (err) {
    console.error("Error checking cooldown:", err);
    // If error, allow playing
    router.push("/quiz");
  }
};

export const handleSignOut = async (
  setCurrentUser: (user: User | null) => void
) => {
  try {
    await AsyncStorage.removeItem("lastQuizUsername");
    setCurrentUser(null);
  } catch (error) {
    console.error("Error clearing quiz username:", error);
  }
};

export const animateCardTransition = (
  cardFadeAnim: Animated.Value,
  cardScaleAnim: Animated.Value
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

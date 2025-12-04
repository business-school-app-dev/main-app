import React, { useRef, useState } from 'react';
import { View, Text, SafeAreaView, Share, Linking } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import IconButton from '@/components/inputs/icon-button';
import Navbar from '@/components/navigation/navbar';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { PRIMARY } from '@/constants/colors';
import { Spinner } from '@/components/ui/spinner';
import CloseButton from '@/components/inputs/close-button';

const WebViewModal = () => {
  const router = useRouter();
  const { url, title } = useLocalSearchParams<{ url: string; title?: string }>();
  const webViewRef = useRef<WebView>(null);

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [showActionsheet, setShowActionsheet] = useState(false);

  const handleBack = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      webViewRef.current?.goForward();
    }
  };

  const handleRefresh = () => {
    webViewRef.current?.reload();
  };

  const handleOpenActionsheet = () => {
    setShowActionsheet(true);
  };

  const handleCloseActionsheet = () => {
    setShowActionsheet(false);
  };

  const handleOpenInBrowser = async () => {
    try {
      await Linking.openURL(url);
      setShowActionsheet(false);
    } catch (error) {
      console.error('Error opening in browser:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: title ? `${title}\n${url}` : url,
        url: url,
      });
      setShowActionsheet(false);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!url) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text>Error: URL not provided.</Text>
        <IconButton
          iconName="arrow-back"
          variant="link"
          onPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <View className="pb-safe flex-1 bg-primary">
      <Navbar
        title={title || 'WebView'}
        leftView={<CloseButton />}
        rightView={
          <IconButton
            iconName="ellipsis-horizontal"
            variant="link"
            color="white"
            onPress={handleOpenActionsheet}
          />
        }
      />

      <View className="flex-1 relative">
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => {
            setIsLoading(false);
            setIsFirstLoad(false);
          }}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            setCanGoForward(navState.canGoForward);
          }}
          className="flex-1"
        />
        {isLoading && isFirstLoad && (
          <View className="absolute inset-0 items-center justify-center bg-white/50 z-50">
            <Spinner size="large" color={PRIMARY} />
          </View>
        )}
      </View>

      <View className="h-14 flex-row justify-between items-center border-t border-gray-200 bg-primary px-4">
        <View className="flex-row items-center gap-2">
          <IconButton
            iconName="chevron-back"
            variant="link"
            color={canGoBack ? 'white' : '#9ca3af'}
            onPress={canGoBack ? handleBack : () => { }}
          />
          <IconButton
            iconName="chevron-forward"
            variant="link"
            color={canGoForward ? 'white' : '#9ca3af'}
            onPress={canGoForward ? handleForward : () => { }}
          />
        </View>
        <IconButton
          iconName="refresh"
          variant="link"
          color="white"
          onPress={handleRefresh}
        />
      </View>

      <Actionsheet isOpen={showActionsheet} onClose={handleCloseActionsheet}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={handleOpenInBrowser}>
            <ActionsheetItemText className="text-xl">Open in Browser</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleShare}>
            <ActionsheetItemText className="text-xl">Share</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </View>
  );
};

export default WebViewModal;
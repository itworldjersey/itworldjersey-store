import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  BackHandler,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';

const BASE = 'https://itworldjersey.store';

const TABS = [
  { key: 'home', label: 'Home', icon: '🏠', url: `${BASE}/` },
  { key: 'videos', label: 'Categories', icon: '🗂️', url: `${BASE}/videos` },
  { key: 'shop', label: 'Shop', icon: '🛍️', url: `${BASE}/gallery/` },
  { key: 'orders', label: 'My Orders', icon: '📦', url: `${BASE}/custom/` },
  { key: 'profile', label: 'Profile', icon: '👤', url: `${BASE}/live` },
];

export default function App() {
  const [active, setActive] = useState('home');
  const [currentUrl, setCurrentUrl] = useState(TABS[0].url);
  const webRef = useRef(null);
  const canGoBack = useRef(false);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack.current && webRef.current) {
        webRef.current.goBack();
        return true;
      }
      return false;
    });

    return () => subscription.remove();
  }, []);

  const openTab = (tab) => {
    setActive(tab.key);
    setCurrentUrl(tab.url);
    canGoBack.current = false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webRef}
        source={{ uri: currentUrl }}
        style={styles.webView}
        onNavigationStateChange={(navigation) => {
          canGoBack.current = navigation.canGoBack;
          const path = navigation.url.replace(BASE, '').replace(/\/$/, '') || '/';
          const matchingTab = TABS.find((tab) => {
            const tabPath = tab.url.replace(BASE, '').replace(/\/$/, '') || '/';
            return path === tabPath;
          });
          if (matchingTab) setActive(matchingTab.key);
        }}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        setSupportMultipleWindows={false}
        originWhitelist={['https://*']}
        allowsBackForwardNavigationGestures
        startInLoadingState
        renderError={() => (
          <View style={styles.error}>
            <Text style={styles.errorTitle}>Unable to load page</Text>
            <Text style={styles.errorText}>Check your internet connection and try again.</Text>
            <TouchableOpacity
              style={styles.retry}
              onPress={() => webRef.current?.reload()}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active === tab.key }}
            style={styles.tab}
            onPress={() => openTab(tab)}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text style={[styles.label, active === tab.key && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  webView: { flex: 1, backgroundColor: '#000' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0b0b0b',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#333',
    paddingTop: 8,
    paddingBottom: 8,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 18 },
  label: { color: '#888', fontSize: 11, marginTop: 2 },
  activeLabel: { color: '#e53935', fontWeight: 'bold' },
  error: {
    flex: 1,
    backgroundColor: '#080b10',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  errorText: { color: '#aaa', textAlign: 'center', marginTop: 8 },
  retry: {
    marginTop: 18,
    backgroundColor: '#e53935',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '700' },
});

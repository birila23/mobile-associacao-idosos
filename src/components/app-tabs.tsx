import React from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return React.createElement(
    NativeTabs,
    {
      backgroundColor: colors.background,
      indicatorColor: colors.backgroundElement,
      labelStyle: { selected: { color: colors.text } },
    },
    React.createElement(
      NativeTabs.Trigger,
      { name: 'index' },
      React.createElement(NativeTabs.Trigger.Label, null, 'Home'),
      React.createElement(NativeTabs.Trigger.Icon, {
        src: require('@/assets/images/tabIcons/home.png'),
        renderingMode: 'template',
      })
    ),
    React.createElement(
      NativeTabs.Trigger,
      { name: 'explore' },
      React.createElement(NativeTabs.Trigger.Label, null, 'Explore'),
      React.createElement(NativeTabs.Trigger.Icon, {
        src: require('@/assets/images/tabIcons/explore.png'),
        renderingMode: 'template',
      })
    )
  );
}

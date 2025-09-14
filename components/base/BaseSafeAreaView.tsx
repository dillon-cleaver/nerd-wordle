import { ReactNode } from "react";
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
  Edge,
} from "react-native-safe-area-context";

const BASE_MAX_WIDTH = 600;

type PageTemplateProps = SafeAreaViewProps & {
  children: ReactNode;
  edges?: Edge[];
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const BaseSafeAreaView = ({
  children,
  edges,
  containerStyle,
  contentContainerStyle,
  ...rest
}: PageTemplateProps) => {
  return (
    <SafeAreaView
      {...rest}
      edges={edges}
      style={[styles.container, containerStyle]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: BASE_MAX_WIDTH,
    width: "100%",
    alignSelf: "center",
  },
});

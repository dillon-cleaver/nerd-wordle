import { ReactNode } from "react";
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
  Edge,
} from "react-native-safe-area-context";
import { spacing } from "@/constants/styles";

const BASE_MAX_WIDTH = 600;

type PageTemplateProps = SafeAreaViewProps & {
  children: ReactNode;
  edges?: Edge[];
  addStyles?: StyleProp<ViewStyle>;
};

export const BaseSafeAreaView = ({
  children,
  edges,
  addStyles,
  ...rest
}: PageTemplateProps) => {
  return (
    <SafeAreaView {...rest} edges={edges} style={[styles.container, addStyles]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
    paddingHorizontal: spacing.md,
  },
});

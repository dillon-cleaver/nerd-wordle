import { ReactNode } from "react";
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
  Edge,
} from "react-native-safe-area-context";
import { spacing } from "@/constants/styles";

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
  const style = addStyles ? addStyles : null;

  return (
    <SafeAreaView {...rest} edges={edges} style={[styles.container, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

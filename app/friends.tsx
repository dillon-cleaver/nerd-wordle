// import {
//   View,
//   Text,
//   StyleSheet,
//   Button,
//   ActivityIndicator,
// } from "react-native";
// import {
//   colors,
//   fontFamily,
//   fontSize,
//   lineHeight,
//   spacing,
// } from "../constants/styles";
// import { signInWithGoogle } from "@/hooks/useGoogleSignIn";
// import { useUser } from "../hooks/useUser";

// export default function Friends() {
//   const { authUser, loading, userProfile } = useUser();

//   console.log(userProfile, "<--- userProfile");
//   console.log(loading, "<--- loading");
//   console.log(authUser, "<--- authUser");

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View>
//         <Text style={styles.text}>Welcome, {authUser?.displayName}</Text>
//         <Text style={styles.smallText}>{authUser?.email}</Text>
//       </View>
//       <Text style={styles.text}>See your friends scores here</Text>
//       <View>
//         {!authUser && (
//           <Button title="Sign in with Google" onPress={signInWithGoogle} />
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: colors.neutral.background,
//     gap: spacing.md,
//   },
//   text: {
//     color: colors.neutral.lightGray,
//     fontFamily: fontFamily.bitter.regular,
//     fontSize: fontSize.title.large,
//     lineHeight: lineHeight.title.large,
//   },
//   smallText: {
//     color: colors.neutral.white,
//     fontFamily: fontFamily.bitter.regular,
//     fontSize: fontSize.body.base,
//     lineHeight: lineHeight.body.base,
//   },
// });

import { View, StyleSheet, Text, StyleProp, ViewStyle } from "react-native";
import { borderRadius, colors, fontSize } from "@/constants/styles";
import { HintOutline } from "./HintOutline";

export type LetterBoxProps = {
  letter: string;
  isCorrect: boolean;
  isPresent: boolean;
  isCurrentGuess: boolean;
  invalidWord: boolean;
  showHint?: boolean;
  hintLetter?: string;
  category: string;
};

const LetterBox = ({
  letter,
  isCorrect,
  isPresent,
  isCurrentGuess,
  invalidWord,
  showHint = false,
  hintLetter = "",
  category,
}: LetterBoxProps) => {
  const cellStyles: StyleProp<ViewStyle> = [styles.container];

  const tileBackgroundColor =
    category === "videoGames"
      ? colors.categories.videoGames
      : category === "science"
      ? colors.categories.science
      : category === "fantasyAndSciFi"
      ? colors.categories.fantasyAndSciFi
      : category === "animeAndManga"
      ? colors.categories.animeAndManga
      : category === "tabletopAndBoardGames"
      ? colors.categories.tabletopAndBoardGames
      : colors.categories.techAndInternetCulture;

  if (!isCurrentGuess && letter) {
    if (isCorrect) {
      cellStyles.push({ backgroundColor: tileBackgroundColor });
    } else if (isPresent) {
      cellStyles.push(styles.present);
    } else {
      cellStyles.push(styles.absent);
    }
  }

  if (invalidWord) {
    cellStyles.push(styles.invalid);
  }

  return (
    <View style={cellStyles}>
      <Text style={styles.letter}>{letter}</Text>
      {showHint && (
        <>
          <HintOutline color={tileBackgroundColor} />
          <View style={styles.previewLetterWrapper}>
            <Text style={styles.previewLetter}>{hintLetter.toUpperCase()}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default LetterBox;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
    justifyContent: "center",
    backgroundColor: colors.tiles.default,
    alignItems: "center",
    borderRadius: borderRadius.md,
    position: "relative",
  },
  letter: {
    fontFamily: "Bitter-Bold",
    fontSize: fontSize.title.large,
    color: colors.neutral.white,
  },
  present: {
    backgroundColor: colors.tiles.wrongPlace,
  },
  absent: {
    backgroundColor: colors.neutral.black,
  },
  // TODO: Make the "invalid word state less scary/red" --->
  invalid: {
    borderColor: colors.semantic.error,
    backgroundColor: colors.semantic.error,
  },
  previewLetter: {
    textAlign: "center",
    fontFamily: "Bitter-Bold",
    fontSize: fontSize.title.large,
    color: colors.neutral.white,
    opacity: 0.4,
    zIndex: 1,
  },
  previewLetterWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

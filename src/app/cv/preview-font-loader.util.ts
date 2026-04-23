interface PreviewFontSetLike {
  ready: Promise<unknown>;
  load?: (font: string) => Promise<unknown>;
}

const PREVIEW_FONT_FACES = [
  "normal 12px 'Geist'",
  "600 14px 'Geist-SemiBold'",
  "700 14px 'GeistMono-SemiBold'",
];

export const ensurePreviewFontsReady = async (
  fonts: PreviewFontSetLike = document.fonts
): Promise<void> => {
  await fonts.ready;

  if (typeof fonts.load !== 'function') {
    return;
  }

  await Promise.all(
    PREVIEW_FONT_FACES.map(async (fontFace): Promise<void> => {
      try {
        await fonts.load?.(fontFace);
      } catch {
        // Ignore font load failures and continue with fallback fonts.
      }
    })
  );
};

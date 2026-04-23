interface PreviewUpdateGuard {
  nextToken: () => number;
  isCurrent: (token: number) => boolean;
}

export const createPreviewUpdateGuard = (): PreviewUpdateGuard => {
  let currentToken = 0;

  return {
    nextToken: (): number => {
      currentToken += 1;
      return currentToken;
    },
    isCurrent: (token: number): boolean => token === currentToken,
  };
};

export const parsingCookie = (cookie: string) => {
  const spliting = cookie.split(';');
  return {
    value: spliting[0],
    path: spliting[1].slice(6, spliting[1].length),
    exp: spliting[2].slice(9, spliting[2].length),
    httpOnly: spliting[3].trimStart(),
    secure: spliting[4].trimStart(),
    sameSite: spliting[5].slice(10, spliting[5].length),
  };
};

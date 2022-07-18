export function cleanUp(object: any, clean: string[]) {
  clean.forEach((e) => delete object[e]);
  return object;
}

export function cleanUpFilter(object: any, clean: string[]) {
  clean.forEach((e) => {
    if (object[e] === null) delete object[e];
  });
  return object;
}

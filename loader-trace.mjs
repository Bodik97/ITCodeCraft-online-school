export async function load(url, context, nextLoad) {
  try {
    return await nextLoad(url, context);
  } catch (e) {
    console.error('LOAD FAIL', url, e.code, e.message);
    throw e;
  }
}
export async function resolve(specifier, context, nextResolve) {
  try {
    const r = await nextResolve(specifier, context);
    return r;
  } catch (e) {
    console.error('RESOLVE FAIL', specifier, 'from', context.parentURL, e.message);
    throw e;
  }
}

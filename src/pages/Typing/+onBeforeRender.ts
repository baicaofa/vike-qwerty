export default async function onBeforeRender() {
  return {
    pageContext: {
      isHydration: false,
    },
  };
}

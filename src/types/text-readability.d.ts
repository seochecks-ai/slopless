declare module "text-readability" {
  type Readability = {
    fleschReadingEase(text: string): number;
    colemanLiauIndex(text: string): number;
    gunningFog(text: string): number;
  };

  const readability: Readability;
  export default readability;
}

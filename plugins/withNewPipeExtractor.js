const { withSettingsGradle } = require("@expo/config-plugins");
const MARKER = "RHYTHM_E_NEWPIPE_EXTRACTOR";
function addJitPack(settings) {
  if (settings.includes(MARKER)) return settings;
  const repositoriesBlock = /dependencyResolutionManagement\s*\{[\s\S]*?repositories\s*\{/m;
  if (repositoriesBlock.test(settings)) return settings.replace(repositoriesBlock, match => match + '\n        // ' + MARKER + '\n        maven { url "https://jitpack.io" }');
  return settings + '\n// ' + MARKER + '\nallprojects { repositories { maven { url "https://jitpack.io" } } }\n';
}
module.exports = function withNewPipeExtractor(config) {
  return withSettingsGradle(config, config => {
    if (config.modResults.language !== "groovy") throw new Error("RHYTHM E: Groovy settings.gradle is required.");
    config.modResults.contents = addJitPack(config.modResults.contents);
    return config;
  });
};

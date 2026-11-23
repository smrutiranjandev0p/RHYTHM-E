const { withSettingsGradle, withAppBuildGradle } = require("@expo/config-plugins");
const MARKER = "RHYTHM_E_NEWPIPE_EXTRACTOR";
function addJitPack(settings) {
  if (settings.includes(MARKER)) return settings;
  const repositoriesBlock = /dependencyResolutionManagement\s*\{[\s\S]*?repositories\s*\{/m;
  if (repositoriesBlock.test(settings)) return settings.replace(repositoriesBlock, match => match + '\n        // ' + MARKER + '\n        maven { url "https://jitpack.io" }');
  return settings + '\n// ' + MARKER + '\nallprojects { repositories { maven { url "https://jitpack.io" } } }\n';
}
function addDependency(appGradle) {
  if (appGradle.includes("NewPipeExtractor:v0.27.1")) return appGradle;
  const line = '    // GPL-3.0-or-later; see docs/THIRD_PARTY_LICENSES.md.\n    implementation "com.github.TeamNewPipe:NewPipeExtractor:v0.27.1"\n';
  const match = appGradle.match(/dependencies\s*\{/);
  if (!match) throw new Error("RHYTHM E: could not find dependencies block in android/app/build.gradle");
  const index = match.index + match[0].length;
  return appGradle.slice(0, index) + "\n" + line + appGradle.slice(index);
}
module.exports = function withNewPipeExtractor(config) {
  config = withSettingsGradle(config, config => {
    if (config.modResults.language !== "groovy") throw new Error("RHYTHM E: Groovy settings.gradle is required.");
    config.modResults.contents = addJitPack(config.modResults.contents); return config;
  });
  config = withAppBuildGradle(config, config => {
    if (config.modResults.language !== "groovy") throw new Error("RHYTHM E: Groovy app/build.gradle is required.");
    config.modResults.contents = addDependency(config.modResults.contents); return config;
  });
  return config;
};

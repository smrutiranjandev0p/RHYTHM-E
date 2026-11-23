const { withSettingsGradle, withAppBuildGradle } = require("@expo/config-plugins");

const MARKER = "RHYTHM_E_NEWPIPE_EXTRACTOR";

function addJitPack(settings) {
  if (settings.includes(MARKER)) return settings;
  const groovy = settings.includes("dependencyResolutionManagement") && settings.includes("repositoriesMode");
  if (groovy) {
    const block = `\n// ${MARKER}\ndependencyResolutionManagement {\n    repositories {\n        maven { url "https://jitpack.io" }\n    }\n}\n`;
    return settings + block;
  }
  return settings + `\n// ${MARKER}\nallprojects { repositories { maven { url "https://jitpack.io" } } }\n`;
}

function addDependency(appGradle) {
  if (appGradle.includes("NewPipeExtractor:v0.27.1")) return appGradle;
  const line = '    // NewPipeExtractor is included under GPL-3.0-or-later. See docs/THIRD_PARTY_LICENSES.md.\n    implementation "com.github.TeamNewPipe:NewPipeExtractor:v0.27.1"\n';
  const match = appGradle.match(/dependencies\s*\{/);
  if (!match) throw new Error("RHYTHM E: could not find dependencies block in android/app/build.gradle");
  const index = match.index + match[0].length;
  return appGradle.slice(0, index) + "\n" + line + appGradle.slice(index);
}

module.exports = function withNewPipeExtractor(config) {
  config = withSettingsGradle(config, config => {
    if (config.modResults.language !== "groovy") {
      throw new Error("RHYTHM E: NewPipeExtractor plugin currently supports Groovy settings.gradle only.");
    }
    config.modResults.contents = addJitPack(config.modResults.contents);
    return config;
  });
  config = withAppBuildGradle(config, config => {
    if (config.modResults.language !== "groovy") {
      throw new Error("RHYTHM E: NewPipeExtractor plugin currently supports Groovy app/build.gradle only.");
    }
    config.modResults.contents = addDependency(config.modResults.contents);
    return config;
  });
  return config;
};

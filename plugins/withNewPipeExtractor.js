const { withSettingsGradle } = require("@expo/config-plugins");

const MARKER = "RHYTHM_E_NEWPIPE_EXTRACTOR";

function addJitPack(settings) {
  if (settings.includes(MARKER)) return settings;

  const repositoriesBlock =
    /dependencyResolutionManagement\s*\{[\s\S]*?repositories\s*\{/m;

  if (repositoriesBlock.test(settings)) {
    return settings.replace(
      repositoriesBlock,
      match =>
        match +
        '\n        // ' +
        MARKER +
        '\n        maven { url "https://jitpack.io" }'
    );
  }

  // settings.gradle is a Settings script: project-level allprojects {} is invalid here.
  // Add JitPack as a dependency-resolution repository instead.
  return (
    settings +
    '\n\ndependencyResolutionManagement {\n' +
    '    repositories {\n' +
    '        // ' +
    MARKER +
    '\n        maven { url "https://jitpack.io" }\n' +
    '    }\n' +
    '}\n'
  );
}

module.exports = function withNewPipeExtractor(config) {
  return withSettingsGradle(config, config => {
    if (config.modResults.language !== "groovy") {
      throw new Error("RHYTHM E: Groovy settings.gradle is required.");
    }
    config.modResults.contents = addJitPack(config.modResults.contents);
    return config;
  });
};

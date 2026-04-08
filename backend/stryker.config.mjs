export default {
  testRunner: "jest",

  jest: {
    projectType: "custom"
  },

  mutate: [
  "controllers/authController.js",
  "controllers/destinationsController.js"
],

  reporters: ["progress", "clear-text", "html"],

  coverageAnalysis: "off"
};
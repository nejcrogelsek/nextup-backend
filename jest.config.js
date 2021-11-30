/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: [
		"js",
		"json",
		"ts"
	],
	rootDir: "test",
	testRegex: ".*\\.test\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest"
	},
	collectCoverageFrom: [
		"**/*.(t|j)s"
	],
	coverageDirectory: "../coverage",
};
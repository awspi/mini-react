import { getBaseRollupPlugins, getPackageJSON, resolvePkgPath } from './utils'
import generatePackageJson from 'rollup-plugin-generate-package-json'
const { name, module } = getPackageJSON('react')
//react 包的路径
const pkgPath = resolvePkgPath(name)
//react 产物路径
const pkgDistPath = resolvePkgPath(name, true)

export default [
	//react
	{
		input: `${pkgPath}/${module}`,
		output: {
			file: `${pkgDistPath}/index.js`,
			name: 'React',
			format: 'umd' //兼容cmj esm
		},
		plugins: [
			...getBaseRollupPlugins(),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				//不希望有其他原packagejson文件中的字段,手动指定要生成的
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					main: 'index.js'
				})
			})
		]
	},
	//jsx-runtime
	{
		input: `${pkgPath}/src/jsx.ts`,
		output: [
			// jsx-runtime
			{
				file: `${pkgDistPath}/jsx-runtime.js`,
				name: 'jsx-runtime',
				format: 'umd' //兼容cmj esm
			},
			// jsx-dev-runtime
			{
				file: `${pkgDistPath}/jsxDEV-runtime.js`,
				name: 'jsxDEV-runtime',
				format: 'umd' //兼容cmj esm
			}
		],
		plugins: getBaseRollupPlugins()
	}
]

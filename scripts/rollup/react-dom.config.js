import { getBaseRollupPlugins, getPackageJSON, resolvePkgPath } from './utils'
import generatePackageJson from 'rollup-plugin-generate-package-json'
import alias from '@rollup/plugin-alias'
const { name, module, peerDependencies } = getPackageJSON('react-dom')
//react-dom 包的路径
const pkgPath = resolvePkgPath(name)
//react-dom 产物路径
const pkgDistPath = resolvePkgPath(name, true)

export default [
	//react-dom
	{
		input: `${pkgPath}/${module}`,
		output: [
			{
				file: `${pkgDistPath}/index.js`,
				name: 'index.js',
				format: 'umd' //兼容cmj esm
			},
			{
				//兼容v17之前
				file: `${pkgDistPath}/client.js`,
				name: 'client.js',
				format: 'umd' //兼容cmj esm
			}
		],
		//不打包到react-dom
		external: [...Object.keys(peerDependencies)],
		plugins: [
			...getBaseRollupPlugins(),
			//类似 webpack resolve alias的功能
			alias({
				entries: {
					hostConfig: `${pkgPath}/src/hostConfig.ts`
				}
			}),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				//不希望有其他原packagejson文件中的字段,手动指定要生成的
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					peerDependencies: {
						react: version
					},
					main: 'index.js'
				})
			})
		]
	}
]

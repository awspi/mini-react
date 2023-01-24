import path from 'path'
import fs from 'fs'
import ts from 'rollup-plugin-typescript2'
import cjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

//源码路径
const pkgPath = path.resolve(__dirname, '../../packages')
//打包产物路径
const distPath = path.resolve(__dirname, '../../dist/node_modules')

/**
 * 获取包的package.json内容
 * @param {*} pkgName 包名
 * @returns
 */
export function getPackageJSON(pkgName) {
	//package.json路径
	const path = `${resolvePkgPath(pkgName)}/package.json`
	const str = fs.readFileSync(path, { encoding: 'utf8' })
	return JSON.parse(str)
}
/**
 * 获取包的路径
 * @param {*} pkgName 包名
 * @param {*} isDist 是否返回打包后的路径
 * @returns
 */
export function resolvePkgPath(pkgName, isDist) {
	//源码 or 打包后产物的路径
	if (isDist) {
		return `${distPath}/${pkgName}`
	} else {
		return `${pkgPath}/${pkgName}`
	}
}
/**
 * 获取所有基础的Rollup plugin
 */
export function getBaseRollupPlugins({
	alias = { __DEV__: true, preventAssignment: true },
	typescript = {}
} = {}) {
	// 1.解析cmj规范
	// @rollup/plugin-commonjs
	// 2.ts->js
	// rollup-plugin-typescript2
	return [replace(alias), cjs(), ts(typescript)]
}

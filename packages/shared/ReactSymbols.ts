//判断是否支持symbol
const supportSymbol = typeof Symbol === 'function' && Symbol.for
/**
 * ReactElement type的实现
 */
export const REACT_ELEMENT_TYPE = supportSymbol
	? Symbol.for('react.element')
	: 0xeac7

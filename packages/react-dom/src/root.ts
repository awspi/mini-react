// ReactDOM.createRoot(root).render(<APP/>)

import {
	createContainer,
	updateContainer
} from 'react-reconciler/src/fiberReconciler'
import { ReactElementType } from 'shared/ReactTypes'
import { Container } from './hostConfig'

export function createRoot(container: Container) {
	const root = createContainer(container)
	return {
		render(element: ReactElementType) {
			return updateContainer(element, root)
		}
	}
}

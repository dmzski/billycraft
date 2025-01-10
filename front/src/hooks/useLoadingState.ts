import { useState } from "react"

type LoadingState = "idle" | "loading" | "success" | "error"

type UseLoadingStateReturn = {
	state: LoadingState
	update: (newState: LoadingState) => void
	isLoading: boolean
	isSuccess: boolean
	isError: boolean
	isIdle: boolean
}

const useLoadingState = (
	initialState: LoadingState = "idle",
): UseLoadingStateReturn => {
	const [state, setState] = useState(initialState)

	const update = (newState: LoadingState) => {
		setState(newState)
	}

	const isLoading = state === "loading"
	const isSuccess = state === "success"
	const isError = state === "error"
	const isIdle = state === "idle"
	return {
		state,
		update,
		isLoading,
		isSuccess,
		isError,
		isIdle,
	}
}

export default useLoadingState

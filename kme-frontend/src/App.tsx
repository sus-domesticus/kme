import { useEffect, useRef, useState } from "react";
import { Factory } from "vexflow";
import {
	type FullRenderOptions,
	type StaffSystem,
	fullRender,
} from "vexflow-repl";
import request from "./api/request";

interface State {
	system: StaffSystem | null;
	flip: boolean;
}

export default function App() {
	const factoryRef = useRef<Factory | null>(null);
	const [state, setState] = useState<State>({ system: null, flip: false });

	const onClick = () => {
		if (state.system != null) {
			state.system.staves.pop();
		}
		setState({ system: state.system, flip: !state.flip });
	};

	useEffect(() => {
		request<StaffSystem>("GET", "/api/staff-system/sample", {}).then(
			(response) => {
				console.log(JSON.stringify(response.data));
				setState({ system: response.data, flip: true });
			},
		);

		// const div = document.getElementById("output")
		// if (div instanceof HTMLDivElement) {
		//   drawSample(div)
		// }
	}, []);
	if (state.system != null) {
		const div = document.getElementById("output");
		if (div instanceof HTMLDivElement) {
			const options: FullRenderOptions = {
				totalWidth: 1200,
				totalHeight: 600,
				x: 15,
				y: 0,
				defaultStaveWidth: 350,
				defaultSystemGap: 12,
			};
			if (factoryRef.current == null) {
				factoryRef.current = Factory.newFromElementId(
					div.id,
					options.totalWidth,
					options.totalHeight,
				);
			}
			fullRender(factoryRef.current, state.system, options);
		}
	}
	return (
		<>
			<button className="bg-blue-500" type="button" onClick={onClick}>
				Pop a stave
			</button>
			<div id="output" />
		</>
	);
}

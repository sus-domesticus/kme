import { v4 as uuidv4 } from "uuid";
import Chunk from "../components/Chunk";
import type { StaffSystem } from "../model/staff-system";
import { requireNotNull } from "./require-not-null";

export function getStaffSystemAtIndex(
  staffSystem: StaffSystem,
  index: number,
): StaffSystem {
  const staffSystemClone = structuredClone(staffSystem);
  staffSystemClone.staves = staffSystem.staves.map((staff) => {
    const staffClone = structuredClone(staff);
    staffClone.measures = [
      structuredClone(requireNotNull(staff.measures.at(index))),
    ];
    return staffClone;
  });
  return staffSystemClone;
}

export function getStaffSystemSlice(
  staffSystem: StaffSystem,
  start: number,
  end: number,
): StaffSystem {
  const staffSystemClone = structuredClone(staffSystem);
  for (const staveClone of staffSystemClone.staves) {
    staveClone.measures = staveClone.measures.slice(start, end);
  }
  return staffSystemClone;
}

export function getChunksFromStaffSystem(
  staffSystem: StaffSystem,
  stavesYs: number[] | null,
  onRender:
    | ((
        chunkIndex: number,
        width: number,
        height: number,
        stavesCoords: number[],
      ) => void)
    | null,
): JSX.Element[] {
  if (staffSystem.staves.length === 0) {
    return [];
  }

  const measureCount = requireNotNull(staffSystem.staves.at(0)).measures.length;
  if (
    staffSystem.staves.some((staff) => staff.measures.length !== measureCount)
  ) {
    throw new Error("All staves must have the same number of measures");
  }

  const chunks = [];
  for (let index = 0; index < measureCount; index++) {
    const newChunk = (
      <Chunk
        key={uuidv4()} // random ID because we always want to rerender
        staffSystem={getStaffSystemAtIndex(staffSystem, index)}
        onRender={(width: number, height: number, stavesCoords: number[]) => {
          if (onRender != null) {
            onRender(index, width, height, stavesCoords);
          }
        }}
        stavesYs={stavesYs}
      />
    );

    chunks.push(newChunk);
  }

  return chunks;
}

export function getChunkFromStaffSystemAtIndex(
  staffSystem: StaffSystem,
  index: number,
  stavesYs: number[] | null,
  onRender:
    | ((
        chunkIndex: number,
        width: number,
        height: number,
        stavesCoords: number[],
      ) => void)
    | null,
): JSX.Element {
  const slice = getStaffSystemSlice(staffSystem, index, index + 1);
  // console.log(slice.staves[0]?.measures.length, index);

  const array = getChunksFromStaffSystem(slice, stavesYs, onRender);
  if (array.length !== 1) {
    throw new Error("Bad index");
  }
  return requireNotNull(array[0]);
}

/* tslint:disable */
export enum Player {
  None,
  Blue,
  Red,
}
/**
*/
export enum MoveState {
  Success,
  Invalid,
  RowWin,
  GameOver,
}
/**
*/
/**
*/
export class Board {
  free(): void;
/**
* @returns {Board} 
*/
  static new(): Board;
/**
* @returns {number} 
*/
  player_turn(): number;
/**
* @returns {number} 
*/
  left_num(): number;
/**
* @returns {number} 
*/
  right_num(): number;
/**
* @param {number} value 
* @returns {MoveResult} 
*/
  set_left(value: number): MoveResult;
/**
* @param {number} value 
* @returns {MoveResult} 
*/
  set_right(value: number): MoveResult;
}
/**
*/
export class MoveResult {
  free(): void;
  index: number;
  state: number;
  win0: number;
  win1: number;
  win2: number;
  win3: number;
}

/**
* If `module_or_path` is {RequestInfo}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {RequestInfo | BufferSource | WebAssembly.Module} module_or_path
*
* @returns {Promise<any>}
*/
export default function init (module_or_path?: RequestInfo | BufferSource | WebAssembly.Module): Promise<any>;
        
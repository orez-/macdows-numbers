use wasm_bindgen::prelude::*;
use js_sys::Math;

extern crate web_sys;
use web_sys::console;

macro_rules! four_in_a_row {
    ( $iter:expr, $self:expr, $step:expr) => {
        {
            let mut count = 0;
            let mut seen = Player::None;
            for idx in $iter {
                console::log_1(&format!("{:?} {:?}", idx, seen).into());
                if $self.cells[idx] == seen {
                    count += 1;
                    if count == 4 && seen != Player::None {
                        // success
                        let idx = idx as u8;
                        return Some([idx, idx - $step, idx - $step * 2, idx - $step * 3]);
                    }
                }
                else {
                    seen = $self.cells[idx];
                    count = 1;
                }
            }
        }
    };
}


#[wasm_bindgen]
#[derive(Debug)]
#[derive(Clone, Copy)]
#[derive(PartialEq, Eq)]
pub enum Player {
    None,
    Blue,
    Red,
}

// idiot value objects to communicate results to js.
// woulda been nice to make this a single enum, but
// webasm understandably doesn't support this.

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum MoveState {
    Success,
    Invalid,
    RowWin,
    GameOver,
}

#[wasm_bindgen]
pub struct MoveResult {
    pub index: u8,
    pub state: MoveState,
    // Hey ideally these would be an array of some kind??
    // But webassembly's being a wuss.
    pub win0: u8,
    pub win1: u8,
    pub win2: u8,
    pub win3: u8,
}

impl MoveResult {
    fn new(index: u8, state: MoveState) -> Self {
        MoveResult {index: index, state: state, win0: 0, win1: 0, win2: 0, win3: 0}
    }
}

// main gamestate

#[wasm_bindgen]
pub struct Board {
    left_num: u8,
    right_num: u8,
    cells: [Player; 36],
    turn: Player,
}

impl Board {
    fn apply_set(&mut self, left_num: u8, right_num: u8) -> MoveResult {
        if self.turn == Player::None {
            return MoveResult::new(0, MoveState::GameOver);
        }
        // TODO: explore options for this mapping. dunno what's best!
        let index = match left_num * right_num {
             1 =>  0,  2 =>  1,  3 =>  2,  4 =>  3,  5 =>  4,  6 =>  5,
             7 =>  6,  8 =>  7,  9 =>  8, 10 =>  9, 12 => 10, 14 => 11,
            15 => 12, 16 => 13, 18 => 14, 20 => 15, 21 => 16, 24 => 17,
            25 => 18, 27 => 19, 28 => 20, 30 => 21, 32 => 22, 35 => 23,
            36 => 24, 40 => 25, 42 => 26, 45 => 27, 48 => 28, 49 => 29,
            54 => 30, 56 => 31, 63 => 32, 64 => 33, 72 => 34, 81 => 35,
            _ => unreachable!(),
        };
        if self.cells[index] != Player::None {
            return MoveResult::new(index as u8, MoveState::Invalid);
        }
        self.left_num = left_num;
        self.right_num = right_num;
        self.cells[index] = self.turn;
        match self.identify_consecutive_four(index) {
            Some(indexes) => {
                self.turn = Player::None;
                return MoveResult {
                    index: index as u8,
                    state: MoveState::RowWin,
                    win0: indexes[0],
                    win1: indexes[1],
                    win2: indexes[2],
                    win3: indexes[3],
                };
            },
            None => (),
        }
        self.turn = match self.turn {
            Player::Blue => Player::Red,
            Player::Red => Player::Blue,
            Player::None => unreachable!(),
        };
        MoveResult::new(index as u8, MoveState::Success)
    }

    fn identify_consecutive_four(&self, uindex: usize) -> Option<[u8; 4]> {
        // ↓
        console::log_1(&"↓".into());
        four_in_a_row!((uindex % 6..36).step_by(6), self, 6);

        // →
        console::log_1(&"→".into());
        let row_start = uindex / 6 * 6;
        four_in_a_row!(row_start..row_start + 6, self, 1);

        // ↘
        console::log_1(&"↘".into());
        if (uindex + 2) % 7 <= 4 && uindex != 30 && uindex != 5 {
            let (start, end) = if uindex % 6 >= uindex / 6 {  // x >= y
                (uindex % 7, 36 - uindex % 7 * 6)
            }
            else {
                (match uindex % 7 {6 => 6, 5 => 12, _ => unreachable!()}, 36)
            };
            four_in_a_row!((start..end).step_by(7), self, 7);
        }
        else {
            console::log_1(&"~ omitting ~".into());
        }

        // ↙
        console::log_1(&"↙".into());
        let mirror = uindex + 5 - 2 * (uindex % 6);  // horizontal flip
        if (mirror + 2) % 7 <= 4 && mirror != 30 && mirror != 5  {
            let (start, end) = if mirror % 6 > mirror / 6 {  // x' > y
                (uindex % 5, uindex % 5 * 6)
            }
            else {
                ((uindex % 5 + 1) * 6 - 1, 34)
            };
            four_in_a_row!((start..=end).step_by(5), self, 5);
        }
        else {
            console::log_1(&"~ omitting ~".into());
        }
        None
    }
}

fn random_start() -> u8 {
    (Math::random() * 9.) as u8 + 1
}


#[wasm_bindgen]
impl Board {
    pub fn new() -> Self {
        Board {
            left_num: random_start(),
            right_num: random_start(),
            cells: [Player::None; 36],
            turn: Player::Red,
        }
    }

    pub fn player_turn(&self) -> Player {
        self.turn
    }

    pub fn left_num(&self) -> u8 {
        self.left_num
    }

    pub fn right_num(&self) -> u8 {
        self.right_num
    }

    pub fn set_left(&mut self, value: u8) -> MoveResult {
        self.apply_set(value, self.right_num)
    }

    pub fn set_right(&mut self, value: u8) -> MoveResult {
        self.apply_set(self.left_num, value)
    }
}

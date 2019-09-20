use std::fmt;


macro_rules! four_in_a_row {
    ( $iter:expr, $self:expr ) => {
        {
            let mut count = 0;
            let mut seen = Player::None;
            for idx in $iter {
                print!("{:?} ", idx);
                if $self.cells[idx] == seen {
                    count += 1;
                    if count == 4 && seen != Player::None {
                        // success
                        return;
                    }
                }
                else {
                    seen = $self.cells[idx];
                    count += 1;
                }
            }
        }
    };
}


#[derive(Clone, Copy)]
#[derive(PartialEq)]
enum Player {
    None,
    Blue,
    Red,
}

struct Board {
    left_num: u8,
    right_num: u8,
    cells: [Player; 36],
    turn: Player,
}

impl Board {
    pub fn set_left(&mut self, value: u8) {
        self.left_num = value;
        self.apply_set()
    }

    pub fn set_right(&mut self, value: u8) {
        self.right_num = value;
        self.apply_set()
    }

    pub fn new() -> Self {
        Board {
            left_num: 1,  // TODO randomize
            right_num: 1,  // TODO randomize
            cells: [Player::None; 36],
            turn: Player::Blue,
        }
    }

    fn apply_set(&mut self) {
        // TODO: explore options for this mapping. dunno what's best!
        let index = match self.left_num * self.right_num {
             1 =>  0,  2 =>  1,  3 =>  2,  4 =>  3,  5 =>  4,  6 =>  5,
             7 =>  6,  8 =>  7,  9 =>  8, 10 =>  9, 12 => 10, 14 => 11,
            15 => 12, 16 => 13, 18 => 14, 20 => 15, 21 => 16, 24 => 17,
            25 => 18, 27 => 19, 28 => 20, 30 => 21, 32 => 22, 35 => 23,
            36 => 24, 40 => 25, 42 => 26, 45 => 27, 48 => 28, 49 => 29,
            54 => 30, 56 => 31, 63 => 32, 64 => 33, 72 => 34, 81 => 35,
            _ => unreachable!(),
        };
        self.cells[index] = self.turn;
        self.turn = match self.turn {
            Player::Blue => Player::Red,
            Player::Red => Player::Blue,
            Player::None => unreachable!(),
        };
    }

    fn identify_consecutive_four(&self, index: u8) {
        let uindex = index as usize;

        // ↓
        print!("↓ ");
        four_in_a_row!((uindex % 6..36).step_by(6), self);

        // →
        print!("\n→ ");
        let row_start = uindex / 6 * 6;
        four_in_a_row!(row_start..row_start + 6, self);

        // ↘
        print!("\n↘ ");
        if (uindex + 2) % 7 <= 4 && uindex != 30 && uindex != 5 {
            let (start, end) = if uindex % 6 >= uindex / 6 {  // x >= y
                (uindex % 7, 36 - uindex % 7 * 6)
            }
            else {
                (match uindex % 7 {6 => 6, 5 => 12, _ => unreachable!()}, 36)
            };
            four_in_a_row!((start..end).step_by(7), self);
        }
        else {
            print!("~ omitting ~");
        }

        // ↙
        print!("\n↙ ");
        let mirror = uindex + 5 - 2 * (uindex % 6);  // horizontal flip
        if (mirror + 2) % 7 <= 4 && mirror != 30 && mirror != 5  {
            let (start, end) = if mirror % 6 > mirror / 6 {  // x' > y
                (uindex % 5, uindex % 5 * 6)
            }
            else {
                ((uindex % 5 + 1) * 6 - 1, 34)
            };
            four_in_a_row!((start..=end).step_by(5), self);
        }
        else {
            print!("~ omitting ~");
        }
    }
}

fn term_color(player: Player, text: String) -> String {
    format!(
        "\x1b[{}m{}\x1b[39m",
        match player {
            Player::None => 90,
            Player::Blue => 94,
            Player::Red => 31,
        },
        text,
    )
}


impl fmt::Debug for Board {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for y in 0..6 {
            for x in 0..6 {
                write!(f, "{}", term_color(self.cells[y * 6 + x], "x".to_string()))?;
            }
            write!(f, "\n")?;
        }
        write!(f, "{} {}", self.left_num, self.right_num)
    }
}


fn main() {
    let mut board = Board::new();
    println!("{:?}", board);
    board.set_left(5);
    println!("{:?}", board);
    board.set_right(7);
    println!("{:?}", board);
    for i in 0..36 {
        println!("\n: {:?}", i);
        board.identify_consecutive_four(i);
        println!("");
    }
}
